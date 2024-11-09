import {
	ChangeEventHandler,
	FormEventHandler,
	useCallback,
	useState,
} from "react";
import styles from "./App.module.css";
import { Label, TextInput } from "@gravity-ui/uikit";
import axios from "axios";

const endpoints = [
	"/quotation-sessions/check_title",
	"/quotation-sessions/check_contract_enforced",
	"/quotation-sessions/check_photo",
];

const urls = endpoints.map(
	endpoint => `${import.meta.env.VITE_API_URL}${endpoint}`
);

export const App: React.FC = () => {
	const [url, setUrl] = useState("");
	const [file, setFile] = useState<File | null>(null);

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

			const requests = urls.map(u => axios.get(u, { params: { link: url } }));

			await Promise.all([requests]);
		},
		[url]
	);

	return (
		<div className={styles.container}>
			<form className={styles.form} onSubmit={submitHandler}>
				<TextInput
					value={url}
					onUpdate={value => setUrl(value)}
					label="URL-адрес котировочной сессии"
				/>
				<label htmlFor="inputFile" className={styles.filePicker}>
					<input
						id="inputFile"
						type="file"
						accept=".doc,.docx"
						hidden
						onChange={fileChangeHandler}
					/>
					<Label className={styles.inputFileLabel} size="m">
						Загрузить файл
					</Label>
				</label>
			</form>
		</div>
	);
};
