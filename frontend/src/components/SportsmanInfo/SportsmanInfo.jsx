import './SportsmanInfo.css'
import {Link, useNavigate, useParams} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import api from "../../api/axios.js";
import DeleteSportsmanModal from "../DeleteSportsmanModal/DeleteSportsmanModal.jsx";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


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

            <section className="chart-section">
                <h2>График: КПД и Средний балл</h2>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={resultsInfo.map(res => ({
                                name: res.tournament.name.length > 10
                                    ? res.tournament.name.slice(0, 10) + '…'
                                    : res.tournament.name,
                                efficiency: res.efficiency,
                                average_score: res.average_score
                            }))}
                            margin={{top: 10, right: 20, left: 0, bottom: 30}}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={60}/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Line type="monotone" dataKey="efficiency" name="КПД" stroke="#8884d8"/>
                            <Line type="monotone" dataKey="average_score" name="Средний балл" stroke="#82ca9d"/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
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