import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";
import { parseQuotationSession } from "./parseQuotationSession";
import { performance } from "perf_hooks";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async function () {
	const browser = await puppeteer.launch();

	const page = await browser.newPage();

	await page.goto(
		"https://zakupki.mos.ru/purchase/list?page=1&perPage=50&sortField=PublishDate&sortDesc=true&filter=%7B%22typeIn%22%3A%5B1%5D%2C%22regionPaths%22%3A%5B%22.1.504.%22%5D%2C%22auctionSpecificFilter%22%3A%7B%22stateIdIn%22%3A%5B19000002%2C19000005%2C19000003%2C19000004%2C19000008%5D%7D%2C%22needSpecificFilter%22%3A%7B%7D%2C%22tenderSpecificFilter%22%3A%7B%7D%2C%22ptkrSpecificFilter%22%3A%7B%7D%7D&state=%7B%22currentTab%22%3A3%7D",
		{ waitUntil: "networkidle0" }
	);

	const content = await page.content();

	const {
		window: { document },
	} = new JSDOM(content);

	const links: string[] = [];

	const totalPages = Number(
		[...document.querySelectorAll('[type="pageItem"]')].at(-1)?.textContent
	);

	for (let p = 1; p <= 2; p++) {
		console.log(`Страница с ссылками ${p} из ${totalPages}`);
		await page.$eval('[aria-label="Next item"]', el =>
			(el as HTMLAnchorElement).click()
		);
		await page.waitForNetworkIdle();

		links.push(
			...[
				...document.querySelectorAll(
					"a.CardStyles__MainInfoNameHeader-sc-18miw4v-9"
				),
			].map(el => (el as HTMLAnchorElement).href)
		);
	}

	await browser.close();

	let totalTime = 0;

	for (let i = 0; i < links.length; i++) {
		try {
			const start = performance.now();

			const session = await parseQuotationSession(
				`https://zakupki.mos.ru${links[i]}`
			);

			const end = performance.now();
			totalTime = end - start;

			console.log(
				`Линка ${i + 1} из ${links.length}...\nОбщее время: ${Math.round(totalTime / 1000 / 60)} мин.\nСреднее время выполнения: ${Math.round(totalTime / i + 1)} мс.\n`
			);

			await prisma.session.create({
				data: {
					...session,
					specifications: {
						create: session.specifications.map(s => ({
							...s,
							properties: {
								createMany: {
									data: {
										...s.properties,
									},
								},
							},
						})),
					},
				},
			});

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			continue;
		}
	}

	console.log(
		`\nГотово. Общее время: ${Math.round(totalTime / 1000 / 60)} мин.`
	);
	console.log(
		`Среднее время выполнения: ${Math.round(totalTime / links.length)} мс.`
	);
})();
