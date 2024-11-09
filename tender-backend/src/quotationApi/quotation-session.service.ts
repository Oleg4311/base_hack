import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { parseQuotationSession } from "src/parser/parseQuotationSession";

@Injectable()
export class QuotationSessionService {
	constructor(private readonly httpService: HttpService) {}

	// Метод для обработки URL и отправки данных и бинарного файла на указанный эндпоинт
	async processAndSendToEndpoint(
		data: { url: string; file: any },

		endpointUrl: string
	): Promise<any> {
		try {
			// Обработка URL через скрипт parseQuotationSession
			const parsedData = await parseQuotationSession(data.url);

			console.log(parsedData.title);

			const requestData = {
				...parsedData,
				file: data.file,
			};

			// Отправка на указанный эндпоинт API
			const response = await lastValueFrom(
				this.httpService.post(endpointUrl, requestData)
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
