import React, { useState, useEffect } from 'react';
import './AddResultForm.css';
import api from "../../api/axios.js";

export default function AddResultForm() {
    const [events, setEvents] = useState([]);
    const [places, setPlaces] = useState([]);
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [formData, setFormData] = useState({
        event_id: '',
        student_id: '',
        place_id: '',
        points_scored: '',
        points_missed: '',
        number_of_fights: ''
    });

    useEffect(() => {
        api.get("events/")
            .then(response  => {
                setEvents(response.data);
            });
        api.get("results/places/")
            .then(response  => {
                setPlaces(response.data);
            });
        api.get("students/")
            .then(response  => {
                setStudents(response.data);
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
                setFormData({event_id: '',
                    student_id: '',
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
                        Мероприятие:
                        <select
                            name="event_id"
                            value={formData.event_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите...</option>
                            {events.map(event => (
                                <option
                                    key={event.id}
                                    value={event.id}>{event.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Спортсмен:
                        <select
                            name="student_id"
                            value={formData.student_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите...</option>
                            {students.map(student => (
                                <option
                                    key={student.id}
                                    value={student.id}>{student.last_name} {student.first_name}</option>
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
