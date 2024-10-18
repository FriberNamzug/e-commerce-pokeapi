import { Outlet } from 'react-router'
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function AuthComponent() {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token-pokeapi');
        if (!token) {
            navigate(-1);
        }

    }, [navigate]);

    return (
        <div>
            <Outlet />
        </div>
    )
}
