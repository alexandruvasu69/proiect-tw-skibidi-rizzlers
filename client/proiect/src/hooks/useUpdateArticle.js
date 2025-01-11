import { useState } from "react";
import { useSelector } from 'react-redux';

const useUpdateArticle = () => {
    const [article, setArticle] = useState(null);
    const [updateArticleLoading, setUpdateArticleLoading] = useState(false);
    const [updateArticleError, setUpdateArticleError] = useState(null);
    const [updateArticleSuccess, setUpdateArticleSuccess] = useState(false);
    const { token } = useSelector(state => state.global);

    const updateArticle = async (id, body) => {
        setUpdateArticleLoading(true);
        setUpdateArticleError(null);
        setUpdateArticleSuccess(false);

        try {
            const response = await fetch(`${import.meta.env.VITE_API}/articles/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data.success) {
                setUpdateArticleSuccess(true);
                setArticle(data.data.article);
            } else {
                setUpdateArticleError(data.message);
            }
        } catch (err) {
            setUpdateArticleError(err.message);
        } finally {
            setUpdateArticleLoading(false);
        }
    }

    return { updateArticle, article, updateArticleLoading, updateArticleError, updateArticleSuccess};
}

export default useUpdateArticle;