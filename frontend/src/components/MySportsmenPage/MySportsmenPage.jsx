import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from "react-router-dom";
import AgaevImg from '/src/assets/agaev.jpg'
import './MySportsmenPage.css'
import api from "../../api/axios.js";


export default function MySportsmenPage() {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();


    useEffect(() => {
        api.get('students/')
            .then(response => {
                setStudents(response.data);
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
                    <Link to={`/my_sportsmen/add`}>
                        <button className="add-btn">
                            Добавить
                        </button>
                    </Link>
                </div>
            </div>
            <div className="content">
                {!isMobile ? (
                    <table>
                        <tr>
                            <th>Фамилия</th>
                            <th>Имя</th>
                        </tr>
                        {students.map((student, index) => (
                            <tr key={student.id} onClick={() => navigate(`/my_sportsmen/${student.id}`)} style={{ cursor: 'pointer' }}>
                                <td>{student.last_name}</td>
                                <td>{student.first_name}</td>
                            </tr>
                        ))}
                    </table>
                ) : (
                    <div className="mobile-cards">
                        {students.map((student) => (
                            <div className="mobile-card" key={student.id}
                                 onClick={() => navigate(`/my_sportsmen/${student.id}`)}>
                                <p><strong>Фамилия:</strong> {student.last_name}</p>
                                <p><strong>Имя:</strong> {student.first_name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
