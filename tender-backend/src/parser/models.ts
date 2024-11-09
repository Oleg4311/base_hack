export interface Specification {
	title: string;
	image: string;
	quantity: string;
	pricePerUnit: string;
	totalPrice: string;
	okpd2Code: string;
	okpd2Title: string;
	kpg3Code: string;
	kpg3Title: string;
	model: string;
	vendor: string;
	properties: {
		[propertyName: string]: string;
	};
	deliveryDates: string;
	deliveryQuantity: string;
	deliveryAddress: string;
	deliveryDetails: string;
}

export interface QuotationSession {
	label: string;
	title: string;
	status: string;
	contractCondition: string;
	contractEnforced: string;
	customerName: string;
	customerLink: string;
	law: string;
	dateStart: string;
	dateEnd: string;
	documents: string[];
	specifications: Specification[];
}
