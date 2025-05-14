import './SignUp.css';
import { useState } from "react";
import api from "../../api/axios.js";
import {Link, useNavigate} from "react-router-dom";

export default function SignUp() {
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        patronymic: '',
        last_name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== passwordRepeat) {
            setError("Пароли не совпадают");
            return;
        }

        const dataToSend = {
            ...formData,
            password: password,
        };

        try {
            await api.post("auth/register", dataToSend);

            // После регистрации перенаправляем на страницу логина
            navigate("/login");
        } catch (err) {
            console.log(err.response.data);
            setError(err.response?.data?.detail || "Ошибка регистрации");
        }
    };

    return (
        <>
            <div className="login-page">
                <div className="header">
                    <h1>Регистрация</h1>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label>
                        Фамилия:
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name} onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Имя:
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Отчество (необязательно):
                        <input type="text"
                               name="patronymic"
                               value={formData.patronymic}
                               onChange={handleChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Пароль:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Повтор пароля:
                        <input
                            type="password"
                            value={passwordRepeat}
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                            required
                        />
                    </label>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="submit-button">Зарегистрироваться</button>
                    <br/><br/>
                    <label className="register-link">
                        <Link to="/login/">Уже есть аккаунт</Link>
                    </label>
                </form>
            </div>
        </>
    );
}
