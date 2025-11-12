import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function useFetchConferences() {
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { loggedIn, token } = useSelector((state) => state.global);

    useEffect(() => {
        console.log("TEST IN USE FETCH CONFERENCES");
        console.log(token);
        console.log(loggedIn);

        const fetchConferences = async () => {
            setLoading(true);
            setError(null);
            setSuccess(false);

            try {
                const response = await fetch(`${import.meta.env.VITE_API}/conferences`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setConferences(data.data.conferences);
                setSuccess(true);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        if(loggedIn) {
            fetchConferences();
        } else {
            setConferences([]);
            setLoading(false);
            setError(null);
            setSuccess(false);
        }
    }, [loggedIn, token]);

    return { conferences, loading, error, success };
}

export default useFetchConferences;