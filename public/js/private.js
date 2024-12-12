document.addEventListener('DOMContentLoaded', function () {
    let token = sessionStorage.getItem('token');

    console.log(document.cookie);

    if (!token) {
        document.cookie.split('; ').forEach(cookie => {
            const [key, value] = cookie.split('=');
            if (key === 'jwt') {
                token = value;
            }
        });
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
                blogElement.innerHTML = `
                    <h2>${blog.title}</h2>
                    <a href="/blog/${blog.id}">Voir Détails</a>
                `;
                blogsContainer.appendChild(blogElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des blogs :', error);
            document.getElementById('privateBlogsContainer').innerText = 'Erreur lors du chargement des blogs.' + error;
        });
});