// quotation-session.service.ts

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QuotationSession } from "./quotation-session.entity";

@Injectable()
export class QuotationSessionService {
	constructor(
		@InjectRepository(QuotationSession)
		private readonly quotationRepository: Repository<QuotationSession>
	) {}

	async create(data: Partial<QuotationSession>): Promise<QuotationSession> {
		const quotationSession = this.quotationRepository.create(data);
		return this.quotationRepository.save(quotationSession);
	}
}
