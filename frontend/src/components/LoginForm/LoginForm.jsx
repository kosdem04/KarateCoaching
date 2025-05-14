import './LoginForm.css';
import {useEffect, useState} from "react";
import api from "../../api/axios.js";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../AuthContext.jsx";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        api.post("auth/login", {
            email,
            password,
        })
            .then(response => {
                console.log("www");
                const token = response.data.access_token;
                login(token);
                navigate("/");
            })
            .catch(error => {
                setError( "Ошибка регистрации");
            });
    };

    return (
        <>
            <div className="login-page">
                <div className="header">
                    <h1>Авторизация</h1>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="submit-button">Войти</button>
                    <br/><br/>
                    <label className="register-link">
                        <Link to="/sign_up/">Зарегистрироваться</Link>
                    </label>
                </form>
            </div>
        </>
    );
}
