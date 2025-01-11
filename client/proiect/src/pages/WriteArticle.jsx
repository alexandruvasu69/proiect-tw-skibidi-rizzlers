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
            // Resetarea formularului după succes
            setFormData({
                title: '',
                description: '',
                body: ''
            });
            // Navighează la pagina articolului nou creat
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

            {/* Secțiunea de introducere (Hero) */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Scrie un Nou Articol</h1>
                    <p>Contribuie la conferința noastră și împărtășește-ți cunoștințele cu comunitatea.</p>
                </div>
            </section>

            {/* Containerul principal al formularului */}
            <div className="write-article-container">
                <form className="write-article-form" onSubmit={handleSubmit}>
                    <h2>Completează Detaliile Articolului</h2>
                    
                    <div className="form-group">
                        <label htmlFor="title">Titlu</label>
                        <input 
                            type="text" 
                            id="title" 
                            name="title"
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                            placeholder="Introdu titlul articolului"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="description">Descriere</label>
                        <textarea 
                            id="description" 
                            name="description"
                            value={formData.description} 
                            onChange={handleChange} 
                            required 
                            placeholder="O scurtă descriere a articolului"
                            rows="3"
                        ></textarea>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="body">Conținut</label>
                        <textarea 
                            id="body" 
                            name="body"
                            value={formData.body}
                            onChange={handleChange} 
                            required 
                            placeholder="Scrie conținutul articolului aici"
                            rows="6"
                        ></textarea>
                    </div>
                    
                    { !articleState ? <button type="submit" className="btn" disabled={addArticleLoading}>
                        {addArticleLoading ? 'Se încarcă...' : 'Adaugă Articol'}
                    </button> : <button type="submit" className="btn" disabled={addArticleLoading}>
                        {addArticleLoading ? 'Se încarcă...' : 'Editeaza'}
                    </button>}
                    
                    {addArticleError && <p className="error">{addArticleError}</p>}
                </form>
            </div>
        </>
    )
}

export default WriteArticle;
