import { deleteCookie } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    const authButton = document.getElementById('authButton');
    const personalSpaceButton = document.getElementById('personalSpaceButton');

    personalSpaceButton.addEventListener('click', async () => {
        const response = await fetch('/personal-spaceCheck', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            window.location.href = '/personal-space';
        } else {
            alert('Vous devez être connecté et activer la double authentification pour accéder à votre espace personnel.');
            console.error('Failed to access personal space:', response.statusText);
        }
    });

    console.log('Token:', token);
    if (!token) {
        personalSpaceButton.classList.add('hidden');
    }

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