import React, { useState, useEffect } from 'react';
import './TournamentAddForm.css';
import api from "../../api/axios.js";
import {useNavigate} from "react-router-dom";

export default function TournamentAddForm() {
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();
    const [types, setTypes] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        type_id: '',
        date_start: '',
        date_end: '',
    });


    useEffect(() => {
        api.get("events/types")
            .then(response  => {
                setTypes(response.data);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.date_end < formData.date_start) {
            setMessage({ text: 'Дата окончания не может быть раньше даты начала', type: 'error' });
            return;
        }

        api.post("events/add",  formData)
            .then(response  => {
                console.log("Успешно добавлено:");
                setMessage({ text: 'Мероприятие успешно добавлено!', type: 'success' });
                setFormData({ name: '', type_id: '', date_start: '', date_end: '' });
//                 setTimeout(() => {
//                     setMessage({ text: '', type: '' });
//                     navigate("/my_tournaments"); // переход через 2 секунды
//                 }, 1500);
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 1500);
            })
            .catch(error => {
                setMessage({ text: 'Такое мероприятие уже есть', type: 'error' });
                console.error('Ошибка при получении данных:', error);
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            })
    };

    return (
        <>
            <div className="add-result-page">
                <div className="header">
                    <h1>Добавить турнир</h1>
                </div>

                <form className="result-form" onSubmit={handleSubmit}>
                    <label>
                        Название турнира:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Тип мероприятия:
                        <select
                            name="type_id"
                            value={formData.type_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите...</option>
                            {types.map(type => (
                                <option
                                    key={type.id}
                                    value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Дата начала соревнований:
                        <input
                            type="date"
                            name="date_start"
                            value={formData.date_start}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Дата окончания соревнований:
                        <input
                            type="date"
                            name="date_end"
                            value={formData.date_end}
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
