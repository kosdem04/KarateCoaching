// CoachesProfile.jsx
import { useAuth } from "../../../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import './CoachProfile.css';
import { useEffect, useState } from "react";
import api from "../../../api/axios.js";
import CoachGroups from "../../../components/CoachComponents/CoachGroups"; // импортируем компонент

const menuItems = [
    { id: "groups", label: "Группы" },
    { id: "events", label: "Мероприятия" },
    { id: "results", label: "Результаты" },
    // { id: "payments", label: "Оплата" },
    // { id: "purchases", label: "Мои покупки" },
    // { id: "education", label: "Моё обучение" },
    // { id: "shop", label: "Магазин" },
    // { id: "documents", label: "Документы" },
];

export default function CoachProfile() {
    const { isAuthenticated } = useAuth();
    const [coachData, setCoachData] = useState({});
    const [activeSection, setActiveSection] = useState("groups");
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            api.get("/auth/get_user_data")
                .then(response => setCoachData(response.data))
                .catch(error => console.error("Ошибка получения информации о тренере:", error));
        }
    }, [isAuthenticated]);

    const renderActiveSection = () => {
        switch (activeSection) {
            case "groups":
                return <CoachGroups coachId={coachData.id} />;
            // другие кейсы позже
            default:
                return <div style={{ padding: '2rem' }}>Раздел в разработке</div>;
        }
    };

    return (
        <div className="profile-container">
            {isAuthenticated && (
                <div className="profile-card">
                    <div className="profile-left">
                        <div className="avatar-container">
                            <img
                                src={coachData.img_url || "/default-avatar.png"}
                                alt="Avatar"
                                className="avatar"
                            />
                            <button className="edit-avatar-btn">✏️</button>
                        </div>
                    </div>
                    <div className="profile-right">
                        <h2>{coachData.last_name} {coachData.first_name} {coachData.patronymic}</h2>
                        <p className="birth-date">{coachData.date_of_birth} ({new Date().getFullYear() - new Date(coachData.date_of_birth).getFullYear()})</p>
                        <p className="online-status">Сейчас онлайн</p>
                        <p>{coachData.phone_number}</p>
                        <p>{coachData.email}</p>
                    </div>
                </div>
            )}

            <div className="profile-menu">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => setActiveSection(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="profile-section">
                {renderActiveSection()}
            </div>
        </div>
    );
}
