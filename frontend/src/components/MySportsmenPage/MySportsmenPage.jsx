import React, { useState, useEffect } from 'react'
import {Link, useNavigate} from "react-router-dom";
import AgaevImg from '/src/assets/agaev.jpg'
import './MySportsmenPage.css'
import api from "../../api/axios.js";


export default function MySportsmenPage() {

    const [sportsmen, setSportsmen] = useState([]);
    const [loading, setLoading] = useState(true);


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
                <table>
                    <tr>
                        <th>Фамилия</th>
                        <th>Имя</th>
                    </tr>
                    {sportsmen.map((sportsman, index) => (
                        <tr>
                            <td><Link to={`/my_sportsmen/${sportsman.id}`}>
                                {sportsman.last_name}
                            </Link></td>
                            <td><Link to={`/my_sportsmen/${sportsman.id}`}>
                                {sportsman.first_name}
                            </Link></td>
                            {/*<td>{sportsman.last_name}</td>*/}
                            {/*<td>{sportsman.first_name}</td>*/}
                        </tr>
                    ))}
                </table>
            </div>
        </>
    )
}
