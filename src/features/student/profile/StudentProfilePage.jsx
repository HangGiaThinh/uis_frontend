import React from "react";
import StudentProfileLoader from "../../components/profile/StudentProfileLoader";
import StudentProfile from "../../components/profile/StudentProfile";

function StudentProfilePage() {
    return (
        <StudentProfileLoader>
            {({ profile }) => <StudentProfile profile={profile} />}
        </StudentProfileLoader>
    );
}

export default StudentProfilePage; 