import { useState } from "react"
import { useSelector } from "react-redux";

const useAddReview = () => {
    const [addReviewLoading, setAddReviewLoading] = useState(false);
    const [addReviewError, setAddReviewError] = useState(null);
    const [addReviewSuccess, setAddReviewSuccess] = useState(false);
    const { token } = useSelector(state => state.global);

    const addReview = async (body, id) => {
        setAddReviewLoading(true);
        setAddReviewError(null);
        setAddReviewSuccess(false);

        try {
            const response = await fetch(`${import.meta.env.VITE_API}/articles/${id}/reviews`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data.success) {
                setAddReviewSuccess(true);
                return data.data;
            } else {
                setAddReviewError(data.message);
                return null;
            }
        } catch (err) {
            setAddReviewError(err.message || 'Eroare la adăugarea conferinței');
            return null;
        } finally {
            setAddReviewLoading(false);
        }
    }

    return { addReview, addReviewLoading, addReviewError, addReviewSuccess }
}

export default useAddReview;