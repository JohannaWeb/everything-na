import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { OpenVidu } from 'openvidu-browser';
import { useAuth } from '../context/AuthContext';
import {
    getMessages,
    sendMessage,
    getSharingQueue,
    joinSharingQueue,
    leaveSharingQueue,
    createSession,
    createToken,
    createWebSocketConnection,
} from '../services/api';

const MeetingRoomScreen = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [queue, setQueue] = useState([]);
    const [error, setError] = useState('');

    // Video call state
    const [OV, setOV] = useState(null);
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [inVideoCall, setInVideoCall] = useState(false);

    // WebSocket state
    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Load initial messages and queue
        loadMessages();
        loadQueue();

        // Connect WebSocket for real-time updates
        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (session) {
                session.disconnect();
            }
        };
    }, [roomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadMessages = async () => {
        try {
            const data = await getMessages(roomId);
            setMessages(data.messages || []);
        } catch (err) {
            console.error('Error loading messages:', err);
        }
    };

    const loadQueue = async () => {
        try {
            const data = await getSharingQueue(roomId);
            setQueue(data.queue || []);
        } catch (err) {
            console.error('Error loading queue:', err);
        }
    };

    const connectWebSocket = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const ws = createWebSocketConnection(token);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket connected');
                ws.send(JSON.stringify({ type: 'joinRoom', roomId: roomId.toString() }));
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'message') {
                    setMessages(prev => [...prev, data.message]);
                } else if (data.type === 'queueUpdate') {
                    loadQueue();
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
            };
        } catch (err) {
            console.error('Error connecting WebSocket:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const message = await sendMessage(roomId, newMessage);
            setMessages(prev => [...prev, message]);
            setNewMessage('');
        } catch (err) {
            setError('Failed to send message');
            console.error('Error sending message:', err);
        }
    };

    const handleJoinQueue = async () => {
        try {
            await joinSharingQueue(roomId);
            loadQueue();
        } catch (err) {
            setError('Failed to join queue');
            console.error('Error joining queue:', err);
        }
    };

    const handleLeaveQueue = async () => {
        try {
            await leaveSharingQueue(roomId, user.username);
            loadQueue();
        } catch (err) {
            setError('Failed to leave queue');
            console.error('Error leaving queue:', err);
        }
    };

    const isInQueue = () => {
        return queue.some(item => item.author === user.username);
    };

    // Video call functions
    const joinVideoCall = async () => {
        try {
            const ov = new OpenVidu();
            setOV(ov);

            const newSession = ov.initSession();
            setSession(newSession);

            // Subscribe to new streams
            newSession.on('streamCreated', (event) => {
                const subscriber = newSession.subscribe(event.stream, undefined);
                setSubscribers(prev => [...prev, subscriber]);
            });

            newSession.on('streamDestroyed', (event) => {
                setSubscribers(prev => prev.filter(sub => sub !== event.stream.streamManager));
            });

            // Get session ID and token from backend
            const sessionId = await createSession(`room-${roomId}`);
            const token = await createToken(sessionId);

            // Connect to session
            await newSession.connect(token);

            // Create publisher
            const pub = await ov.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: audioEnabled,
                publishVideo: videoEnabled,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });

            newSession.publish(pub);
            setPublisher(pub);
            setInVideoCall(true);
        } catch (err) {
            console.error('Error joining video call:', err);
            setError('Failed to join video call. Make sure OpenVidu server is running.');
        }
    };

    const leaveVideoCall = () => {
        if (session) {
            session.disconnect();
        }
        setSession(null);
        setPublisher(null);
        setSubscribers([]);
        setInVideoCall(false);
    };

    const toggleVideo = () => {
        if (publisher) {
            publisher.publishVideo(!videoEnabled);
            setVideoEnabled(!videoEnabled);
        }
    };

    const toggleAudio = () => {
        if (publisher) {
            publisher.publishAudio(!audioEnabled);
            setAudioEnabled(!audioEnabled);
        }
    };

    return (
        <div className="meeting-room-container">
            <div className="meeting-header">
                <h2>Meeting Room {roomId}</h2>
                {error && <div className="error-message">{error}</div>}
            </div>

            <div className="meeting-content">
                {/* Video Section */}
                <div className="video-section">
                    {!inVideoCall ? (
                        <div className="video-placeholder">
                            <button className="join-video-btn" onClick={joinVideoCall}>
                                Join Video Call
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="video-grid">
                                {/* Local video */}
                                {publisher && (
                                    <div className="video-container">
                                        <div ref={(node) => {
                                            if (node && publisher) {
                                                publisher.addVideoElement(node);
                                            }
                                        }} className="video-element" />
                                        <div className="video-label">You</div>
                                    </div>
                                )}

                                {/* Remote videos */}
                                {subscribers.map((sub, index) => (
                                    <div key={index} className="video-container">
                                        <div ref={(node) => {
                                            if (node && sub) {
                                                sub.addVideoElement(node);
                                            }
                                        }} className="video-element" />
                                        <div className="video-label">Participant {index + 1}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Video controls */}
                            <div className="video-controls">
                                <button
                                    className={`control-btn ${!audioEnabled ? 'disabled' : ''}`}
                                    onClick={toggleAudio}
                                >
                                    {audioEnabled ? '🎤 Mic On' : '🔇 Mic Off'}
                                </button>
                                <button
                                    className={`control-btn ${!videoEnabled ? 'disabled' : ''}`}
                                    onClick={toggleVideo}
                                >
                                    {videoEnabled ? '📹 Camera On' : '📷 Camera Off'}
                                </button>
                                <button
                                    className="control-btn leave-btn"
                                    onClick={leaveVideoCall}
                                >
                                    Leave Call
                                </button>
                            </div>
                        </>
                    )}

                    {/* Sharing Queue */}
                    <div className="sharing-queue">
                        <h3>Sharing Queue</h3>
                        <div className="queue-list">
                            {queue.length === 0 ? (
                                <p className="queue-empty">No one in queue</p>
                            ) : (
                                queue.map((item, index) => (
                                    <div key={item.id} className="queue-item">
                                        <span className="queue-position">{index + 1}.</span>
                                        <span className="queue-author">{item.author}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        {!isInQueue() ? (
                            <button className="queue-btn" onClick={handleJoinQueue}>
                                🖐 Raise Hand
                            </button>
                        ) : (
                            <button className="queue-btn leave" onClick={handleLeaveQueue}>
                                ❌ Leave Queue
                            </button>
                        )}
                    </div>
                </div>

                {/* Chat Section */}
                <div className="chat-section">
                    <h3>Chat</h3>
                    <div className="messages-container">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.author === user.username ? 'own-message' : ''}`}
                            >
                                <div className="message-author">{msg.author}</div>
                                <div className="message-content">{msg.content}</div>
                                <div className="message-time">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-form" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="chat-input"
                        />
                        <button type="submit" className="send-btn">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MeetingRoomScreen;
