import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { parseQuotationSession } from "src/parser/parseQuotationSession";
import * as FormData from "form-data";

@Injectable()
export class QuotationSessionService {
	constructor(private readonly httpService: HttpService) {}

	// Метод для обработки URL и отправки данных и бинарного файла на указанный эндпоинт
	async processAndSendToEndpoint(
		data: { url: string; fileBuffer: Buffer; fileName: string },
		endpointUrl: string
	): Promise<any> {
		try {
			// Обработка URL через скрипт parseQuotationSession
			const parsedData = await parseQuotationSession(data.url);

			// Формирование данных для отправки: обработанные данные и бинарный файл
			const formData = new FormData();
			formData.append("parsedData", JSON.stringify(parsedData)); // добавляем обработанные данные
			formData.append("file", data.fileBuffer, data.fileName); // добавляем бинарный файл с оригинальным именем

			// Отправка на указанный эндпоинт API
			const response = await lastValueFrom(
				this.httpService.post(endpointUrl, formData, {
					headers: { ...formData.getHeaders() },
				})
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
