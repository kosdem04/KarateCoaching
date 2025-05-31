import { useEffect, useState } from "react";
import "./StudentsInGroup.css";
import api from "../../../api/axios.js";
import StudentProfile from "../StudentProfile/StudentProfile.jsx"; // путь к компоненту

export default function StudentsInGroup({ groupId, onClose }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    useEffect(() => {
        if (!groupId) return;
        setLoading(true);
        api.get(`groups/${groupId}/students`)
            .then(response => {
                setStudents(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Ошибка загрузки учеников:", error);
                setLoading(false);
            });
    }, [groupId]);

    return (
        <>
            <div className="group-details-overlay">
                <div className="overlay-backdrop" onClick={onClose}>
                    <button className="close-button">✕</button>
                </div>
                <div className="group-details-panel">
                    <h3>Ученики группы</h3>
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : students.length > 0 ? (
                        <ul className="students-list">
                            {students.map(student => (
                                <li key={student.id} onClick={() => setSelectedStudentId(student.id)}>
                                    {student.last_name} {student.first_name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Учеников нет</p>
                    )}
                </div>
            </div>

            {selectedStudentId && (
                <StudentProfile
                    studentId={selectedStudentId}
                    onClose={() => setSelectedStudentId(null)}
                />
            )}
        </>
    );
}
