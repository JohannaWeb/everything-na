import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeetingRooms } from '../services/api';

const MeetingsScreen = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const data = await getMeetingRooms();
            setRooms(data.rooms || []);
            setError('');
        } catch (err) {
            setError('Failed to load meeting rooms. Please try again.');
            console.error('Error fetching rooms:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = (roomId) => {
        navigate(`/meeting/${roomId}`);
    };

    if (loading) {
        return (
            <div className="meetings-container">
                <div className="loading">Loading meeting rooms...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="meetings-container">
                <div className="error-message">{error}</div>
                <button onClick={fetchRooms}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="meetings-container">
            <div className="meetings-header">
                <h1>NA Meetings</h1>
                <p>Join a virtual meeting room to connect with others in recovery</p>
            </div>

            <div className="rooms-grid">
                {rooms.map((room) => (
                    <div key={room.id} className="room-card">
                        <div className="room-info">
                            <h3>{room.name}</h3>
                            <p className="room-description">{room.description}</p>
                        </div>
                        <button
                            className="join-button"
                            onClick={() => handleJoinRoom(room.id)}
                        >
                            Join Meeting
                        </button>
                    </div>
                ))}
            </div>

            {rooms.length === 0 && (
                <div className="no-rooms">
                    <p>No meeting rooms available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default MeetingsScreen;
