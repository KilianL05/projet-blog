// Écouter le clic sur le bouton
document.getElementById('generateBlogButton').addEventListener('click', () => {
    fetch('/generate-blog', {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Blog généré avec succès :', data);
            alert('Blog généré avec succès !');
        })
        .catch(error => {
            console.error('Erreur lors de la génération du blog :', error);
            alert('Erreur lors de la génération du blog.');
        });
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('/blogs')
        .then(response => response.json())
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