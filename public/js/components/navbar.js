import { deleteCookie, createCookie } from '../utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    const authButton = document.getElementById('authButton');
    const personalSpaceButton = document.getElementById('personalSpaceButton');

    if (!token) {
        personalSpaceButton.classList.add('hidden');
    }

    if (token) {
        authButton.textContent = 'Déconnexion';
        authButton.addEventListener('click', async () => {
            sessionStorage.removeItem('token');
            deleteCookie('jwt');
            deleteCookie('token');

            await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            window.location.href = '/';
        });
    } else {
        authButton.textContent = 'Connexion';
        authButton.addEventListener('click', () => {
            window.location.href = '/login';
        });
    }
});