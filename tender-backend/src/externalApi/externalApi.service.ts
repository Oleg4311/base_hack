import { HttpService } from "@nestjs/axios";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { lastValueFrom } from "rxjs";

@Injectable()
export class ExternalApiService {
	constructor(private readonly httpService: HttpService) {}

	async fetchExternalData(): Promise<any> {
		try {
			const response = await lastValueFrom(
				this.httpService.get("http://10.10.116.232:5300/api/")
			);
			return response.data;
		} catch (error) {
			// Обработка ошибки без циклических структур
			throw new HttpException(
				error?.response?.data || "Ошибка при запросе внешнего API",
				HttpStatus.BAD_GATEWAY
			);
		}
	}
}
