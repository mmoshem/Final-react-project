import React, { useState } from 'react';
import './GroupsPage.css';
import HeaderBar from '../HeaderBar/HeaderBar';
import CreateGroupButton from './CreateGroupButton'; 
import AllGroupsButton from './AllGroupsButton';
import CreatedGroupsButton from './CreatedGroupsButton';
import JoinedGroupsButton from './JoinedGroupsButton';
import DiscoverGroupSearch from './DiscoverGroupSearch';

function GroupsPage() {
    const [selectedFilter, setSelectedFilter] = useState('all');

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        console.log(`Filter changed to: ${filter}`);
    };

    return (
        <div>
            <HeaderBar />
            <div className="groups-page-container">
                {/* Left Sidebar */}
                <div className="groups-sidebar">
                    <CreateGroupButton />
                    
                    <div className="user-groups-section">
                        <h3>Your Groups</h3>

                        <div className="filter-buttons">
                            <AllGroupsButton 
                                isActive={selectedFilter === 'all'}
                                onClick={() => handleFilterChange('all')}
                            />
                            <CreatedGroupsButton 
                                isActive={selectedFilter === 'created'}
                                onClick={() => handleFilterChange('created')}
                            />
                            <JoinedGroupsButton 
                                isActive={selectedFilter === 'joined'}
                                onClick={() => handleFilterChange('joined')}
                            />
                        </div>
                        
                        <div className="groups-list">
                        </div>
                    </div>
                </div>

                <div className="groups-search-area">
                        <DiscoverGroupSearch />

                </div>
            </div>
        </div>
    );
}

export default GroupsPage;