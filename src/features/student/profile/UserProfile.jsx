import React from 'react';
import PersonalInfo from './PersonalInfo';
import StudentInfo from './StudentInfo';
import NotificationCount from '../../home/notification/NotificationCount';
import ScoreTable from './ScoreTable';
import ConductScoreTable from '../trainingscore/ConductScoreTable';

function UserProfile() {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Hồ sơ sinh viên</h2>

            {/* Notification Count */}
            <NotificationCount />

            {/* Personal and Student Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <PersonalInfo />
                <StudentInfo />
            </div>

            {/* Score Tables */}
            <div className="space-y-6">
                <ScoreTable />
                <ConductScoreTable />
            </div>
        </div>
    );
}

export default UserProfile;