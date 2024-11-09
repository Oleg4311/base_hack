import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ExternalApiModule } from "./externalApi/externalApi.module";
import { QuotationSessionModule } from "./quotationApi/quotation-session.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env", // Подключение файла .env
		}),
		// TypeOrmModule.forRootAsync({
		// 	imports: [ConfigModule],
		// 	useClass: DatabaseConfig,
		// }),
		ExternalApiModule,
		QuotationSessionModule,
	],
})
export class AppModule {}
