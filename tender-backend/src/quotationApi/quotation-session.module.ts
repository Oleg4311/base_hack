import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuotationSession } from "./quotation-session.entity";
import { QuotationSessionService } from "./quotation-session.service";
import { QuotationSessionController } from "./quotation-session.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
	imports: [TypeOrmModule.forFeature([QuotationSession]), HttpModule],
	providers: [QuotationSessionService],
	controllers: [QuotationSessionController],
})
export class QuotationSessionModule {}
