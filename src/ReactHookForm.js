import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./app.module.css";
import { useRef, useEffect } from "react";

const schema = yup.object().shape({
	email: yup
		.string()
		.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email должен быть в формате example@domain.com")
		.required("Email обязателен для заполнения"),
	password: yup
		.string()
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
			"Пароль должен содержать заглавные и строчные буквы, а так же цифры и символы.",
		)
		.required("Пароль обязателен для заполнения")
		.min(8, "Длина пароля должна быть не менее 8 символов")
		.max(16, "Длина пароля должна быть не более 16 символов"),
	duplicatePassword: yup
		.string()
		.required("Повторите пароль")
		.oneOf([yup.ref("password")], "Пароли не совпадают"),
});

export const ReactHookForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		getValues,
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
			duplicatePassword: "",
		},
		resolver: yupResolver(schema),
		mode: "onChange",
	});

	const submitButtonRef = useRef(null);

	const errorsText = Object.values(errors)
		.map((error) => error.message)
		.join("\n");

	const onSubmit = (formData) => {
		console.log(formData);
		reset();
	};

	useEffect(() => {
		if (isValid && Object.values(getValues()).every((value) => value !== "")) {
			submitButtonRef.current.focus();
		}
	}, [errors, getValues, isValid]);

	return (
		<div className={styles.app}>
			<h1>React Hook Form</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input type="email" name="email" className={styles.input} placeholder="Email" {...register("email")} />
				<input
					type="password"
					name="password"
					className={styles.input}
					placeholder="Введите пароль"
					{...register("password")}
				/>
				<input
					type="password"
					name="duplicatePassword"
					className={styles.input}
					placeholder="Повторите пароль"
					{...register("duplicatePassword")}
				/>
				{errorsText && <pre className={styles.error}>{errorsText}</pre>}
				<button ref={submitButtonRef} type="submit" className={styles.button} disabled="">
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};
