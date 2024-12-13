import { getCookie, deleteCookie, createCookie } from '../utils.js';

document.addEventListener('DOMContentLoaded', function() {
    let token = sessionStorage.getItem('token');
    let cookie = getCookie('jwt');
    if (cookie && (token !== cookie)) {
        console.log('Updating token from cookie');
        token = cookie;
        deleteCookie('jwt');
        sessionStorage.setItem('token', token);
    }

    fetch('/blogsPublic', {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(blogs => {
            const blogsContainer = document.getElementById('blogsContainer');
            blogs.forEach(blog => {
                const blogElement = document.createElement('div');
                blogElement.className = 'bg-white p-6 rounded shadow-md';
                blogElement.innerHTML = `
                    <h2 class="text-xl font-bold">${blog.title}</h2>
                    <p>${blog.isPublic ? 'Public' : 'Privé'}</p>
                    <a href="/blog/${blog.id}" class="text-blue-500 hover:underline">Voir Détails</a>
                `;
                blogsContainer.appendChild(blogElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des blogs :', error);
            document.getElementById('blogsContainer').innerText = 'Erreur lors du chargement des blogs.';
        });
});


document.getElementById('accessPrivateBlog').addEventListener('click', async () => {
    window.location.href = '/blogs/private';
});


document.getElementById('setup2FAButton').addEventListener('click', () => {
    const token = sessionStorage.getItem('token');
    const oneDayInSeconds = 24 * 60 * 60;
    createCookie('token', token, oneDayInSeconds);

    window.location.href = '/2fa';
});