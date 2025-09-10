class PuppeteerHelpers {
    /**
     * Digita um valor em um input.
     * @param {import('puppeteer').Page} page - Página do Puppeteer
     * @param {string} selector - Seletor CSS do input
     * @param {string} value - Valor a ser digitado
     */
    static async sendValuesInput(page, selector, value, delay = 50) {
        if (!page || !selector || value === undefined) {
            throw new Error("Parâmetros inválidos para sendValuesInput");
        }
        await page.waitForSelector(selector);  // garante que o input existe
        await page.type(selector, value, { delay }); // digita o valor
    }
    
}

module.exports = PuppeteerHelpers;