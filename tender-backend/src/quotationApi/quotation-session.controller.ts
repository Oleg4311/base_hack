// quotation-session.controller.ts

import { Controller, Post, Body } from "@nestjs/common";
import { QuotationSessionService } from "./quotation-session.service";

@Controller("quotation-sessions")
export class QuotationSessionController {
	constructor(
		private readonly quotationSessionService: QuotationSessionService
	) {}

	@Post("check")
	async checkData(@Body() data: any) {
		// Вызов сервиса для обработки данных и отправки их на внешние API
		return await this.quotationSessionService.processAndSendData(data);
	}
}
