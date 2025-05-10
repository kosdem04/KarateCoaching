import { useState, useEffect } from 'react';
import './Header.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import {useAuth} from "../../AuthContext.jsx";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { pathname } = useLocation();
    const { isAuthenticated, logout } = useAuth();



    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pathname]);

    return (
        <header className={scrolled ? 'scrolled' : ''}>
            <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
            <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
                {isAuthenticated ? (
                    <>
                        <Link to="/my_sportsmen/">Мои спортсмены</Link>
                        <Link to={`/my_tournaments/`}>Турниры</Link>
                        <Link to={`/my_results/`}>Результаты</Link>
                        <button onClick={logout} className="logout-button">Выйти</button>
                    </>
                ) : (
                    <Link to="/login/">Войти</Link>
                )}
            </nav>
            <div className="logo"><Link to={`/`}>Тренерская</Link></div>
        </header>
    );
}
