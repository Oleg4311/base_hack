import { Controller, Get } from "@nestjs/common";
import { ExternalApiService } from "./externalApi.service";

@Controller("external-api")
export class ExternalApiController {
	constructor(private readonly externalApiService: ExternalApiService) {}

	@Get()
	async getExternalData() {
		return await this.externalApiService.fetchExternalData();
	}
}
