import { useState } from 'react';
import { useSelector } from 'react-redux';

const useAddConference = () => {
    const [addConferenceLoading, setAddConferenceLoading] = useState(false);
    const [addConferenceError, setAddConferenceError] = useState(null);
    const [addConferenceSuccess, setAddConferenceSuccess] = useState(false);
    const { token } = useSelector((state) => state.global);

    const addConference = async (body) => {
        setAddConferenceLoading(true);
        setAddConferenceError(null);
        setAddConferenceSuccess(false);

        try {
            const response = await fetch(`${import.meta.env.VITE_API}/conferences`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.success) {
                setAddConferenceSuccess(true);
            } else {
                const errorData = await response.json();
                setAddConferenceError(errorData.message || 'Eroare la adăugarea conferinței');
            }
        } catch (err) {
            setAddConferenceError(err.message || 'Eroare la adăugarea conferinței');
        } finally {
            setAddConferenceLoading(false);
        }
    };

    return { addConference, addConferenceLoading, addConferenceError, addConferenceSuccess };
};

export default useAddConference;
