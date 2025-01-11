import { useState } from 'react';
import { useSelector } from 'react-redux';

const useArticleRegister = () => {
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [errorRegister, setErrorRegister] = useState(null);
    const [successRegister, setSuccessRegister] = useState(false);
    const { token } = useSelector((state) => state.global);

    const articleRegister = async (id) => {
        setLoadingRegister(true);
        setErrorRegister(null);
        setSuccessRegister(false);

        try {
            const response = await fetch(`${import.meta.env.VITE_API}/conferences/${id}/authors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.success) {
                setSuccessRegister(true);
            } else {
                const errorData = await response.json();
                setErrorRegister(errorData.message || 'Eroare la adăugarea conferinței');
            }
        } catch (err) {
            setErrorRegister(err.message || 'Eroare la adăugarea conferinței');
        } finally {
            setLoadingRegister(false);
        }

    }
    
    return { articleRegister, loadingRegister, errorRegister, successRegister };
}

export default useArticleRegister;