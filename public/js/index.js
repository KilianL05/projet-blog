import {createCookie} from "./utils.js";

document.addEventListener('DOMContentLoaded', function() {
    fetch('/blogs')
        .then(response => response.json())
        .then(blogs => {
            const blogsContainer = document.getElementById('blogsContainer');
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
