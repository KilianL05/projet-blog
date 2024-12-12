const pathComponents = window.location.pathname.split('/');
const blogId = pathComponents[pathComponents.length - 1];

if (blogId) {
    fetch(`/blogs/${blogId}`)
        .then(response => response.json())
        .then(blog => {
            if (blog.error) {
                document.getElementById('blogDetailContainer').innerText = 'Blog non trouvé.';
            } else {
                const blogDetailContainer = document.getElementById('blogDetailContainer');

                if (blog.Articles.length > 0) {
                    const articlesGrid = document.createElement('div');
                    articlesGrid.className = 'mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
                    blog.Articles.forEach(article => {
                        const articleCard = document.createElement('div');
                        articleCard.className = 'bg-white p-4 rounded shadow-md';
                        articleCard.innerHTML = `
                            <h3 class="text-xl font-bold">${article.title}</h3>
                            <p>${article.content}</p>
                        `;
                        articlesGrid.appendChild(articleCard);
                    });
                    blogDetailContainer.appendChild(articlesGrid);
                } else {
                    blogDetailContainer.innerHTML += '<p>Aucun article associé.</p>';
                }
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération du blog :', error);
            document.getElementById('blogDetailContainer').innerText = 'Erreur lors du chargement des détails du blog.';
        });
} else {
    document.getElementById('blogDetailContainer').innerText = 'Aucun blog ID fourni.';
}