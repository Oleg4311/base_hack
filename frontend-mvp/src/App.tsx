import {
	ChangeEventHandler,
	FormEventHandler,
	useCallback,
	useRef,
	useState,
} from "react";
import styles from "./App.module.css";
import {
	Label,
	TextInput,
	Text,
	Icon,
	Button,
	Card,
	Flex,
} from "@gravity-ui/uikit";
import axios from "axios";
import { Check, Xmark } from "@gravity-ui/icons";

const criteria = [
	{
		name: "1. Проверка наименования",
		endpoint: "/quotation-sessions/check_title",
	},
	{
		name: '2. Проверка поля "обеспечение исполнения контракта"',
		endpoint: "/quotation-sessions/check_contract_enforced",
	},
	// { name: "3. Проверка наличия сертификатов/лицензий" },
	// { name: "4. Проверка графика поставки и этапа поставки" },
	{
		name: "5. Проверка внешнего вида товаров",
		endpoint: "/quotation-sessions/check_photo",
	},
	// { name: "6. Проверка начального и максимального значения цены контракта" },
	// {
	// 	name: "7. Проверка наименования и значения характеристики спецификации закупки.",
	// },
	// { name: "8. Проверка количества товаров спецификации закупки." },
	// { name: "9. Проверка количества характеристик." },
];

export const App: React.FC = () => {
	const [url, setUrl] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const inputFileRef = useRef<HTMLInputElement | null>(null);
	const [responses, setResponses] = useState<Record<string, boolean | null>>({
		"1. Проверка наименования": null,
		'2. Проверка поля "обеспечение исполнения контракта"': null,
		// "3. Проверка наличия сертификатов/лицензий": null,
		// "4. Проверка графика поставки и этапа поставки": null,
		"5. Проверка внешнего вида товаров": null,
		// "6. Проверка начального и максимального значения цены контракта": null,
		// "7. Проверка наименования и значения характеристики спецификации закупки.":
		// 	null,
		// "8. Проверка количества товаров спецификации закупки.": null,
		// "9. Проверка количества характеристик.": null,
	});

	const fileChangeHandler = useCallback<ChangeEventHandler<HTMLInputElement>>(
		event => {
			const files = event.target.files;
			setFile(files?.[0] ?? null);
		},
		[]
	);

	const submitHandler = useCallback<FormEventHandler>(
		async event => {
			event.preventDefault();

			const form = event.target as HTMLFormElement;

			const formData = new FormData(form);
			formData.set("url", url);
			if (file) {
				formData.set("file", file);
			}

			const criteriaData = formData.getAll("criteria") as string[];

			criteriaData.map(async name => {
				const endpoint = criteria.find(c => c.name === name)?.endpoint;

				if (endpoint) {
					try {
						await axios.post<[percent: number, status: string]>(
							`${import.meta.env.VITE_API_URL}${endpoint}`,
							formData
						);
						setResponses(prev => ({ ...prev, [name]: true }));
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
					} catch (err) {
						setResponses(prev => ({ ...prev, [name]: false }));
					}
				}
			});
		},
		[file, url]
	);

	const removeFile = useCallback(() => {
		if (!inputFileRef.current) {
			return;
		}
		setFile(null);
		inputFileRef.current.files = null;
		inputFileRef.current.value = "";
	}, []);

	return (
		<div className={styles.container}>
			<form className={styles.form} onSubmit={submitHandler}>
				<TextInput
					value={url}
					onUpdate={value => setUrl(value)}
					label="URL-адрес котировочной сессии"
				/>
				<div className={styles.fileField}>
					{file && (
						<Button onClick={removeFile}>
							<Icon data={Xmark} />
						</Button>
					)}
					<label htmlFor="inputFile" className={styles.filePicker}>
						<input
							ref={inputFileRef}
							id="inputFile"
							type="file"
							accept=".doc,.docx"
							hidden
							onChange={fileChangeHandler}
						/>
						{!file && (
							<Label className={styles.inputFileLabel} size="m">
								Загрузить файл
							</Label>
						)}
						<Text ellipsis>{file?.name}</Text>
					</label>
				</div>
				<Card className={styles.checkboxes}>
					{criteria.map(({ name }) => (
						<Flex gap={2} key={name}>
							<input id={name} type="checkbox" name="criteria" value={name} />
							<label htmlFor={name}>{name}</label>
						</Flex>
					))}
				</Card>

				<Button type="submit" view="action" size="l">
					Проверить
				</Button>
			</form>
			<div className={styles.checks}>
				{Object.entries(responses).map(([name, status]) => (
					<Card className={styles.check} key={name}>
						<div className={styles.checkStatus}>
							{status === true ? (
								<Icon data={Check} stroke="green" />
							) : status === false ? (
								<Icon data={Xmark} stroke="red" />
							) : null}
						</div>
						<Flex justifyContent="space-between">
							<div className={styles.checkName}>{name}</div>
							{/* {status?.[0] && <Label>{status[0]}</Label>} */}
						</Flex>
					</Card>
				))}
			</div>
		</div>
	);
};
