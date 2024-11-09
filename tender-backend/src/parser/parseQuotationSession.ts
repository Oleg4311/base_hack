import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";
import { toIsoDate } from "./utils";
import type { QuotationSession, Specification } from "./models";
import type { DeepPartial } from "./types";

export const getContent = async (link: string) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(link, { waitUntil: "networkidle0" });

	const showMores = await page.$$("#show-more-button");
	await Promise.all(
		showMores.map(
			async el => await el.evaluate(e => (e as HTMLSpanElement).click())
		)
	);
	await page.waitForNetworkIdle();

	const content = await page.content();

	await browser.close();

	return content;
};

export const parseQuotationSession = async (
	link: string
): Promise<DeepPartial<QuotationSession>> => {
	const content = await getContent(link);

	const {
		window: { document },
	} = new JSDOM(content);

	const [label, status, title] = [...document.querySelectorAll(".jyCXJd")].map(
		el => el.textContent?.trim()
	);

	const [
		contractConditionElement,
		contractEnforcedElement,
		customerElement,
		lawElement,
	] = document.querySelectorAll(".eoWxtN > div");

	const contractCondition =
		contractConditionElement.lastChild?.textContent?.trim();

	const contractEnforced = contractEnforcedElement.textContent?.trim();

	const customerAnchor = customerElement.firstChild as HTMLAnchorElement | null;
	const customerName = customerAnchor?.textContent?.trim();
	const customerLink = customerAnchor?.href;

	const law = lawElement.lastChild?.textContent?.trim();

	const dateElement = document.querySelector(
		"#auction-view-main-info__dates > div"
	);

	const [, date] = [...(dateElement?.childNodes ?? [])].map(el =>
		el.textContent?.trim()
	);
	const [, dateStart, timeStart, , dateEnd, timeEnd] = date?.split(" ") ?? [];

	// const documents = [
	// 	...document.querySelectorAll(".eoWxtN > div > div > div > a"),
	// ].map(el => (el as HTMLAnchorElement).href);

	const specifications = [
		...document.querySelectorAll(
			".AuctionViewSpecificationCardStyles__CardContainer-sc-1bupkfz-0"
		),
	].map(el => {
		const image = (el.querySelector("img") as HTMLImageElement).src;
		const [title, , totalPrice] = [
			...el.querySelectorAll(
				".AuctionViewSpecificationCardStyles__CardHeader-sc-1bupkfz-1"
			),
		].map(el => el?.textContent?.trim());

		const [quantity, pricePerUnit] = [
			...el.querySelectorAll(".LabeledValue-sc-10trpha-0 > div"),
		].map(el => el.textContent?.trim());

		const additionalInfo = document.querySelector(
			"#auction-spec__additional-info"
		);
		const additionalInfoRows = [
			...(additionalInfo?.querySelectorAll(".row") ?? []),
		];

		let propertiesHeaderIndex: number | null = additionalInfoRows.findIndex(
			el => el.innerHTML.includes("Характеристики")
		);
		if (propertiesHeaderIndex === -1) propertiesHeaderIndex = null;

		let deliveryScheduleHeaderIndex: number | null =
			additionalInfoRows.findIndex(el =>
				el.innerHTML.includes("График поставки")
			);
		if (deliveryScheduleHeaderIndex === -1) deliveryScheduleHeaderIndex = null;

		const infoRows = additionalInfoRows.slice(
			0,
			propertiesHeaderIndex ??
				deliveryScheduleHeaderIndex ??
				additionalInfoRows.length
		);
		const propertiesRows = additionalInfoRows.slice(
			propertiesHeaderIndex
				? propertiesHeaderIndex + 1
				: additionalInfoRows.length,
			deliveryScheduleHeaderIndex ?? additionalInfoRows.length
		);

		const deliveryScheduleRows = additionalInfoRows.slice(
			deliveryScheduleHeaderIndex
				? deliveryScheduleHeaderIndex + 1
				: additionalInfoRows.length
		);

		const [
			[okpd2Code, okpd2Title] = [],
			[kpg3Code, kpg3Title] = [],
			[model, vendor] = [],
		] = infoRows.map(row =>
			[...row.querySelectorAll(".LabeledValue-sc-10trpha-0 > div")].map(el =>
				el.textContent?.trim()
			)
		);

		const [
			[deliveryDates, deliveryQuantity, deliveryAddress, deliveryDetails] = [],
		] = deliveryScheduleRows.map(row =>
			[...row.querySelectorAll(".LabeledValue-sc-10trpha-0 > div")].map(el =>
				el.textContent?.trim()
			)
		);

		const properties = Object.fromEntries(
			propertiesRows.map(el => {
				const name =
					el
						.querySelector(
							".AuctionViewSpecificationCardStyles__CharacteristicTableName-sc-1bupkfz-6"
						)
						?.textContent?.trim() ?? "";
				const value = el
					.querySelector(".EllipsedSpan__WordBreakSpan-sc-r2mbuv-0")
					?.textContent?.trim();
				return [name, value];
			})
		);

		return {
			image,
			title,
			quantity,
			pricePerUnit,
			totalPrice,
			okpd2Code,
			okpd2Title,
			kpg3Code,
			kpg3Title,
			model,
			vendor,
			properties,
			deliveryDates,
			deliveryAddress,
			deliveryQuantity,
			deliveryDetails,
		} satisfies DeepPartial<Specification>;
	});

	const session = {
		label,
		status,
		title,
		contractCondition,
		contractEnforced,
		customerName,
		customerLink,
		law,
		dateStart: new Date(`${toIsoDate(dateStart)}T${timeStart}`).toISOString(),
		dateEnd: new Date(`${toIsoDate(dateEnd)}T${timeEnd}`).toISOString(),
		// documents,
		specifications,
	};

	return session;
};
