import React from 'react';
import './MessagePage.css';
import HeaderBar from '../HeaderBar/HeaderBar';

function MessagesPage() {
    return (
        <div>
            <HeaderBar />
            <h1>Messages</h1>
            <div className="messages-container">
                <p>No messages yet.</p>
            </div>
        </div>
    );
}

export default MessagesPage;