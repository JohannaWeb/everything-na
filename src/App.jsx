import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import DashboardScreen from './pages/DashboardScreen';
import LiteratureScreen from './pages/LiteratureScreen';
import MeetingsScreen from './pages/MeetingsScreen';
import MeetingRoomScreen from './pages/MeetingRoomScreen';
import JustForTodayScreen from './pages/JustForTodayScreen';

import Header from './components/common/Header';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardScreen />
                  </PrivateRoute>
                }
              />
              <Route
                path="/literature"
                element={
                  <PrivateRoute>
                    <LiteratureScreen />
                  </PrivateRoute>
                }
              />
              <Route
                path="/meetings"
                element={
                  <PrivateRoute>
                    <MeetingsScreen />
                  </PrivateRoute>
                }
              />
              <Route
                path="/meeting/:roomId"
                element={
                  <PrivateRoute>
                    <MeetingRoomScreen />
                  </PrivateRoute>
                }
              />
              <Route
                path="/just-for-today"
                element={
                  <PrivateRoute>
                    <JustForTodayScreen />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}


