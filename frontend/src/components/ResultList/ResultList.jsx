import React, { useState, useEffect } from 'react';
import './ResultList.css';
import api from "../../api/axios.js";
import {Link, useNavigate} from "react-router-dom";

export default function ResultList() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedTournamentId, setExpandedTournamentId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('results/')
            .then(response => {
                setTournaments(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
                setLoading(false);
            });
    }, []);

    const toggleExpand = (id) => {
        setExpandedTournamentId(prev => (prev === id ? null : id));
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
            <table>
                <thead>
                <tr>
                    <th>Название турнира</th>
                    <th>Дата начала</th>
                    <th>Дата окончания</th>
                </tr>
                </thead>
                <tbody>
                {tournaments.map((tournament) => (
                    <React.Fragment key={tournament.id}>
                        <tr
                            onClick={() => toggleExpand(tournament.id)}
                            style={{cursor: 'pointer'}}
                        >
                            <td>{tournament.name}</td>
                            <td>{new Date(tournament.date_start).toLocaleDateString('ru-RU')}</td>
                            <td>{new Date(tournament.date_end).toLocaleDateString('ru-RU')}</td>
                        </tr>

                        {expandedTournamentId === tournament.id && (
                            <tr>
                                <td colSpan="3">
                                    {tournament.results?.length > 0 ? (
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
                                            {tournament.results.map((res, idx) => (
                                                <tr key={idx} onClick={() => navigate(`/my_results/${res.id}/edit`)}
                                                    style={{cursor: 'pointer'}}>
                                                    <td>{res.sportsman.last_name}</td>
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
        </div>
    );
}
