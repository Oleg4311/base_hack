import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageModule } from "./image/image.module";
import { DatabaseConfig } from "./config/database.config";
import { ExternalApiModule } from "./externalApi/externalApi.module";
import { QuotationModule } from "./quotationApi/quotationApi.module";
import { QuotationSessionModule } from "./quotationApi/quotation-session.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env", // Подключение файла .env
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useClass: DatabaseConfig,
		}),
		ImageModule,
		ExternalApiModule,
		QuotationModule,
		QuotationSessionModule,
	],
})
export class AppModule {}
