import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { parseQuotationSession } from "src/parser/parseQuotationSession";

@Injectable()
export class QuotationSessionService {
	constructor(private readonly httpService: HttpService) {}

	// Метод для обработки и отправки данных на указанный эндпоинт
	async processAndSendToEndpoint(data: any, endpointUrl: string): Promise<any> {
		try {
			// Обработка данных скриптом
			const parsedData = await parseQuotationSession(data);

			// Отправка на указанный эндпоинт API
			const response = await lastValueFrom(
				this.httpService.post(endpointUrl, parsedData)
			);

			return response.data;
		} catch (error) {
			throw new HttpException(
				error?.response?.data || "Ошибка при отправке на внешний API",
				HttpStatus.BAD_GATEWAY
			);
		}
	}
}
