import { useState } from 'react';
import { useSelector } from 'react-redux';

const useCheckRegister = () => {
    const [loadingCheck, setLoadingCheck] = useState(false);
    const [errorCheck, setErrorCheck] = useState(null);
    const [successCheck, setSuccessCheck] = useState(false);
    const { token } = useSelector((state) => state.global);

    const checkRegister = async (id) => {
        setLoadingCheck(true);
        setErrorCheck(null);
        setSuccessCheck(false);

        console.log("TOKEN" + token);

        try {
            const response = await fetch(`${import.meta.env.VITE_API}/conferences/${id}/check-registered`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json(); 

            console.log(data);

            if (data.success) {
                setSuccessCheck(true);
            } else {
                setSuccessCheck(false);
            }
        } catch (err) {
            setErrorCheck(err.message || 'Eroare la adăugarea conferinței');
        } finally {
            setLoadingCheck(false);
        }

    }
    
    return { checkRegister ,loadingCheck, errorCheck, successCheck };
}

export default useCheckRegister;