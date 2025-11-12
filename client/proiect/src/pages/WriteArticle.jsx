// src/pages/WriteArticle.jsx

import { useState, useEffect } from "react";
import Header from "../components/Header";
import useAddArticle from "../hooks/useAddArticle";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import './WriteArticle.css'; // Importă fișierul CSS pentru stiluri
import useEditArticle from "../hooks/useEditArticle";


function WriteArticle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { article: articleState } = location.state || {};

    const { article, addArticle, addArticleSuccess, addArticleLoading, addArticleError } = useAddArticle();

    const { editedArticle, editArticle, editArticleLoading, editArticleError, editArticleSuccess } = useEditArticle();

    const [formData, setFormData] = useState({
        title: articleState?.title || '',
        description: articleState?.description || '',
        body: articleState?.body || ''
    });

    useEffect(() => {
        if (addArticleSuccess) {
            setFormData({
                title: '',
                description: '',
                body: ''
            });
            navigate(`/articles/${article.id}`);
        }
    }, [addArticleSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!articleState) {
            await addArticle(id, formData);
        } else {
            console.log("TEST");
            await editArticle(id, formData);
            navigate(`/articles/${id}`);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <Header />
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Write a new Article</h1>
                    <p>Contribute to our conference and share your knowledge with the community</p>
                </div>
            </section>

            <div className="write-article-container">
                <form className="write-article-form" onSubmit={handleSubmit}>
                    <h2>Complete Article Details</h2>
                    
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input 
                            type="text" 
                            id="title" 
                            name="title"
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                            placeholder="Add article title"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea 
                            id="description" 
                            name="description"
                            value={formData.description} 
                            onChange={handleChange} 
                            required 
                            placeholder="A short description of the article"
                            rows="3"
                        ></textarea>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="body">Content</label>
                        <textarea 
                            id="body" 
                            name="body"
                            value={formData.body}
                            onChange={handleChange} 
                            required 
                            placeholder="Write article content here"
                            rows="6"
                        ></textarea>
                    </div>
                    
                    { !articleState ? <button type="submit" className="btn" disabled={addArticleLoading}>
                        {addArticleLoading ? 'Loading...' : 'Add article'}
                    </button> : <button type="submit" className="btn" disabled={addArticleLoading}>
                        {addArticleLoading ? 'Loading...' : 'Edit article'}
                    </button>}
                    
                    {addArticleError && <p className="error">{addArticleError}</p>}
                </form>
            </div>
        </>
    )
}

export default WriteArticle;
