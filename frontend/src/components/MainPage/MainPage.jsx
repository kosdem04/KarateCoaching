import { useAuth } from "../../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import './MainPage.css';
import {useEffect, useState} from "react";
import api from "../../api/axios.js";

function MainPage() {
    const { isAuthenticated } = useAuth();
    const [userData, setAUserData] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated) {
            api.get("/auth/get_user_data")
                .then(response => {
                    console.log(response);
                    setAUserData(response.data);
                })
                .catch(error => {
                    console.error("Ошибка получения информации о пользователе:", error);
                });
        }
    }, [isAuthenticated]);

    return (
        <div className="main-container">
            <section className="intro-block">
                {isAuthenticated ? (
                    <>
                        <h1>Добро пожаловать, {userData.last_name} {userData.first_name} {userData.patronymic}</h1>
                        <p>
                            Здесь вы можете управлять своей командой и отслеживать результаты спортсменов.
                        </p>
                    </>
                ) : (
                    <>
                        <h1>🥋 Тренерская панель</h1>
                        <p>
                            Онлайн-система для тренеров по каратэ WKF, позволяющая отслеживать и анализировать
                            результаты своих спортсменов. Получайте доступ к ключевой статистике и управляйте командой
                            через удобный интерфейс.
                        </p>
                        <button className="login-button" onClick={() => navigate("/login")}>
                            Войти
                        </button>
                    </>
                )}
            </section>

            <section className="advantages-block">
                <h2>Преимущества системы</h2>
                <ul>
                    <li>📊 Полный контроль над результатами спортсменов</li>
                    <li>👤 Персональные кабинеты с историей выступлений</li>
                    <li>⚙️ Автоматический расчёт КПД, среднего балла и побед</li>
                    <li>🧭 Интуитивный интерфейс для тренеров</li>
                    <li>📈 Помощь в тренировочном планировании</li>
                </ul>
            </section>
        </div>
    );
}

export default MainPage;
