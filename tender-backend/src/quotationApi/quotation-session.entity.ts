import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("quotation_sessions")
export class QuotationSession {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	label: string;

	@Column()
	title: string;

	@Column()
	status: string;

	@Column()
	contractCondition: string;

	@Column()
	contractEnforced: string;

	@Column()
	customerName: string;

	@Column()
	customerLink: string;

	@Column()
	law: string;

	@Column()
	dateStart: string;

	@Column()
	dateEnd: string;

	// При необходимости создать отдельную сущность для specifications, если это массив объектов
	@Column("jsonb")
	specifications: Record<string, any>[];
}
