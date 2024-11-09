// // src/image/image.controller.ts

// import {
// 	Controller,
// 	Get,
// 	Post,
// 	Put,
// 	Delete,
// 	Param,
// 	Body,
// 	Query,
// } from "@nestjs/common";
// import { ImageService } from "./image.service";
// import { Image } from "./image.entity";

// @Controller("images")
// export class ImageController {
// 	constructor(private readonly imageService: ImageService) {}

// 	/**
// 	 * Получение всех изображений с поддержкой пагинации
// 	 */
// 	@Get()
// 	async getAllImages(
// 		@Query("page") page: number = 1,
// 		@Query("limit") limit: number = 10
// 	): Promise<{ data: Image[]; total: number }> {
// 		return this.imageService.getImages(page, limit);
// 	}

// 	/**
// 	 * Создание нового изображения
// 	 */
// 	@Post()
// 	async createImage(@Body() imageData: Partial<Image>): Promise<Image> {
// 		return this.imageService.createImage(imageData);
// 	}

// 	/**
// 	 * Обновление изображения по ID
// 	 */
// 	@Put(":id")
// 	async updateImage(
// 		@Param("id") id: number,
// 		@Body() imageData: Partial<Image>
// 	): Promise<Image> {
// 		return this.imageService.updateImage(id, imageData);
// 	}

// 	/**
// 	 * Удаление изображения по ID
// 	 */
// 	@Delete(":id")
// 	async deleteImage(@Param("id") id: number): Promise<void> {
// 		return this.imageService.deleteImage(id);
// 	}
// }
