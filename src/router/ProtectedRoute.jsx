// router/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants';

function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, checkPermission, loading } = useAuth();

    console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
    console.log('ProtectedRoute - loading:', loading);
    console.log('ProtectedRoute - allowedRoles:', allowedRoles);

    if (loading) {
        console.log('ProtectedRoute - Loading state');
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log('ProtectedRoute - Not authenticated, redirecting to login');
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (allowedRoles && !checkPermission(allowedRoles)) {
        console.log('ProtectedRoute - No permission, redirecting to home');
        return <Navigate to={ROUTES.HOME} replace />;
    }

    console.log('ProtectedRoute - Rendering children');
    return children;
}

export default ProtectedRoute;