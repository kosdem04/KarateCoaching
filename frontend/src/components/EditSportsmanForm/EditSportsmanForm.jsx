import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EditSportsmanForm.css';
import api from "../../api/axios.js";

export default function EditSportsmanForm() {
    const { id } = useParams();
    const [message, setMessage] = useState({ text: '', type: '' });

    const [formData, setFormData] = useState({
        first_name: '',
        patronymic: '',
        last_name: '',
        date_of_birth: '',
        img_url: '',  // текущее изображение
    });

    const [originalData, setOriginalData] = useState(null);
    const [newAvatarFile, setNewAvatarFile] = useState(null);

    useEffect(() => {
        api.get(`students/${id}`)
            .then(response => {
                const data = response.data;
                const formattedDate = new Date(data.student_data.date_of_birth).toISOString().split('T')[0];
                setFormData({ ...data.student_data, date_of_birth: formattedDate });
                setOriginalData({ ...data.student_data, date_of_birth: formattedDate });
            })
            .catch(error => {
                console.error('Ошибка при загрузке спортсмена:', error);
            });
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setNewAvatarFile(e.target.files[0]);
    };

    const isChanged = () =>
        JSON.stringify({ ...formData, img_url: '' }) !== JSON.stringify({ ...originalData, img_url: '' }) || newAvatarFile;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isChanged()) return;

        const data = new FormData();
        data.append('first_name', formData.first_name);
        data.append('patronymic', formData.patronymic);
        data.append('last_name', formData.last_name);
        data.append('date_of_birth', formData.date_of_birth);
        if (newAvatarFile) {
            data.append('avatar', newAvatarFile);
        }

        api.put(`students/${id}/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
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
                <h1>Редактировать спортсмена</h1>
            </div>

            <form className="result-form" onSubmit={handleSubmit}>
                <label>
                    Фамилия:
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </label>
                <label>
                    Имя:
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </label>
                <label>
                    Отчество (необязательно):
                    <input type="text" name="patronymic" value={formData.patronymic} onChange={handleChange} />
                </label>
                <label>
                    Дата рождения:
                    <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
                </label>
                <label>
                    Текущий аватар:
                    <div>
                        <img src={formData.img_url} alt="avatar" style={{ width: "100px", borderRadius: "8px" }} />
                    </div>
                </label>
                <label>
                    Новый аватар (если хотите заменить):
                    <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} />
                </label>

                {isChanged() && (
                    <button type="submit" className="submit-button">Сохранить изменения</button>
                )}

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
}
