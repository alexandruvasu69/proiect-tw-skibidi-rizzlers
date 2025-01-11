import { useState } from 'react';
import { useSelector } from 'react-redux';

const useEditArticle = () => {
    const [editedArticle, setEditedArticle] = useState(null);
    const [editArticleLoading, setEditArticleLoading] = useState(false);
    const [editArticleError, setEditArticleError] = useState(null);
    const [editArticleSuccess, setEditArticleSuccess] = useState(false);
    const { token } = useSelector((state) => state.global);

    const editArticle = async (id, body) => {
        setEditArticleLoading(true);
        setEditArticleError(null);
        setEditArticleSuccess(false);

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
            console.log(data);

            if (data.success) {
                setEditArticleSuccess(true);
                setEditedArticle(data.data.article);
                return data.data.fullArticle;
            } else {
                setEditArticleError(data.message);
                return null;
            }
        } catch (err) {
            setEditArticleError(err.message);
            return null;
        } finally {
            setEditArticleLoading(false);
        }
    };

    return { editArticle, editedArticle, editArticleLoading, editArticleError, editArticleSuccess };
};

export default useEditArticle;
