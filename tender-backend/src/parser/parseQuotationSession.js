"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQuotationSession = exports.getContent = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const jsdom_1 = require("jsdom");
const utils_1 = require("./utils");
const getContent = async (link) => {
    const browser = await puppeteer_1.default.launch();
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: "networkidle0" });
    const showMores = await page.$$("#show-more-button");
    await Promise.all(showMores.map(async (el) => await el.evaluate(e => e.click())));
    await page.waitForNetworkIdle();
    const content = await page.content();
    await browser.close();
    return content;
};
exports.getContent = getContent;
const parseQuotationSession = async (link) => {
    const content = await (0, exports.getContent)(link);
    const { window: { document }, } = new jsdom_1.JSDOM(content);
    const [label, status, title] = [...document.querySelectorAll(".jyCXJd")].map(el => el.textContent?.trim());
    const descriptionFields = Object.fromEntries([...document.querySelectorAll(".eoWxtN")].map(el => [
        el.firstChild?.textContent ?? "",
        el.lastChild,
    ]));
    const contractConditionElement = descriptionFields["Условия исполнения контракта"];
    const customerElement = descriptionFields["Заказчик"];
    const lawElement = descriptionFields["Заключение происходит в соответствии с законом"];
    const contractEnforcedElement = descriptionFields["Обеспечение исполнения контракта"];
    const contractCondition = contractConditionElement?.lastChild?.textContent?.trim();
    const contractEnforced = contractEnforcedElement?.textContent?.trim();
    const customerAnchor = customerElement?.firstChild;
    const customerName = customerAnchor?.textContent?.trim();
    const customerLink = customerAnchor?.href;
    const law = lawElement?.lastChild?.textContent?.trim();
    const dateElement = document.querySelector("#auction-view-main-info__dates > div");
    const [, date] = [...(dateElement?.childNodes ?? [])].map(el => el.textContent?.trim());
    const [, dateStart, timeStart, , dateEnd, timeEnd] = date?.split(" ") ?? [];
    // const documents = [
    // 	...document.querySelectorAll(".eoWxtN > div > div > div > a"),
    // ].map(el => (el as HTMLAnchorElement).href);
    const specifications = [
        ...document.querySelectorAll(".AuctionViewSpecificationCardStyles__CardContainer-sc-1bupkfz-0"),
    ].map(el => {
        const image = el.querySelector("img").src;
        const [title, , totalPrice] = [
            ...el.querySelectorAll(".AuctionViewSpecificationCardStyles__CardHeader-sc-1bupkfz-1"),
        ].map(el => el?.textContent?.trim());
        const [quantity, pricePerUnit] = [
            ...el.querySelectorAll(".LabeledValue-sc-10trpha-0 > div"),
        ].map(el => el.textContent?.trim());
        const additionalInfo = document.querySelector("#auction-spec__additional-info");
        const additionalInfoRows = [
            ...(additionalInfo?.querySelectorAll(".row") ?? []),
        ];
        let propertiesHeaderIndex = additionalInfoRows.findIndex(el => el.innerHTML.includes("Характеристики"));
        if (propertiesHeaderIndex === -1)
            propertiesHeaderIndex = null;
        let deliveryScheduleHeaderIndex = additionalInfoRows.findIndex(el => el.innerHTML.includes("График поставки"));
        if (deliveryScheduleHeaderIndex === -1)
            deliveryScheduleHeaderIndex = null;
        const infoRows = additionalInfoRows.slice(0, propertiesHeaderIndex ??
            deliveryScheduleHeaderIndex ??
            additionalInfoRows.length);
        const propertiesRows = additionalInfoRows.slice(propertiesHeaderIndex
            ? propertiesHeaderIndex + 1
            : additionalInfoRows.length, deliveryScheduleHeaderIndex ?? additionalInfoRows.length);
        const deliveryScheduleRows = additionalInfoRows.slice(deliveryScheduleHeaderIndex
            ? deliveryScheduleHeaderIndex + 1
            : additionalInfoRows.length);
        const [[okpd2Code, okpd2Title] = [], [kpg3Code, kpg3Title] = [], [model, vendor] = [],] = infoRows.map(row => [...row.querySelectorAll(".LabeledValue-sc-10trpha-0 > div")].map(el => el.textContent?.trim()));
        const [[deliveryDates, deliveryQuantity, deliveryAddress, deliveryDetails] = [],] = deliveryScheduleRows.map(row => [...row.querySelectorAll(".LabeledValue-sc-10trpha-0 > div")].map(el => el.textContent?.trim()));
        const properties = Object.fromEntries(propertiesRows
            .map(el => {
            const name = el
                .querySelector(".AuctionViewSpecificationCardStyles__CharacteristicTableName-sc-1bupkfz-6")
                ?.textContent?.trim() ?? "";
            const value = el
                .querySelector(".EllipsedSpan__WordBreakSpan-sc-r2mbuv-0")
                ?.textContent?.trim();
            return [name, value];
        })
            .filter(([name]) => Boolean(name)));
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
        };
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
        dateStart: new Date(`${(0, utils_1.toIsoDate)(dateStart)}T${timeStart}`).toISOString(),
        dateEnd: new Date(`${(0, utils_1.toIsoDate)(dateEnd)}T${timeEnd}`).toISOString(),
        // documents,
        specifications,
    };
    return session;
};
exports.parseQuotationSession = parseQuotationSession;
