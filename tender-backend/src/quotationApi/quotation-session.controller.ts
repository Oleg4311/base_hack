import {
	Controller,
	Post,
	Body,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { QuotationSessionService } from "./quotation-session.service";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

@Controller("quotation-sessions")
export class QuotationSessionController {
	constructor(
		private readonly quotationSessionService: QuotationSessionService,
		private readonly httpService: HttpService
	) {}

	@Post("check")
	async checkData(@Body() data: any) {
		// Сохранение данных в базе
		await this.quotationSessionService.create(data);

		// Отправка данных на внешние API
		try {
			const titleResponse = await lastValueFrom(
				this.httpService.post("http://127.0.0.1:5300/api/check_title", {
					title: data.title,
				})
			);

			const contractResponse = await lastValueFrom(
				this.httpService.post(
					"http://127.0.0.1:5300/api/check_contract_enforced",
					{ contractEnforced: data.contractEnforced }
				)
			);

			const photoResponse = await lastValueFrom(
				this.httpService.post("http://127.0.0.1:5300/api/check_photo", {
					photoUrl: data.specifications[0].image,
				})
			);

			// Формирование и отправка ответа с результатами проверок на фронт
			return {
				titleCheck: titleResponse.data,
				contractCheck: contractResponse.data,
				photoCheck: photoResponse.data,
			};
		} catch (error) {
			throw new HttpException(
				error?.response?.data || "Ошибка при проверке данных",
				HttpStatus.BAD_GATEWAY
			);
		}
	}
}
