import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from "react-router-dom";
import AgaevImg from '/src/assets/agaev.jpg'
import './MySportsmenPage.css'
import api from "../../api/axios.js";


export default function MySportsmenPage() {

    const [sportsmen, setSportsmen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();


    useEffect(() => {
        api.get('sportsmen/')
            .then(response => {
                setSportsmen(response.data);
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
                        {sportsmen.map((sportsman, index) => (
                            <tr key={sportsman.id} onClick={() => navigate(`/my_sportsmen/${sportsman.id}`)} style={{ cursor: 'pointer' }}>
                                <td>{sportsman.last_name}</td>
                                <td>{sportsman.first_name}</td>
                            </tr>
                        ))}
                    </table>
                ) : (
                    <div className="mobile-cards">
                        {sportsmen.map((sportsman) => (
                            <div className="mobile-card" key={sportsman.id}
                                 onClick={() => navigate(`/my_sportsmen/${sportsman.id}`)}>
                                <p><strong>Фамилия:</strong> {sportsman.last_name}</p>
                                <p><strong>Имя:</strong> {sportsman.first_name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
