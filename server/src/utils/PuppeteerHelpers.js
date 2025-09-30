class PuppeteerHelpers {

    static async sendValuesInput(page, selector, value, delay = 50) {
        if (!page || !selector || value === undefined) {
            throw new Error("Parâmetros inválidos para sendValuesInput");
        }
        await page.waitForSelector(selector);  // garante que o input existe
        await page.type(selector, value, { delay }); // digita o valor
    }
    
}

module.exports = PuppeteerHelpers;