// quotation-session.service.ts

import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { parseQuotationSession } from "src/parser/parseQuotationSession";

@Injectable()
export class QuotationSessionService {
	constructor(private readonly httpService: HttpService) {}

	async processAndSendData(data: any): Promise<any> {
		try {
			// 1. Обработка данных с помощью скрипта
			const parsedData = await parseQuotationSession(data);

			// 2. Отправка обработанных данных на внешние API параллельно
			const [titleResponse, contractResponse, photoResponse] =
				await Promise.all([
					lastValueFrom(
						this.httpService.post("http://127.0.0.1:5300/api/check_title", {
							title: parsedData.title,
						})
					),
					lastValueFrom(
						this.httpService.post(
							"http://127.0.0.1:5300/api/check_contract_enforced",
							{ contractEnforced: parsedData.contractEnforced }
						)
					),
					lastValueFrom(
						this.httpService.post("http://127.0.0.1:5300/api/check_photo", {
							photoUrl: parsedData.specifications[0].image,
						})
					),
				]);

			// Возвращаем результаты всех проверок
			return {
				titleCheck: titleResponse.data,
				contractCheck: contractResponse.data,
				photoCheck: photoResponse.data,
			};
		} catch (error) {
			throw new HttpException(
				error?.response?.data ||
					"Ошибка при обработке данных и отправке на проверку",
				HttpStatus.BAD_GATEWAY
			);
		}
	}
}
