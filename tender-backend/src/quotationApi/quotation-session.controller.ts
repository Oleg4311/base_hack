import { Controller, Post, Body } from "@nestjs/common";
import { QuotationSessionService } from "./quotation-session.service";

@Controller("quotation-sessions")
export class QuotationSessionController {
	constructor(
		private readonly quotationSessionService: QuotationSessionService
	) {}

	@Post("check_title")
	async checkTitle(
		@Body("url") url: string,
		@Body("fileBuffer") fileBuffer: Buffer,
		@Body("fileName") fileName: string
	) {
		const endpointUrl = "http://127.0.0.1:5300/api/check_title";
		return await this.quotationSessionService.processAndSendToEndpoint(
			{ url, fileBuffer, fileName },
			endpointUrl
		);
	}

	@Post("check_contract_enforced")
	async checkContractEnforced(
		@Body("url") url: string,
		@Body("fileBuffer") fileBuffer: Buffer,
		@Body("fileName") fileName: string
	) {
		const endpointUrl = "http://127.0.0.1:5300/api/check_contract_enforced";
		return await this.quotationSessionService.processAndSendToEndpoint(
			{ url, fileBuffer, fileName },
			endpointUrl
		);
	}

	@Post("check_photo")
	async checkPhoto(
		@Body("url") url: string,
		@Body("fileBuffer") fileBuffer: Buffer,
		@Body("fileName") fileName: string
	) {
		const endpointUrl = "http://127.0.0.1:5300/api/check_photo";
		return await this.quotationSessionService.processAndSendToEndpoint(
			{ url, fileBuffer, fileName },
			endpointUrl
		);
	}
}
