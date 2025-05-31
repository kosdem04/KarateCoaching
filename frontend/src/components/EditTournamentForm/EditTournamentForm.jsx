import React, { useState, useEffect } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import './EditTournamentForm.css';
import api from "../../api/axios.js";
import DeleteTournamentModal from "../DeleteTournamentModal/DeleteTournamentModal.jsx";

export default function EditTournamentForm() {
    const { id } = useParams();
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [types, setTypes] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        type_id: '',
        date_start: '',
        date_end: '',
    });

    const [originalData, setOriginalData] = useState({
        name: '',
        type_id: 0,
        date_start: '',
        date_end: '',
    });


    // Загрузка данных мероприятия
    useEffect(() => {
        api.get("events/types")
            .then(response  => {
                setTypes(response.data);
            });
        api.get(`events/${id}`)
            .then(response => {
                const data = response.data;

                // Преобразуем дату в формат YYYY-MM-DD
                const formattedDateStart = new Date(data.date_start).toISOString().split('T')[0];
                const formattedDateEnd = new Date(data.date_end).toISOString().split('T')[0];

                setFormData({
                    ...data,
                    date_start: formattedDateStart,
                    date_end: formattedDateEnd
                });
                setOriginalData({
                    ...data,
                    date_start: formattedDateStart,
                    date_end: formattedDateEnd
                });
            })
            .catch(error => {
                console.error('Ошибка при загрузке мероприятия:', error);
            });
    }, [id]);

    const handleDelete = () => {
        api.delete(`events/${id}`)
            .then(response => {
                navigate("/my_tournaments");
                // Можно перенаправить пользователя или обновить состояние
            })
            .catch(error => {
                console.error('Ошибка при удалении:', error);
            });
        setShowModal(false); // Закрываем модальное окно после удаления
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isChanged = JSON.stringify(formData) !== JSON.stringify(originalData);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isChanged) return;

        api.put(`events/${id}`, formData)
            .then(() => {
                setMessage({ text: 'Изменения сохранены!', type: 'success' });
                setOriginalData(formData);
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            })
            .catch(error => {
                setMessage({ text: 'Ошибка при сохранении.', type: 'error' });
                console.error('Ошибка при сохранении:', error);
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            });
    };

    return (
        <div className="add-result-page">
            <div className="header">
                <h1>Редактировать турнир</h1>
            </div>
            <div className="profile-header">
                <div className="profile-actions">
                    <button className="delete-btn" onClick={() => setShowModal(true)}>
                        Удалить
                    </button>
                </div>
            </div>


            <form className="result-form" onSubmit={handleSubmit}>
                <label>
                    Название:
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
                    Дата начала:
                    <input
                        type="date"
                        name="date_start"
                        value={formData.date_start}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Дата окончания:
                    <input
                        type="date"
                        name="date_end"
                        value={formData.date_end}
                        onChange={handleChange}
                        required
                    />
                </label>

                {isChanged && (
                    <button type="submit" className="submit-button">Сохранить изменения</button>
                )}

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </form>
            <DeleteTournamentModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
