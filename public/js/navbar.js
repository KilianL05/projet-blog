import { deleteCookie } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    const authButton = document.getElementById('authButton');
    if (token) {
        authButton.textContent = 'Déconnexion';
        authButton.addEventListener('click', async () => {
            sessionStorage.removeItem('token');
            deleteCookie('jwt');

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