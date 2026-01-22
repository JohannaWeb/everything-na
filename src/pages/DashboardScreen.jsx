import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardScreen = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <h2>Welcome to your NA Dashboard, {user ? user.username : 'Guest'}!</h2>
      <p>This is your central hub for Narcotics Anonymous resources.</p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>📖 Daily Literature</h3>
          <p>Read inspirational NA literature</p>
          <Link to="/literature" className="card-link">Go to Literature</Link>
        </div>

        <div className="dashboard-card">
          <h3>🙏 Just for Today</h3>
          <p>Daily meditation and reflection</p>
          <Link to="/just-for-today" className="card-link">Read Today's Meditation</Link>
        </div>

        <div className="dashboard-card">
          <h3>👥 Meetings</h3>
          <p>Join virtual NA meetings with text, voice, and video</p>
          <Link to="/meetings" className="card-link">Join a Meeting</Link>
        </div>
      </div>

      <button onClick={logout} className="logout-btn">Logout</button>
    </div>
  );
};

export default DashboardScreen;