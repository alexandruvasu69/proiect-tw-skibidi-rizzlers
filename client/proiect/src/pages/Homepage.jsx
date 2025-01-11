import { useSelector } from "react-redux";
import useFetchConferences from "../hooks/useFetchConferences";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddConferenceModal from "../components/AddConferenceModal";
import Header from "../components/Header";

function Homepage() {
    const { loggedIn, role, token } = useSelector((state) => state.global);
    const { conferences, loading, error, success } = useFetchConferences();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {console.log(token)}, [token]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const navigator = useNavigate();

    return (
        <>
            <Header/>
            { loading && <p>Loading...</p> }
            { error && <p>{error}</p> }
            { success && <main>
                <section className="conferences">
                    <div className="container">
                        <h2>Conferințele Noastre</h2>
                        <div className="conference-grid">

                            { conferences.map(conference => {
                                return <div className="conference-card" key={conference.id} onClick={() => navigator(`/conferences/${conference.id}`)}>
                                    <img src="https://via.placeholder.com/400x200" alt="Conferință 1" />
                                    <div className="conference-content">
                                        <h3>{conference.title}</h3>
                                        <p>{conference.description}</p>
                                        <button className="btn">Detalii</button>
                                    </div>
                                </div>
                            
                            }) }
                            
                        </div>
                    </div>
                </section>
            </main> }

    
            <footer>
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>Contact</h3>
                            <p>Email: exempluemail@tehnologiiweb.ro</p>
                            <p>Telefon: +40 000 000 000</p>
                        </div>
                        <div className="footer-section">
                            <h3>Urmărește-ne</h3>
                            <div className="social-icons">
                                <span><i className="fab fa-facebook-f"></i></span>
                                <span><i className="fab fa-twitter"></i></span>
                                <span><i className="fab fa-linkedin-in"></i></span>
                                <span><i className="fab fa-instagram"></i></span>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 Proiect TW. Toate drepturile rezervate.</p>
                    </div>
                </div>
            </footer>

            { loggedIn && role === 'organizer' && (
                <button className="floating-btn" onClick={openModal}>
                    <i className="fas fa-plus"></i>
                </button>
            )}

            {/* Modalul de adăugare conferință */}
            <AddConferenceModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    )
}

export default Homepage;