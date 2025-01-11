// src/components/AddReviewModal.jsx

import { useState, useEffect } from 'react';
import useAddReview from '../hooks/useAddReview';
import './AddReviewModal.css';

function AddReviewModal({ isOpen, onClose, onAddReview, conferenceId, articleId }) {
    const [formData, setFormData] = useState({
        header: '',
        comments: '',
        status: 'opened', // Valoarea implicită a enum-ului
    });

    const { addReview, addReviewLoading, addReviewError, addReviewSuccess } = useAddReview();

    useEffect(() => {
        if (addReviewSuccess) {
            setFormData({
                header: '',
                comments: '',
                status: 'opened',
            });
            onClose();
        }
    }, [addReviewSuccess]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const review = await addReview(formData, articleId);
        if(review) {
            onAddReview(review.fullReview);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Adaugă un Review</h2>
                <form className="add-review-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="header">Titlu</label>
                        <input 
                            type="text"
                            id="header"
                            name="header"
                            value={formData.header}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment">Comentariu</label>
                        <textarea 
                            id="comments"
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            required
                            rows="4"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select 
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="opened">Opened</option>
                            <option value="closed">Closed</option>
                            <option value="in_progress">In Process</option>
                        </select>
                    </div>
                    <button type="submit" className="btn" disabled={addReviewLoading}>
                        {addReviewLoading ? 'Se încarcă...' : 'Adaugă Review'}
                    </button>
                    {addReviewError && <p className="error">{addReviewError}</p>}
                </form>
            </div>
        </div>
    );
}

export default AddReviewModal;
