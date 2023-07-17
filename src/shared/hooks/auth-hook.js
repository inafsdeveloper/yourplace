import { useState, useCallback, useEffect } from "react";

const tokenExpirationTime = 1000 * 60 * 60;
let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [loginTokenExpirationDate, setLoginTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(null);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);

        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + tokenExpirationTime);
        setLoginTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpirationDate.toISOString()
            })
        );

    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setLoginTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && loginTokenExpirationDate) {
            const remainingTime = loginTokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);

        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, loginTokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    return { token, login, logout, userId };
};