// quotation-session.module.ts

import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { QuotationSessionController } from "./quotation-session.controller";
import { QuotationSessionService } from "./quotation-session.service";

@Module({
	imports: [HttpModule],
	controllers: [QuotationSessionController],
	providers: [QuotationSessionService],
	exports: [QuotationSessionService],
})
export class QuotationSessionModule {}
