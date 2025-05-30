import React, { useState, useEffect } from 'react';
import './ResultList.css';
import api from "../../api/axios.js";
import { Link, useNavigate } from "react-router-dom";

export default function ResultList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedEventId, setExpandedEventId] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('results/')
            .then(response => {
                setEvents(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
                setLoading(false);
            });

        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleExpand = (id) => {
        setExpandedEventId(prev => (prev === id ? null : id));
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="content">
            <div className="profile-header">
                <div className="profile-actions">
                    <Link to={`/my_results/add`}>
                        <button className="add-btn">
                            Добавить
                        </button>
                    </Link>
                </div>
            </div>

            <p className="table-hint">Чтобы посмотреть результаты, нажмите на нужный турнир</p>

            {!isMobile ? (
                <table>
                    <thead>
                    <tr>
                        <th>Название турнира</th>
                        <th>Дата начала</th>
                        <th>Дата окончания</th>
                    </tr>
                    </thead>
                    <tbody>
                    {events.map((event) => (
                        <React.Fragment key={event.id}>
                            <tr
                                onClick={() => toggleExpand(event.id)}
                                style={{cursor: 'pointer'}}
                            >
                                <td>{event.name}</td>
                                <td>{new Date(event.date_start).toLocaleDateString('ru-RU')}</td>
                                <td>{new Date(event.date_end).toLocaleDateString('ru-RU')}</td>
                            </tr>

                            {expandedEventId === event.id && (
                                <tr>
                                    <td colSpan="3">
                                        {event.results?.length > 0 ? (
                                            <table className="inner-table">
                                                <thead>
                                                <tr>
                                                    <th>Спортсмен</th>
                                                    <th>Место</th>
                                                    <th>Заработано баллов</th>
                                                    <th>Пропущено баллов</th>
                                                    <th>Средний балл</th>
                                                    <th>КПД</th>
                                                    <th>Бои</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {event.results.map((res, idx) => (
                                                    <tr key={idx}
                                                        onClick={() => navigate(`/my_results/${res.id}/edit`)}>
                                                        <td>{res.student.student_data.last_name}{' '}
                                                            {res.student.student_data.first_name.charAt(0)}.
                                                            {res.student.student_data.patronymic ? res.student.student_data.patronymic.charAt(0) + '.' : ''}</td>
                                                        <td>{res.place.name}</td>
                                                        <td>{res.points_scored}</td>
                                                        <td>{res.points_missed}</td>
                                                        <td>{res.average_score}</td>
                                                        <td>{res.efficiency}</td>
                                                        <td>{res.number_of_fights}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>Нет данных о результатах</p>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div className="mobile-results">
                    {events.map((event) => (
                        <div
                            className="mobile-result-card"
                            key={event.id}
                            onClick={() => toggleExpand(event.id)}
                        >
                            <p><strong>Название:</strong> {event.name}</p>
                            <p><strong>Начало:</strong> {new Date(event.date_start).toLocaleDateString('ru-RU')}
                            </p>
                            <p><strong>Окончание:</strong> {new Date(event.date_end).toLocaleDateString('ru-RU')}
                            </p>

                            {expandedEventId === event.id && (
                                <div className="result-details">
                                    {event.results?.length > 0 ? (
                                        event.results.map((res, idx) => (
                                            <div key={idx} onClick={() => navigate(`/my_results/${res.id}/edit`)}>
                                                <div><strong>Спортсмен:</strong> {res.student.student_data.last_name}</div>
                                                <div><strong>Место:</strong> {res.place.name}</div>
                                                <div><strong>Заработано:</strong> {res.points_scored}</div>
                                                <div><strong>Пропущено:</strong> {res.points_missed}</div>
                                                <div><strong>Средний балл:</strong> {res.average_score}</div>
                                                <div><strong>КПД:</strong> {res.efficiency}</div>
                                                <div><strong>Бои:</strong> {res.number_of_fights}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Нет данных о результатах</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
