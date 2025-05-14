import './SportsmanInfo.css'
import {Link, useNavigate, useParams} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import api from "../../api/axios.js";
import DeleteSportsmanModal from "../DeleteSportsmanModal/DeleteSportsmanModal.jsx";


export default function SportsmanInfo() {
    const { id } = useParams();
    const [sportsmanInfo, setSportsmanInfo] = useState({});
    const [resultsInfo, setResultsInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const getRankClass = (rank) => {
        if (rank === '1') return 'rank-circle gold';
        if (rank === '2') return 'rank-circle silver';
        if (rank === '3') return 'rank-circle bronze';
        return 'rank-circle gray';
    };

    useEffect(() => {
        api.get(`sportsmen/${id}`)
            .then(response => {
                setSportsmanInfo(response.data.sportsman);
                setResultsInfo(response.data.results);
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
                setLoading(false);
                if (error.response?.status === 403) {
                    navigate("/"); // редирект на главную
                }
            });
    }, [id]);

    const handleDelete = () => {
        api.delete(`sportsmen/${id}`)
            .then(response => {
                navigate("/my_sportsmen");
                // Можно перенаправить пользователя или обновить состояние
            })
            .catch(error => {
                console.error('Ошибка при удалении:', error);
            });
        setShowModal(false); // Закрываем модальное окно после удаления
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }


    return (
        <>
            <div className="profile-header">
                <div className="profile-actions">
                    <Link to={`/my_sportsmen/${id}/edit`}>
                        <button className="edit-btn">
                            Изменить
                        </button>
                    </Link>
                    <button className="delete-btn" onClick={() => setShowModal(true)}>
                        Удалить
                    </button>
                </div>
            </div>
            <section className="fighter-profile">
                <img src={sportsmanInfo.img_url} alt={sportsmanInfo.last_name}/>
                    <h1>{sportsmanInfo.last_name} {sportsmanInfo.first_name} {sportsmanInfo.patronymic}</h1>
                </section>

                <section className="fight-history">
                    <h2>История выступлений</h2>
                    <div className="table-container">
                        <table className="sportsman-table">
                            <thead>
                            <tr>
                                <th>Турнир</th>
                                <th>Место</th>
                                <th>Заработано баллов</th>
                                <th>Пропущено баллов</th>
                                <th>Средний балл</th>
                                <th>КПД</th>
                                <th>Количество боев</th>
                                <th>Дата</th>
                            </tr>
                            </thead>
                            <tbody>
                            {resultsInfo.map((result, index) => (
                                <tr>
                                    <td> {result.tournament.name}</td>
                                    <td><span className={getRankClass(result.place.name)}>
                                        {result.place.name}</span></td>
                                    <td> {result.points_scored}</td>
                                    <td> {result.points_missed}</td>
                                    <td> {result.average_score}</td>
                                    <td> {result.efficiency}</td>
                                    <td> {result.number_of_fights}</td>
                                    <td>
                                        {new Date(result.tournament.date_start).toLocaleDateString('ru-RU')}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            <DeleteSportsmanModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
            />
        </>
    )
}