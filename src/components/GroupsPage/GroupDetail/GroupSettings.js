import React, { useState } from 'react';
import './GroupSettings.css';
import axios from 'axios';

function GroupSettings({ group, userId, onGroupUpdated }) {
    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description || '');
    const [isPrivate, setIsPrivate] = useState(group.isPrivate);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isAdmin = group.creator && (
        group.creator._id === userId || group.creator === userId
    );

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put(`http://localhost:5000/api/groups/${group._id}`, {
                name,
                description,
                isPrivate,
                userId
            });
            alert('Group updated successfully');
            onGroupUpdated();
        } catch (err) {
            alert('Failed to update group');
            console.error(err);
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this group? This cannot be undone.')) return;

        setDeleting(true);
        try {
            await axios.delete(`http://localhost:5000/api/groups/${group._id}`, {
                data: { userId }
            });
            alert('Group deleted');
            window.location.href = '/GroupsPage';
        } catch (err) {
            alert('Failed to delete group');
            console.error(err);
        }
        setDeleting(false);
    };

    if (!isAdmin) return null;

    return (
        <div className="group-settings">
            <h3>Group Settings</h3>

            <div className="setting-field">
                <label>Group Name</label>
                <input value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="setting-field">
                <label>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="setting-field">
                <label>
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={e => setIsPrivate(e.target.checked)}
                    />
                    {' '}Private Group
                </label>
            </div>

            {/* Inline Flex Fix */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    {deleting ? 'Deleting...' : 'Delete Group'}
                </button>
            </div>
        </div>
    );
}

export default GroupSettings;
