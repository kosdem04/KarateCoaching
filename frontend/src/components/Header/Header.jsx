import { useState, useEffect } from 'react';
import './Header.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import {useAuth} from "../../AuthContext.jsx";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname } = useLocation();
    const { isAuthenticated, logout } = useAuth();

    // Закрытие меню при смене страницы
    useEffect(() => {
        setMenuOpen(false);
        setTimeout(() => window.scrollTo(0, 0), 0);
    }, [pathname]);

    return (
        <header className="static-header">
            <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
            <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
                {isAuthenticated ? (
                    <>
                        <Link to="/my_sportsmen/">Мои ученики</Link>
                        <Link to="/my_tournaments/">Мероприятия</Link>
                        <Link to="/my_results/">Результаты</Link>
                        <button onClick={logout} className="logout-button">Выйти</button>
                    </>
                ) : (
                    <Link to="/login/">Войти</Link>
                )}
            </nav>
            <div className="logo"><Link to="/">Тренерская</Link></div>
        </header>
    );
}