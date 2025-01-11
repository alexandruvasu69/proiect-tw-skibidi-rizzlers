// src/pages/Article.jsx

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import useGetArticle from "../hooks/useGetArticle";
import AddReviewModal from "../components/AddReviewModal"; // Importă modalul
import './article.css';
import { useNavigate } from "react-router-dom";
import useEditReview from "../hooks/useEditReview";
import useEditArticle from "../hooks/useEditArticle";

function Article() {
    const { id } = useParams(); // Presupunem că `id` este `articleId`
    const navigator = useNavigate();

    const { loggedIn, role, userId } = useSelector(state => state.global);
    const { article, loading, error } = useGetArticle(id);
    const [ articleState, setArticleState ] = useState();
    const { editArticle, editArticleLoading, editArticleError } = useEditArticle();
    const { editReview, editReviewLoading, editReviewError } = useEditReview();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (article) {
          setArticleState(article);
        }

        console.log("REVIEWS:" + articleState?.review);
    }, [article]);

    const openModal = () => {
        console.log("OPEN MODAL");
        return setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const handleAddReview = (review) => {
        setArticleState(prev => {
            if (!prev || !prev.reviews) {
                return {
                  ...prev,
                  reviews: [review]
                };
              }
              return {
                ...prev,
                reviews: [...prev.reviews, review]
              };
        });
    }

    const handleEditClick = () => {
        navigator(`/articles/${article.id}/edit`, { 
          state: {
            article: article,
          }
        });
    };

    const handleApproveArticle = async () => {
        if(article) {
            const editedArticle = await editArticle(article.id, { status: "accepted" });
            console.log(editedArticle)
            setArticleState(editedArticle);
        }
    }

    const handleEditReview = async (reviewId, status) => {

        console.log("EDIT REVIEW: ", articleState);
        const editedReview = await editReview({ status: status }, reviewId);
        console.log("EDITED REVIEW: ", editedReview.fullReview);
        setArticleState((prev) => {
            if (!prev || !prev.reviews) {
              return prev;
            }

            const updatedReviews = prev.reviews.map((rev) =>
              rev.id === editedReview.fullReview.id ? editedReview.fullReview : rev
            );

            if(status !== closed) {
                return {
                    ...prev,
                    status: "needs_revision",
                    reviews: updatedReviews,
                };
            }
            
            return {
              ...prev,
              reviews: updatedReviews,
            };
          });
    }

    if (loading) return <p>Se încarcă...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div>
            <Header />

            { articleState?.status === "accepted" && (userId === articleState.authorId || role === "reviewer") &&
                <div className="approved-section">
                    <h3>The article has been approved and is now visible to everybody</h3>
                </div>
            }

            {articleState?.reviews && articleState?.reviews.length > 0 && (
                <div className="reviews-section">
                    <h2>Review-uri</h2>
                    {articleState?.reviews.map(review => (
                        <div className={`review-container 
                            ${review.status === "in_progress" ? "in-progress" : ""}
                            ${review.status === "closed" ? "closed" : ""}
                          `} key={review.id}>
                            <div className="review-header-container">
                                <h3 className="review-header">{review.header}</h3>
                                <div className={`review-status 
                                    ${review.status === "opened" ? "status-opened" : ""}
                                    ${review.status === "closed" ? "status-closed" : ""}
                                    ${review.status === "in_progress" ? "status-progress" : ""}
                                `}>{
                                    (() => {
                                        switch (review.status) {
                                          case "opened":
                                            return <p className="status-text">Deschis</p>;
                                          case "in_progress":
                                            return <p className="status-text">Asteapta aprobare</p>;
                                          case "closed":
                                            return <p className="status-text">Inchis</p>;
                                          default:
                                            return;
                                        }
                                      })()
                                }</div>
                            </div>
                            <p className="review-comment">{review.comments}</p>
                            <p className="review-status">Status: {review.status}</p>
                            <p className="review-author">Recenzor: {review.reviewer.username}</p>

                            { role == "reviewer" && userId === review.reviewer.id && review.status === "in_progress" && <div className="review-actions">
                                <button className="approve-btn" onClick={async () => handleEditReview(review.id, "closed")}>
                                    ✓ Finish
                                </button>
                                <button className="reject-btn" onClick={async () => handleEditReview(review.id, "opened")}>
                                    ✗ Reject
                                </button>
                            </div>}
                            { role === "author" && review.status === "opened" && 
                                <button className="approve-btn" onClick={async () => handleEditReview(review.id, "in_progress")}>
                                    Finalizat
                                </button>
                            }
                            { role === "reviewer" && userId === review.reviewer.id && review.status === "closed" &&
                                <button className="approve-btn" onClick={() => handleEditReview(review.id, "opened")}>
                                    Redeschide review
                                </button>
                            }
                        </div>
                    ))}
                </div>
            )}

            {(editArticleError || editReviewError) && <p>Eroare: {editArticle ? `${editArticle}` : `${editReviewError}`}</p>}

            {article && (
                <div className="article-page-container">
                    {userId == article.authorId && <button className="review-btn" onClick={handleEditClick}>
                           Editeaza
                        </button>}
                    <div className="article-review-container">
                        {loggedIn && role !== "author" && (
                            <button className="review-btn" onClick={openModal} disabled={!!editReviewLoading||!!editArticleLoading}>
                                {(editArticleLoading || editReviewLoading) ? "Se incarca..." : "Adaugă Review"}
                            </button>
                        )}
                        {loggedIn && role === "reviewer" && articleState?.reviews.every(review => review.status === "closed") && article.status !== "accepted" && (
                            <button className="approve-article-btn" onClick={handleApproveArticle} disabled={!!editArticleLoading}>
                                {editArticleLoading ? "Se incarca..." : "Aproba articol"}
                            </button>
                        )}
                    </div>
                    <h1 className="article-page-title">{article.title}</h1>
                    <h3 className="article-page-description">{article.description}</h3>
                    <p className="article-page-body">{article.body}</p>
                </div>
            )}

            <AddReviewModal 
                isOpen={isModalOpen} 
                onClose={closeModal}
                onAddReview={handleAddReview}
                conferenceId={article?.conferenceId} 
                articleId={id} 
            />
        </div>
    );
}

export default Article;
