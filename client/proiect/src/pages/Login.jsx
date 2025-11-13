import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { useDispatch } from "react-redux";
import { setCheckTokenLoading, setLoggedIn, setRole, setToken, setUserId } from "../store/slices/globalSlice";

function Login() {
    const [formState, setFormState] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const updateFormState = (key, value) => {
        setFormState((prevState) => ({
            ...prevState,
            [key]: value
        }));   
    }

    const fetchLogin = async () => {
        if(formState.username.length === 0 || formState.password.length === 0) {
            setError('Empty username or password');
            return;
        }

        if(error.length > 0) {
            setError('');
        }

        console.log("FORMSTATE:" + formState.username + " " + formState.password);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formState)
        }

        const result = await fetch(`${import.meta.env.VITE_API}/auth/login`, options);
        const json = await result.json();

        if(!json.success) {
            setError(json.message);
        } else {
            localStorage.setItem('token', json.data.token);
            dispatch(setLoggedIn(true));
            dispatch(setCheckTokenLoading(false));
            dispatch(setToken(json.data.token));
            dispatch(setRole(json.data.user.role));
            dispatch(setUserId(json.data.user.id));
            navigate('/');
        }
    }

    return (<div className="login-container">
    <div className="login-box">
        <div className="logo">
            <i className="fas fa-laptop-code"></i>
            <h2 style={{margin: 0}}>Conferințe IT</h2>
        </div>
        <form id="loginForm" onSubmit={(e) => {
            e.preventDefault();
            fetchLogin();
        }}>
            <div className="input-group">
                <i className="fas fa-user"></i>
                <input onChange={(e) => updateFormState('username', e.target.value)} type="username" id="username" name="username" placeholder="username" required />
            </div>
            <div className="input-group">
                <i className="fas fa-lock"></i>
                <input onChange={(e) => updateFormState('password', e.target.value)} type="password" id="password" name="password" placeholder="password" required />
            </div>
            <button type="submit" className="btn">Authenticate</button>
            <div className="links">
                <a href="#">Forgot password</a>
                <span> | </span>
                <a href="#">Register</a>
            </div>
        </form>
    </div>
</div>)
}

export default Login;