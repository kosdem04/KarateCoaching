import './LoginForm.css';
import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.jsx";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [userRoles, setUserRoles] = useState(null);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await api.post("auth/login", {
                email,
                password,
            });

            const token = response.data.access_token;
            login(token);

            const rolesResponse = await api.get("/auth/get_user_roles");
            setUserRoles(rolesResponse.data.roles);
        } catch (error) {
            setError("Ошибка авторизации");
            console.error(error);
        }
    };

    useEffect(() => {
        console.log('@@@@', userRoles);
        if (!userRoles) return;

        const isAdmin = userRoles.some(role => role.role.code === "admin");
        const isCoach = userRoles.some(role => role.role.code === "coach_role");
        const isStudent = userRoles.some(role => role.role.code === "student");

        if (isAdmin) {
            console.log("Пользователь — администратор");
            // navigate("/admin_dashboard"); // если есть такая страница
        } else if (isCoach) {
            console.log("Пользователь — тренер");
            navigate("/coach_profile/");
        } else if (isStudent) {
            console.log("Пользователь — ученик");
            navigate("/profile/");
        } else {
            console.log("Нет подходящей роли");
            setError("Нет доступа: подходящая роль не найдена.");
        }
    }, [userRoles, navigate]);

    return (
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
                <br /><br />
                <label className="register-link">
                    <Link to="/sign_up/">Зарегистрироваться</Link>
                </label>
            </form>
        </div>
    );
}
