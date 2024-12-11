document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('token');
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
            const blogsContainer = document.getElementById('blogsContainer');
            blogs.forEach(blog => {
                const blogElement = document.createElement('div');
                blogElement.innerHTML = `
                    <h2>${blog.title}</h2>
                    <button onclick="navigateToDetails(${blog.id})">Voir Détails</button>
                `;
                blogsContainer.appendChild(blogElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des blogs :', error);
            document.getElementById('blogsContainer').innerText = 'Erreur lors du chargement des blogs.';
        });
});

function navigateToDetails(id) {
    window.location.href = `/blog/${id}`;
}