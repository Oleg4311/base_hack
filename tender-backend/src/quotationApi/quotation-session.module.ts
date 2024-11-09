// quotation-session.module.ts

import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { QuotationSessionController } from "./quotation-session.controller";

@Module({
	imports: [HttpModule],
	controllers: [QuotationSessionController],
})
export class QuotationSessionModule {}
