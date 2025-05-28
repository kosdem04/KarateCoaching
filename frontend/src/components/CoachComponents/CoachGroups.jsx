// CoachGroups.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./CoachGroups.css";
import StudentsInGroup from "./StudentsInGroup/StudentsInGroup.jsx";

export default function CoachGroups() {
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    useEffect(() => {
        api.get(`groups/`)
            .then(res => setGroups(res.data))
            .catch(err => console.error("Ошибка загрузки групп:", err));
    }, []);

    return (
        <div className="groups-container">
            <h3>Мои группы</h3>
            <div className="groups-list">
                {groups.map(group => (
                    <div key={group.id} className="group-card" onClick={() => setSelectedGroupId(group.id)}>
                        <h4>{group.name}</h4>
                        <p><strong>Возраст:</strong> 16-24</p>
                        <p><strong>Уровень:</strong> Мастера</p>
                        <p><strong>Кол-во учеников:</strong> 12</p>
                    </div>
                ))}
                {groups.length === 0 && <p>Группы не найдены.</p>}
            </div>
            {selectedGroupId && (
                <StudentsInGroup
                    groupId={selectedGroupId}
                    onClose={() => setSelectedGroupId(null)}
                />
            )}
        </div>
    );
}
