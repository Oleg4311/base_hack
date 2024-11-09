import {
	Controller,
	Post,
	Body,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { QuotationSessionService } from "./quotation-session.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("quotation-sessions")
export class QuotationSessionController {
	constructor(
		private readonly quotationSessionService: QuotationSessionService
	) {}

	@Post("check_title")
	@UseInterceptors(FileInterceptor("file"))
	async checkTitle(@UploadedFile() file, @Body("url") url: string) {
		const endpointUrl = "http://10.10.116.232:5300/api/check_title";
		return await this.quotationSessionService.processAndSendToEndpoint(
			{ url, file },
			endpointUrl
		);
	}

	@Post("check_contract_enforced")
	@UseInterceptors(FileInterceptor("file"))
	async checkContractEnforced(@UploadedFile() file, @Body("url") url: string) {
		const endpointUrl = "http://10.10.116.232:5300/api/check_contract_enforced";
		return await this.quotationSessionService.processAndSendToEndpoint(
			{ url, file },
			endpointUrl
		);
	}

	@Post("check_photo")
	@UseInterceptors(FileInterceptor("file"))
	async checkPhoto(@UploadedFile() file, @Body("url") url: string) {
		const endpointUrl = "http://10.10.116.232:5300/api/check_photo";
		return await this.quotationSessionService.processAndSendToEndpoint(
			{ url, file },
			endpointUrl
		);
	}
}
