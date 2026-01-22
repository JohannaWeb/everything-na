import React, { useState, useEffect } from 'react';
import { getDailyReflection } from '../services/api';

const JustForTodayScreen = () => {
    const [reflection, setReflection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReflection();
    }, []);

    const fetchReflection = async () => {
        try {
            setLoading(true);
            const data = await getDailyReflection();
            setReflection(data);
            setError('');
        } catch (err) {
            setError('Failed to load today\'s reflection. Please try again later.');
            console.error('Error fetching reflection:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="just-for-today-container">
                <div className="loading">Loading today's reflection...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="just-for-today-container">
                <div className="error-message">{error}</div>
                <button onClick={fetchReflection}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="just-for-today-container">
            <div className="reflection-content">
                <div className="reflection-header">
                    <h1>Just for Today</h1>
                    {reflection?.date && <p className="reflection-date">{reflection.date}</p>}
                </div>

                {reflection?.title && (
                    <h2 className="reflection-title">"{reflection.title}"</h2>
                )}

                {reflection?.content && (
                    <div className="reflection-text">
                        {reflection.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph.trim()}</p>
                        ))}
                    </div>
                )}

                <div className="reflection-footer">
                    <p className="reflection-quote">
                        "Just for today, I will try to live through this day only, and not tackle my whole life problem at once."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JustForTodayScreen;
