// src/image/image.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false }) // Запрещаем значение null
	url: string;

	@Column({ nullable: true })
	author: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	width: number;

	@Column({ nullable: true })
	height: number;

	@Column({ nullable: true })
	downloadUrl: string;
}
