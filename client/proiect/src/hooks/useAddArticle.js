import { useState } from 'react';
import { useSelector } from 'react-redux';

const useAddArticle = () => {
    const [article, setArticle] = useState(null);
    const [addArticleLoading, setAddArticleLoading] = useState(false);
    const [addArticleError, setAddArticleError] = useState(null);
    const [addArticleSuccess, setAddArticleSuccess] = useState(false);
    const { token } = useSelector((state) => state.global);

    const addArticle = async (id, body) => {
        setAddArticleLoading(true);
        setAddArticleError(null);
        setAddArticleSuccess(false);

        try {
            const response = await fetch(`${import.meta.env.VITE_API}/conferences/${id}/articles`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data.success) {
                setAddArticleSuccess(true);
                setArticle(data.data.article);
                return data.data.article;
            } else {
                setAddArticleError(data.message);
                return null;
            }
        } catch (err) {
            setAddArticleError(err.message);
            return null;
        } finally {
            setAddArticleLoading(false);
        }
    };

    return { addArticle, article, addArticleLoading, addArticleError, addArticleSuccess };
};

export default useAddArticle;
