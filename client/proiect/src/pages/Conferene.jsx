import { useNavigate, useParams } from "react-router-dom";
import "./conference.css";
import useFetchArticles from "../hooks/useFetchArticles";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import useArticleRegister from "../hooks/useArticleRegister";
import useCheckRegister from "../hooks/useCheckRegistered";
import { useEffect } from "react";
import useGetConference from "../hooks/useGetConference";

function Conference() {
    const {id} = useParams();

    const { articles, loading } = useFetchArticles(id); 
    const { loggedIn } = useSelector(state => state.global);
    const { articleRegister, errorRegister, successRegister, loadingRegister  } = useArticleRegister(id);
    const { checkRegister, errorCheck, successCheck, loadingCheck } = useCheckRegister();
    const { conference } = useGetConference(id);

    const { token } = useSelector((state) => state.global);

    console.log(errorCheck, successCheck, loadingCheck);

    useEffect(() => {
        if(token) {
            checkRegister(id);
        }
    }, [token]);

    const navigator = useNavigate();

    const handleRegister = async () => {
        if (!loggedIn) {
            alert('Please authenticate in order to register for conference!');
            return;
        }
        await articleRegister(id);
        if(token) {
            await checkRegister(id);
        }
    };

    return (
        <div className="articles-page">
            <Header/>

            <main className="articles-main">
                
                    <div className="register-section">
                        { conference && <h1>{conference.name}</h1>}
                    { successCheck ? (<h3>User is registered to conference</h3>) : (<button 
                        className="btn register-btn" 
                        onClick={handleRegister} 
                        disabled={loadingRegister || successRegister}
                    >
                         {loadingRegister ? 'Loading...' : successRegister ? 'Registered!' : 'Register to Conference'} 
                    </button>) }
                     {errorRegister && <p className="error">{errorRegister}</p>}
                    {successRegister && <p className="success">Te-ai înregistrat cu succes la conferință!</p>} 
                    </div>
                

                <div className="articles-container">
                    {!loading && articles.map(article => (
                        <div key={article.id} className="article-card" onClick={() => navigator(`/articles/${article.id}`)}>
                            <h2 className="article-title">{article.title}</h2>
                            <p className="article-author"><strong>Author:</strong> {article.author.username}</p>
                            <p className="article-description">{article.description}</p>
                            <p className="article-description">Status: {article.status}</p>
                            <a  className="read-more-btn">Read more</a>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="articles-footer">
                <p>&copy; 2024 Conferințe IT. Toate drepturile rezervate.</p>
            </footer>

            { successCheck && (
                <button className="floating-btn" onClick={() => {
                    navigator(`/conferences/${id}/write`);
                }}>
                    <i className="fas fa-plus"></i>
                </button>
            )}
        </div>
    );
}

export default Conference;