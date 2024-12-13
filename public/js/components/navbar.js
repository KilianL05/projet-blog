import { deleteCookie, createCookie } from '../utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    const authButton = document.getElementById('authButton');
    const personalSpaceButton = document.getElementById('personalSpaceButton');

    if (!token) {
        personalSpaceButton.classList.add('hidden');
    }

    personalSpaceButton.addEventListener('click', async () => {
        const oneDayInSeconds = 24 * 60 * 60;
        createCookie('token', token, oneDayInSeconds);
        window.location.href = '/personal-space';
    });

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