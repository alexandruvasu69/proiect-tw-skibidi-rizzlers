import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function useFetchArticles(conferenceId) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { loggedIn, token } = useSelector((state) => state.global);

    useEffect(() => {
        console.log("TEST LOG IN NOU")
        console.log("Logged in: " + loggedIn);
        console.log(token);
        const fetchArticles = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API}/conferences/${conferenceId}/articles`, {
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
                console.log(data.data.articles);
                setArticles(data.data.articles);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if(loggedIn) {
            fetchArticles();
        } else {
            setArticles([]);
            setLoading(false);
            setError(null);
        }
    }, [loggedIn, token]);

    return { articles, loading, error };
}

export default useFetchArticles;