import React, { useState, useEffect } from 'react';
import './AddResultForm.css';
import api from "../../api/axios.js";

export default function AddResultForm() {
    const [tournaments, setTournaments] = useState([]);
    const [places, setPlaces] = useState([]);
    const [sportsmen, setSportsmen] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [formData, setFormData] = useState({
        tournament_id: '',
        sportsman_id: '',
        place_id: '',
        points_scored: '',
        points_missed: '',
        number_of_fights: ''
    });

    useEffect(() => {
        api.get("tournaments/")
            .then(response  => {
                setTournaments(response.data);
            });
        api.get("results/places/")
            .then(response  => {
                setPlaces(response.data);
            });
        api.get("sportsmen/")
            .then(response  => {
                setSportsmen(response.data);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Отправка формы
        console.log(formData);
        api.post("results/add", formData)
            .then(response  => {
                console.log("Успешно добавлено:");
                setMessage({ text: 'Результат успешно добавлен!', type: 'success' });
                setFormData({tournament_id: '',
                    sportsman_id: '',
                    place_id: '',
                    points_scored: '',
                    points_missed: '',
                    number_of_fights: ''});
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            })
            .catch(error => {
                setMessage({ text: 'Такой результат уже есть', type: 'error' });
                console.error('Ошибка при получении данных:', error);
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            })

    };

    return (
        <>
            <div className="add-result-page">
                <div className="header">
                    <h1>Добавить результат спортсмена</h1>
                </div>

                <form className="result-form" onSubmit={handleSubmit}>
                    <label>
                        Соревнование:
                        <select
                            name="tournament_id"
                            value={formData.tournament_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите...</option>
                            {tournaments.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Спортсмен:
                        <select
                            name="sportsman_id"
                            value={formData.sportsman_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите...</option>
                            {sportsmen.map(s => (
                                <option key={s.id} value={s.id}>{s.last_name} {s.first_name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Место:
                        <select
                            name="place_id"
                            value={formData.place_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите...</option>
                            {places.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Количество заработанных баллов:
                        <input
                            type="number"
                            name="points_scored"
                            value={formData.points_scored}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Количество пропущенных баллов:
                        <input
                            type="number"
                            name="points_missed"
                            value={formData.points_missed}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Количество боев:
                        <input
                            type="number"
                            name="number_of_fights"
                            value={formData.number_of_fights}
                            onChange={handleChange}
                            required
                        />
                    </label>


                    <button type="submit" className="submit-button">Добавить</button>

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}
