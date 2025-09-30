// services/FretebrasService.js
const puppeteer = require('puppeteer');
const PuppeteerHelpers = require('../utils/PuppeteerHelpers');
const axios = require('axios');
const redisCache = require('../utils/RedisCache');

class FretebrasService {
    static async performLogin() {
        const lockKey = 'fretebras_login_lock';
        let browser;
        let page;
        
        try {
            const lockAcquired = await redisCache.acquireLock(lockKey);
            if (!lockAcquired) {
                
                await new Promise(resolve => setTimeout(resolve, 5000));
                return this.getSession();
            }

            browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            page = await browser.newPage();
            
            await page.setViewport({ width: 1280, height: 800 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            
            
            await page.goto("https://www.fretebras.com.br/tipo-de-cadastro?q=entrar", { waitUntil: "networkidle2", timeout: 60000 });
            
            try {
                const closeBtn = await page.$('.adopt-c-gAXbyQ');
                if (closeBtn) {
                    await closeBtn.click();
                    await page.waitForTimeout(1000);
                }
            } catch (error) {}

            const links = await page.$$(".selector-card");
            if (links.length < 2) throw new Error('Botões de login não encontrados');
            
           
            await Promise.all([
                links[1].click(), 
                page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 })
            ]);

            await page.waitForSelector('input[name="username"]', { timeout: 10000 });
            await PuppeteerHelpers.sendValuesInput(page, 'input[name="username"]', process.env.EMAIL_FRETEBRAS);
            await PuppeteerHelpers.sendValuesInput(page, 'input[name="password"]', process.env.PASSWORD_FRETEBRAS);
            
            await page.evaluate(() => {
                const loginButton = document.querySelector("#kc-login");
                if (loginButton && loginButton.shadowRoot) {
                    const button = loginButton.shadowRoot.querySelector("button");
                    if (button) { button.click(); return true; }
                }
                throw new Error('Botão de login não encontrado no Shadow DOM');
            });

            await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 });
            const cookies = await page.cookies();
            const tokenBff = cookies.find(c => c.name === "_TOKEN_BFF")?.value;
            const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
            
            console.log(tokenBff);
            if (!tokenBff) throw new Error('Token _TOKEN_BFF não encontrado após login');

            const session = { tokenSession: tokenBff, cookieSession: cookieString };
            await redisCache.set('fretebras_session', session, 3300);
            return session;

        } catch (error) {
            console.error('Erro de login:', error);
            if (page) await page.screenshot({ path: './login-error.png' });
            throw error;
        } finally {
            if (browser) await browser.close();
            await redisCache.releaseLock(lockKey);
        }
    }

    static async getSession() {
        let session = await redisCache.get('fretebras_session');
        if (!session) {
            session = await this.performLogin();
        }
        return session;
    }

    static async makeAuthenticatedRequest(url, options = {}) {
    let session = await this.getSession();
        
        const headers = {
            'Authorization': `Bearer ${session.tokenSession}`,
            'Cookie': session.cookieSession,
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
            ...options.headers
        };

        try {
            const response = await axios.get(url, {
                headers,
                timeout: 10000,
                ...options
            });
            return response;
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 410) {
                console.warn('Sessão expirada ou inválida. Tentando novo login...');
                await redisCache.delete('fretebras_session');
                session = await this.performLogin();
                
            
                const newHeaders = {
                    'Authorization': `Bearer ${session.tokenSession}`,
                    'Cookie': session.cookieSession,
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
                    ...options.headers
                };

                return await axios.get(url, {
                    headers: newHeaders,
                    timeout: 10000,
                    ...options
                });
            }
            throw error;
        }
    }

    static async getLoads(page, disable = false) {
        console.log("Obtendo cargas - Página:", page, " | Desabilitados:", disable);
        const endpoint = `https://freight-management-bff.fretebras.com.br/freights?disabled=${disable}&scheduled=0&page=${page}`;
        const response = await this.makeAuthenticatedRequest(endpoint);
        return { status: response.status, data: response.data, total: response.total };
    }
    static async getTruckers(freightId) {
        const endpoint = `https://web.fretebras.com.br/freights/${freightId}/truckers?radius=50&forceSearch=1`;
        const response = await this.makeAuthenticatedRequest(endpoint);
        return { status: response.status, data: response.data };
    }

    static async getPhoneTrucker(truckerId) {
        const endpoint = `https://trucker-profile-bff.fretebras.com.br/trucker/${truckerId}/phones/`;
        
        const response = await this.makeAuthenticatedRequest(endpoint);
        
        return { status: response.status, data: response.data };
    }
}

module.exports = FretebrasService;