import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = () => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        fetch('http://localhost:8000/user/login/', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    setError(true);
                }

            })
            .then(data => {
                const token = data.token; 
                localStorage.setItem('token', token);
                navigate('/lessons');
            })
            .catch(error => {
                // Handle any errors
            });
    };

    return (
        <div>
            <h1>Login</h1>
            <input type="text" value={username} onChange={handleUsernameChange} placeholder="Username" />
            <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
            {error && <div>The username and password you entered weren't correct</div>}
        </div>
    );
}

export default Login;