import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import './TournamentsList.css'
import api from "../../api/axios.js";

export default function TournamentsList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('events/')
            .then(response => {
                setEvents(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
                setLoading(false);
            });

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            <div className="profile-header">
                <div className="profile-actions">
                    <Link to={`/my_tournaments/add`}>
                        <button className="add-btn">
                            Добавить
                        </button>
                    </Link>
                </div>
            </div>

            <div className="content">
                {!isMobile ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Название мероприятия</th>
                            <th>Тип мероприятия</th>
                            <th>Дата начала</th>
                            <th>Дата окончания</th>
                        </tr>
                        </thead>
                        <tbody>
                        {events.map((event) => (
                            <tr key={event.id} onClick={() => navigate(`/my_tournaments/${event.id}/edit`)}
                                style={{cursor: 'pointer'}}>
                                <td>{event.name}</td>
                                <td>{event.type.name}</td>
                                <td>{new Date(event.date_start).toLocaleDateString('ru-RU')}</td>
                                <td>{new Date(event.date_end).toLocaleDateString('ru-RU')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="mobile-cards">
                        {events.map((event) => (
                            <div className="mobile-card" key={event.id} onClick={() => navigate(`/my_tournaments/${event.id}/edit`)}>
                                <p><strong>Название:</strong> {event.name}</p>
                                <p><strong>Начало:</strong> {new Date(event.date_start).toLocaleDateString('ru-RU')}</p>
                                <p><strong>Окончание:</strong> {new Date(event.date_end).toLocaleDateString('ru-RU')}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
