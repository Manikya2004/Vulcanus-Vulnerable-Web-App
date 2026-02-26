import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/api/me')
            .then(res => {
                setUser(res.data.user);
                setBio(res.data.user.bio || '');
            })
            .catch((err) => {
                console.error(err);
                navigate('/login');
            });
    }, [navigate]);

    const handleUpdateBio = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await axios.post('http://localhost:3000/api/update-profile', { bio });
            setMessage(res.data.message);
            setUser(prev => ({ ...prev, bio }));
        } catch (err) {
            setMessage('Error updating bio');
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/api/logout');
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container">
            <h2>Dashboard</h2>
            <div>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Current Bio:</strong> {user.bio || 'No bio set.'}</p>
            </div>

            <div>
                <h3>Update Profile</h3>
                <form onSubmit={handleUpdateBio}>
                    <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="Write something about yourself"
                    />
                    <button type="submit">Save Bio</button>
                </form>
                {message && <p className="success">{message}</p>}
            </div>

            <button onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
}
