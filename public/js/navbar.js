document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    const authButton = document.getElementById('authButton');
    if (token) {
        authButton.textContent = 'Déconnexion';
        authButton.addEventListener('click', () => {
            sessionStorage.removeItem('token');
            window.location.reload();
        });
    } else {
        authButton.textContent = 'Connexion';
        authButton.addEventListener('click', () => {
            window.location.href = '/login';
        });
    }
});