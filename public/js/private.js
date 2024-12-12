import { getCookie, deleteCookie } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    let token = sessionStorage.getItem('token');
    let cookie = getCookie('jwt');
    console.log('Token:', token);
    console.log('Cookie:', cookie);
    if (cookie && (token !== cookie)) {
        console.log('Updating token from cookie');
        token = cookie;
        deleteCookie('jwt');
        sessionStorage.setItem('token', token);
    }

    fetch('/blogsPrivate', {
        headers: {
            'Authorization': token ? `Bearer ${token}` : ""
        }
    })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                window.location.href = '/login';
                throw new Error('Unauthorized');
            } else if (response.status === 403) {
                throw new Error('Forbidden, 2FA not enabled');
            }
        })
        .then(blogs => {
            const blogsContainer = document.getElementById('privateBlogsContainer');
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
            document.getElementById('privateBlogsContainer').innerText = 'Erreur lors du chargement des blogs.' + error;
        });
});