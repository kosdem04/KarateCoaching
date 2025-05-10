import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import './TournamentsList.css'
import api from "../../api/axios.js";

export default function TournamentsList() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('tournaments/')
            .then(response => {
                setTournaments(response.data);
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
                            <th>Название турнира</th>
                            <th>Дата начала</th>
                            <th>Дата окончания</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tournaments.map((tournament) => (
                            <tr key={tournament.id} onClick={() => navigate(`/my_tournaments/${tournament.id}/edit`)} style={{ cursor: 'pointer' }}>
                                <td>{tournament.name}</td>
                                <td>{new Date(tournament.date_start).toLocaleDateString('ru-RU')}</td>
                                <td>{new Date(tournament.date_end).toLocaleDateString('ru-RU')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="mobile-cards">
                        {tournaments.map((tournament) => (
                            <div className="mobile-card" key={tournament.id} onClick={() => navigate(`/my_tournaments/${tournament.id}/edit`)}>
                                <p><strong>Название:</strong> {tournament.name}</p>
                                <p><strong>Начало:</strong> {new Date(tournament.date_start).toLocaleDateString('ru-RU')}</p>
                                <p><strong>Окончание:</strong> {new Date(tournament.date_end).toLocaleDateString('ru-RU')}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
