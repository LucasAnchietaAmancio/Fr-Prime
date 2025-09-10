const puppeteer = require('puppeteer');
const PuppeteerHelpers = require('../utils/PuppeteerHelpers');
const axios = require('axios');

class FretebrasService {
    static async performLogin() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        try {
            await page.goto("https://www.fretebras.com.br/tipo-de-cadastro?q=entrar", { waitUntil: "networkidle2" });

            // 🔹 Fecha popup se existir
            const closeBtn = await page.$('.adopt-c-gAXbyQ');
            if (closeBtn) {
                await closeBtn.click();
                console.log("Popup fechado!");
            }

            // 🔹 Seleciona opção de login
            await page.waitForSelector('.selector-card');
            const links = await page.$$(".selector-card");
            await Promise.all([
                links[1].click(),
                page.waitForNavigation({ waitUntil: "networkidle2" }),
            ]);

            // 🔹 Preenche usuário e senha
            await PuppeteerHelpers.sendValuesInput(page, 'input[name="username"]', process.env.EMAIL_FRETEBRAS);
            await PuppeteerHelpers.sendValuesInput(page, 'input[name="password"]', process.env.PASSWORD_FRETEBRAS);

            // 🔹 Clica no botão de login (Shadow DOM)
            await page.evaluate(() => {
                document.querySelector("#kc-login").shadowRoot.querySelector("button").click();
            });

            await page.waitForNavigation({ waitUntil: "networkidle2" });

            // 🔹 Captura cookies e token
            const cookies = await page.cookies();
            const tokenBff = cookies.find(c => c.name === "_TOKEN_BFF")?.value;
            const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');

            if (!tokenBff) {
                throw new Error("Token não encontrado!");
            }

            return { tokenSession: tokenBff, cookieSession: cookieString };

        } catch (error) {
            console.error("Erro ao navegar para a página de login:", error);
            throw error;
        } finally {
            // 🔹 Fecha o browser SEMPRE
            await browser.close();
        }
    }

    static async getLoads(token, cookie) {
        const endpoint = 'https://freight-management-bff.fretebras.com.br/freights?disabled=false&scheduled=0&page=1&perPage&query';

        try {
            const response = await axios.get(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cookie': cookie,
                }
            });

            return {
                status: response.status,
                data: response.data
            };

        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw { response: { status: 401, message: 'Sessão inválida ou expirada' } };
            }

            console.error("Erro em getLoads:", error);
            throw error;
        }
    }

    static async getTruckers(token, cookie, freightId) {
        const endpoint = `https://web.fretebras.com.br/freights/${freightId}/truckers?radius=50&forceSearch=1`;

        try {
            const response = await axios.get(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cookie': cookie,
                }
            });

            return {
                status: response.status,
                data: response.data
            };
        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw { response: { status: 401, message: 'Sessão inválida ou expirada' } };
            }
            console.error("Erro em getTruckers:", error);
            throw error;
        }
    }
}

module.exports = FretebrasService;
