import { useState, useEffect } from 'react';
import useAddConference from '../hooks/useAddConference';
import Select from 'react-select';
import './addconferencemodal.css';

function AddConferenceModal({ isOpen, onClose }) {
    const { addConference, success } = useAddConference();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        reviewerIds: []
    });
    const [loading, setLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchOptions = async () => {
            const response = await fetch(`${import.meta.env.VITE_API}/users/reviewers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            const formattedOptions = data.map(reviewer => ({
                value: reviewer.id,
                label: reviewer.username,
            }));
            console.log(formattedOptions);

            setOptions(formattedOptions);
        };

        if(isOpen) {
            fetchOptions();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        
        console.log(formData);
    };

    const handleSelectChange = (selected) => {
        setSelectedOptions(selected);
        setFormData(prevState => ({
            ...prevState,
            reviewerIds: selected.map(el => el.value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addConference(formData);
        if (success) {
            setFormData({
                title: '',
                description: '',
                reviewerIds: []
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Adaugă o Conferință</h2>
                <form  encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Titlu</label>
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
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
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="options">Selectează Opțiuni</label>
                        <Select
                            id="options"
                            name="options"
                            options={options}
                            isMulti
                            value={selectedOptions}
                            onChange={handleSelectChange}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Se încarcă...' : 'Adaugă Conferința'}
                    </button> 
                </form>
            </div>
        </div>
    );
}

export default AddConferenceModal;
