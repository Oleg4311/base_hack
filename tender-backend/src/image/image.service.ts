// src/image/image.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()   121
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private httpService: HttpService,
  ) {}

  async fetchAndSaveExternalImages(): Promise<void> {
    try {
      const response = await this.httpService
        .get('https://picsum.photos/v2/list')
        .toPromise();
      const externalImages = response.data;

      const imagesToSave = externalImages.map((item) => {
        if (!item.download_url) {
          throw new HttpException(
            'Missing URL in external data',
            HttpStatus.BAD_REQUEST,
          );
        }
        return this.imageRepository.create({
          url: item.download_url,
          author: item.author,
          description: 'Fetched from external API',
          width: item.width,
          height: item.height,
          downloadUrl: item.download_url,
        });
      });

      await this.imageRepository.save(imagesToSave);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        throw new HttpException(
          'Access Forbidden: Check your API permissions',
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw new HttpException(
          'Failed to fetch external images',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createImage(data: Partial<Image>): Promise<Image> {
    if (!data.url) {
      throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
    }

    const newImage = this.imageRepository.create(data);
    return this.imageRepository.save(newImage);
  }

  async getImages(
    page: number,
    limit: number,
  ): Promise<{ data: Image[]; total: number }> {
    const [images, total] = await this.imageRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: images, total };
  }

  async updateImage(id: number, data: Partial<Image>): Promise<Image> {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(image, data); // Обновляем поля
    return this.imageRepository.save(image);
  }

  async deleteImage(id: number): Promise<void> {
    const result = await this.imageRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }
}
