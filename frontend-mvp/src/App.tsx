import { FormEventHandler, useCallback, useState } from "react";
import styles from "./App.module.css";
import { Label, TextInput } from "@gravity-ui/uikit";

export const App: React.FC = () => {
	const submitHandler = useCallback<FormEventHandler>(event => {
		event.preventDefault();
	}, []);

	const [url, setUrl] = useState("");

	return (
		<div className={styles.container}>
			<form className={styles.form} onSubmit={submitHandler}>
				<TextInput value={url} onUpdate={value => setUrl(value)} />
				<label htmlFor="inputFile" className={styles.filePicker}>
					<input id="inputFile" type="file" accept=".doc,.docx" hidden />
					<Label className={styles.inputFileLabel} size="m">
						Загрузить файл
					</Label>
				</label>
			</form>
		</div>
	);
};
