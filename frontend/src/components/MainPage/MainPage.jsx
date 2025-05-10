import { useEffect, useState } from 'react';
import AgaevImg from '/src/assets/agaev.jpg';
import './MainPage.css';
import {useAuth} from "../../AuthContext.jsx";
import api from "../../api/axios.js";

function MainPage() {
    const { isAuthenticated } = useAuth();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            api.get("/auth/get_user")
                .then(response => {
                    setUserId(response.data.user_id);
                })
                .catch(error => {
                    console.error("Ошибка получения ID пользователя:", error);
                });
        }
    }, [isAuthenticated]);

    return (
        <>
            <div className="hero-image">
                <img src={AgaevImg} alt="Рафаэль Агаев" />
            </div>

            <div className="content">
                <h1>Добро пожаловать в тренерскую!</h1>
                {isAuthenticated && userId && (
                    <p>Ваш ID: <strong>{userId}</strong></p>
                )}
            </div>
        </>
    );
}

export default MainPage;
