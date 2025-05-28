// components/StudentProfile.jsx
import './StudentProfile.css';
import React, { useEffect, useState } from "react";
import api from "../../../api/axios.js";

export default function StudentProfile({ studentId, onClose }) {
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!studentId) return;
        api.get(`students/${studentId}/`)
            .then(response => {
                setStudentInfo(response.data.student);
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
                setLoading(false);
            });
    }, [studentId]);

    if (loading) return <div className="student-profile-overlay">Загрузка...</div>;
    if (!studentInfo) return null;

    return (
        <div className="student-profile-overlay">
            <div className="overlay-transparent-area" onClick={onClose}>
                <button className="close-button">✕</button>
            </div>
            <div className="student-profile-panel">
                <section className="fighter-profile">
                    <img src={studentInfo.img_url} alt={studentInfo.last_name}/>
                    <h1>{studentInfo.last_name} {studentInfo.first_name} {studentInfo.patronymic}</h1>
                </section>
                {/* Дополнительная информация может быть добавлена здесь */}
            </div>
        </div>
    );
}
