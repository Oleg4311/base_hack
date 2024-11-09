import { Controller, Post, Body } from "@nestjs/common";
import { QuotationSessionService } from "./quotation-session.service";

@Controller("quotation-sessions")
export class QuotationSessionController {
	constructor(
		private readonly quotationSessionService: QuotationSessionService
	) {}

	@Post("check_title")
	async checkTitle(@Body() data: any) {
		const endpointUrl = "http://127.0.0.1:5300/api/check_title";
		return await this.quotationSessionService.processAndSendToEndpoint(
			data,
			endpointUrl
		);
	}

	@Post("check_contract_enforced")
	async checkContractEnforced(@Body() data: any) {
		const endpointUrl = "http://127.0.0.1:5300/api/check_contract_enforced";
		return await this.quotationSessionService.processAndSendToEndpoint(
			data,
			endpointUrl
		);
	}

	@Post("check_photo")
	async checkPhoto(@Body() data: any) {
		const endpointUrl = "http://127.0.0.1:5300/api/check_photo";
		return await this.quotationSessionService.processAndSendToEndpoint(
			data,
			endpointUrl
		);
	}
}
