import React, { useState, useEffect } from 'react';
import './AddSportsmanForm.css';
import api from "../../api/axios.js";
import {useNavigate} from "react-router-dom";

export default function AddSportsmanForm() {
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        patronymic: '',
        last_name: '',
        date_of_birth: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (avatarFile) data.append('avatar', avatarFile); // добавляем файл

        console.log(data);

        api.post("students/add", data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(response  => {
                console.log("Успешно добавлено:");
                setMessage({ text: 'Спортсмен успешно добавлен!', type: 'success' });
                setFormData({  first_name: '', patronymic: '', last_name: '', date_of_birth: '', });
//                 setTimeout(() => {
//                     setMessage({ text: '', type: '' });
//                     navigate("/my_sportsmen"); // переход через 2 секунды
//                 }, 1500);
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 1500);
            })
            .catch(error => {
                setMessage({ text: 'Такой спортсмен уже есть', type: 'error' });
                console.error('Ошибка при получении данных:', error);
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            })
    };

    return (
        <>
            <div className="add-result-page">
                <div className="header">
                    <h1>Добавить спортсмена</h1>
                </div>

                <form className="result-form" onSubmit={handleSubmit}>
                    <label>
                        Фамилия:
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange}
                               required
                        />
                    </label>
                    <label>
                        Имя:
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange}
                               required
                        />
                    </label>
                    <label>
                        Отчество (необязательно):
                        <input type="text" name="patronymic" value={formData.patronymic} onChange={handleChange}/>
                    </label>
                    <label>
                        Дата рождения:
                        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange}
                               required
                        />
                    </label>
                    <label>
                        Аватар:
                        <input type="file" name="avatar" accept="image/*" onChange={handleFileChange}/>
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
