// features/auth/tokenUtils.js
// Quản lý logic token
export const isTokenExpired = () => {
    const savedTimestamp = localStorage.getItem('loginTimestamp');
    const loginTimestamp = savedTimestamp ? parseInt(savedTimestamp, 10) : null;
    const TOKEN_EXPIRATION_TIME = 30 * 60 * 1000; // 30 phút
    return loginTimestamp && Date.now() - loginTimestamp > TOKEN_EXPIRATION_TIME;
};

export const updateLoginTimestamp = () => {
    const timestamp = Date.now();
    localStorage.setItem('loginTimestamp', timestamp.toString());
    return timestamp;
};