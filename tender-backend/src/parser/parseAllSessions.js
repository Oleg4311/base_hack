"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const jsdom_1 = require("jsdom");
const parseQuotationSession_1 = require("./parseQuotationSession");
const perf_hooks_1 = require("perf_hooks");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
(async function () {
    const browser = await puppeteer_1.default.launch();
    const page = await browser.newPage();
    await page.goto("https://zakupki.mos.ru/purchase/list?page=1&perPage=50&sortField=PublishDate&sortDesc=true&filter=%7B%22typeIn%22%3A%5B1%5D%2C%22regionPaths%22%3A%5B%22.1.504.%22%5D%2C%22auctionSpecificFilter%22%3A%7B%22stateIdIn%22%3A%5B19000002%2C19000005%2C19000003%2C19000004%2C19000008%5D%7D%2C%22needSpecificFilter%22%3A%7B%7D%2C%22tenderSpecificFilter%22%3A%7B%7D%2C%22ptkrSpecificFilter%22%3A%7B%7D%7D&state=%7B%22currentTab%22%3A3%7D", { waitUntil: "networkidle0" });
    const content = await page.content();
    const { window: { document }, } = new jsdom_1.JSDOM(content);
    const links = [];
    const totalPages = Number([...document.querySelectorAll('[type="pageItem"]')].at(-1)?.textContent);
    for (let p = 1; p <= 2; p++) {
        console.log(`Страница с ссылками ${p} из ${totalPages}`);
        await page.$eval('[aria-label="Next item"]', el => el.click());
        await page.waitForNetworkIdle();
        links.push(...[
            ...document.querySelectorAll("a.CardStyles__MainInfoNameHeader-sc-18miw4v-9"),
        ].map(el => el.href));
    }
    await browser.close();
    let totalTime = 0;
    for (let i = 0; i < links.length; i++) {
        try {
            const start = perf_hooks_1.performance.now();
            const session = await (0, parseQuotationSession_1.parseQuotationSession)(`https://zakupki.mos.ru${links[i]}`);
            const end = perf_hooks_1.performance.now();
            totalTime += end - start;
            console.log(`Линка ${i + 1} из ${links.length}...`);
            console.log(`Общее время: ${Math.round(totalTime / 1000)} с.`);
            console.log(`Среднее время выполнения: ${Math.round(totalTime / (i + 1))} мс.\n`);
            await prisma.session.create({
                data: {
                    ...session,
                    specifications: {
                        create: session.specifications?.map(s => ({
                            ...s,
                            properties: {
                                createMany: {
                                    data: Object.entries(s?.properties ?? {}).map(([name, value]) => ({ name, value })),
                                },
                            },
                        })),
                    },
                },
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
            continue;
        }
    }
    console.log(`\nГотово. Общее время: ${Math.round(totalTime / 1000)} с.`);
    console.log(`Среднее время выполнения: ${Math.round(totalTime / links.length)} мс.`);
})();
