import { useState } from "react"
import { useSelector } from "react-redux";

const useEditReview = () => {
    const [editReviewLoading, setEditReviewLoading] = useState(false);
    const [editReviewError, setEditReviewError] = useState(null);
    const [editReviewSuccess, setEditReviewSuccess] = useState(false);
    const { token } = useSelector(state => state.global);

    const editReview = async (body, id) => {
        setEditReviewLoading(true);
        setEditReviewError(null);
        setEditReviewSuccess(false);

        try {
            const response = await fetch(`${import.meta.env.VITE_API}/reviews/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data.success) {
                setEditReviewSuccess(true);
                return data.data;
            } else {
                setEditReviewError(data.message);
                return null;
            }
        } catch (err) {
            setEditReviewError(err.message || 'Eroare la adăugarea conferinței');
            return null;
        } finally {
            setEditReviewLoading(false);
        }
    }

    return { editReview, editReviewLoading, editReviewError, editReviewSuccess }
}

export default useEditReview;