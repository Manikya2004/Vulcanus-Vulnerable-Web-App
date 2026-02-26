import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setQuery('');
        try {
            const res = await axios.post('http://localhost:3000/api/login', { username, password });
            if (res.data.message === 'Login successful') {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.details || err.response?.data?.error || 'An error occurred');
            setQuery(err.response?.data?.query || '');
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign In</button>
            </form>
            {error && <div className="error">Error: {error}</div>}
            {query && (
                <div>
                    <strong>Executed Query:</strong> <br />
                    <code>{query}</code>
                </div>
            )}
            <p>
                <Link to="/register">Register</Link>
            </p>
        </div>
    );
}
