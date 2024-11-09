import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageModule } from "./image/image.module";
import { DatabaseConfig } from "./config/database.config";
import { ExternalApiModule } from "./externalApi/externalApi.module";

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
	],
})
export class AppModule {}
