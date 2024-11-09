// quotation-session.controller.ts

import {
	Controller,
	Post,
	Body,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

@Controller("quotation-sessions")
export class QuotationSessionController {
	constructor(private readonly httpService: HttpService) {}

	@Post("check_title")
	async checkTitle(@Body() data: { title: string }) {
		try {
			const response = await lastValueFrom(
				this.httpService.post("http://127.0.0.1:5300/api/check_title", {
					title: data.title,
				})
			);
			return response.data;
		} catch (error) {
			throw new HttpException(
				error?.response?.data || "Ошибка при проверке наименования",
				HttpStatus.BAD_GATEWAY
			);
		}
	}

	@Post("check_contract_enforced")
	async checkContractEnforced(@Body() data: { contractEnforced: string }) {
		try {
			const response = await lastValueFrom(
				this.httpService.post(
					"http://127.0.0.1:5300/api/check_contract_enforced",
					{ contractEnforced: data.contractEnforced }
				)
			);
			return response.data;
		} catch (error) {
			throw new HttpException(
				error?.response?.data || "Ошибка при проверке обеспечения контракта",
				HttpStatus.BAD_GATEWAY
			);
		}
	}

	@Post("check_photo")
	async checkPhoto(@Body() data: { photoUrl: string }) {
		try {
			const response = await lastValueFrom(
				this.httpService.post("http://127.0.0.1:5300/api/check_photo", {
					photoUrl: data.photoUrl,
				})
			);
			return response.data;
		} catch (error) {
			throw new HttpException(
				error?.response?.data || "Ошибка при проверке фото",
				HttpStatus.BAD_GATEWAY
			);
		}
	}
}
