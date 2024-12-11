
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) {
            return value;
        }
    }
    return null;
}


document.addEventListener('DOMContentLoaded', function () {
    let token = sessionStorage.getItem('token');

    if (!token) {
        token = getCookie('jwt');

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
            } else {
                throw new Error('Unexpected response status: ' + response.status);
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
            document.getElementById('blogsContainer').innerText = 'Erreur lors du chargement des blogs.';
        });
});