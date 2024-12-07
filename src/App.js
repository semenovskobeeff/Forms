import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./app.module.css";

const initialState = {
	email: "",
	password: "",
	duplicatePassword: "",
};

const useStore = () => {
	const [state, setState] = useState(initialState);

	return {
		getState: () => state,
		updateState: (fieldName, newValue) => {
			setState({
				...state,
				[fieldName]: newValue,
			});
		},
	};
};

const sendData = (formData) => {
	console.log(formData);
};

export const App = () => {
	const { getState, updateState } = useStore();
	const [formErrors, setFormErrors] = useState({
		email: null,
		password: null,
		duplicatePassword: null,
	});
	const [isValid, setIsValid] = useState(false);

	const submitButtonRef = useRef(null);

	const { email, password, duplicatePassword } = getState();

	const validateForm = useCallback(() => {
		const newErrors = {
			email: null,
			password: null,
			duplicatePassword: null,
		};

		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Введите email в формате example@domain.com";
		}

		if ((password && password.length < 8) || password.length > 16) {
			newErrors.password = "Длина пароля должна быть от 8 до 16 символов.";
		} else if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
			newErrors.password = "Пароль должен содержать заглавные и строчные буквы, а так же цифры и символы.";
		}

		if (duplicatePassword && duplicatePassword !== password) {
			newErrors.duplicatePassword = "Пароли не совпадают!";
		}

		setFormErrors(newErrors);

		const valid =
			email &&
			password &&
			duplicatePassword &&
			!newErrors.email &&
			!newErrors.password &&
			!newErrors.duplicatePassword;

		setIsValid(valid);
		return valid;
	}, [email, password, duplicatePassword]);

	useEffect(() => {
		if (isValid) {
			submitButtonRef.current.focus();
		}
	}, [isValid]);

	const onSubmit = (event) => {
		event.preventDefault();
		if (validateForm()) {
			sendData(getState());
		}
	};

	const onChange = useCallback(
		({ target }) => {
			updateState(target.name, target.value);
		},
		[updateState],
	);

	useEffect(() => {
		validateForm();
	}, [email, password, duplicatePassword, validateForm]);

	const errorsText = Object.values(formErrors).filter(Boolean).join("\n");

	return (
		<div className={styles.app}>
			<h1>App</h1>
			<form onSubmit={onSubmit}>
				<input
					type="email"
					name="email"
					className={styles.input}
					placeholder="Email"
					value={email}
					onChange={onChange}
				/>
				<input
					type="password"
					name="password"
					className={styles.input}
					placeholder="Введите пароль"
					value={password}
					onChange={onChange}
				/>
				<input
					type="password"
					name="duplicatePassword"
					className={styles.input}
					placeholder="Повторите пароль"
					value={duplicatePassword}
					onChange={onChange}
				/>
				{errorsText && <pre className={styles.error}>{errorsText}</pre>}
				<button ref={submitButtonRef} type="submit" className={styles.button} disabled={!isValid}>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};
