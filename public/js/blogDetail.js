// Obtenez le chemin de l'URL
const pathComponents = window.location.pathname.split('/');

// Supposons que le dernier composant du chemin soit l'ID du blog
const blogId = pathComponents[pathComponents.length - 1];

console.log('blogId:', blogId);

if (blogId) {
    fetch(`/blogs/${blogId}`)
        .then(response => response.json())
        .then(blog => {
            console.log('Détails du blog:', blog);
            if (blog.error) {
                document.getElementById('blogDetailContainer').innerText = 'Blog non trouvé.';
            } else {
                const blogDetailContainer = document.getElementById('blogDetailContainer');
                blogDetailContainer.innerHTML = `<h2>${blog.title}</h2><h3>Articles:</h3>`;

                if (blog.Articles.length > 0) {
                    const articlesList = document.createElement('ul');
                    blog.Articles.forEach(article => {
                        const articleItem = document.createElement('li');
                        articleItem.innerText = article.title;
                        articlesList.appendChild(articleItem);
                    });
                    blogDetailContainer.appendChild(articlesList);
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