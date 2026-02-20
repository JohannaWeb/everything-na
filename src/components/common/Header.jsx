import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <h1>Narcotics Anonymous — NA App (React)</h1>
            <nav>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/literature">Literature</Link></li>
                    <li><Link to="/meetings">Meetings</Link></li>
                    <li><Link to="/just-for-today">Just for Today</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
