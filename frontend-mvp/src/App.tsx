import {
	ChangeEventHandler,
	FormEventHandler,
	useCallback,
	useRef,
	useState,
} from "react";
import styles from "./App.module.css";
import { Label, TextInput, Text, Icon, Button } from "@gravity-ui/uikit";
import axios from "axios";
import { Xmark } from "@gravity-ui/icons";

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
	const inputFileRef = useRef<HTMLInputElement | null>(null);

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

			const formData = new FormData();
			formData.set("url", url);
			if (file) {
				formData.set("file", file);
			}

			const requests = urls.map(u => axios.post(u, formData));

			await Promise.all([requests]);
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
					<Text ellipsis>{file?.name}</Text>
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
					</label>
					{file && (
						<Button onClick={removeFile}>
							<Icon data={Xmark} />
						</Button>
					)}
				</div>
				<Button type="submit" view="action">
					Проверить
				</Button>
			</form>
		</div>
	);
};
