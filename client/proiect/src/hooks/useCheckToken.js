import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCheckTokenLoading, setLoggedIn, setRole, setToken, setUserId } from "../store/slices/globalSlice";
import {jwtDecode} from 'jwt-decode';

function useCheckToken() {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("TESTARE IN CHECK TOKEN")
        const token = localStorage.getItem('token');

        if(location.pathname === "/login" && !token) {
            return;
        }

        if (!token) {
            window.location.href = "/login";
            return;
        }
        
        if(token) {
            fetch(`${import.meta.env.VITE_API}/auth/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token})
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if(data.success) {
                    dispatch(setLoggedIn(true));
                    dispatch(setToken(token));
                    const decoded = jwtDecode(token);
                    dispatch(setRole(decoded.role));
                    dispatch(setUserId(decoded.id));
                    console.log("logged in");

                    if(location.pathname === "/login") {
                        window.location.href = '/';    
                        return;
                    }
                } else {
                    localStorage.removeItem('token');
                    window.location.href = 'login';
                }
            })
            .finally(() => {
                dispatch(setCheckTokenLoading(false));
            })
        } else {
            dispatch(setCheckTokenLoading(false));
        }
    }, []);
}

export default useCheckToken;