import { useState, useCallback, useRef } from "react";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message);
            }
            return responseData;
        } catch (err) {
            setError(err.message || 'Something went wrong, please try again.');
        }
        setIsLoading(false);
    }, []);

    const clearError = () => {
        setError(null);
    }

    return { isLoading, error, sendRequest, clearError};
};