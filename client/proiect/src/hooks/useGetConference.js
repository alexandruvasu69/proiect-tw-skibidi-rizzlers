import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function useGetConference(id) {
    const [conference, setConference] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { loggedIn, token } = useSelector((state) => state.global);

    useEffect(() => {
        const getConference = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API}/conferences/${id}`, {
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
                setConference(data.data.conference);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if(loggedIn) {
            getConference();
        }
    }, [loggedIn, token]);

    return { conference, loading, error };
}

export default useGetConference;