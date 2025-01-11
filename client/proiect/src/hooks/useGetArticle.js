import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function useGetArticle(id) {
    const [article, setArticle] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { loggedIn, token } = useSelector((state) => state.global);

    useEffect(() => {
        const getArticle = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API}/articles/${id}`, {
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
                console.log(data.data)
                setArticle(data.data.article);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if(loggedIn) {
            getArticle();
        }
    }, [loggedIn, token]);

    return { article, loading, error };
}

export default useGetArticle;