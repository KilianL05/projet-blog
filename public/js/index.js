document.addEventListener('DOMContentLoaded', function() {
    fetch('/blogs')
        .then(response => response.json())
        .then(blogs => {
            const blogsContainer = document.getElementById('blogsContainer');
            blogs.forEach(blog => {
                const blogElement = document.createElement('div');
                blogElement.innerHTML = `
                    <h2>${blog.title}</h2>
                    <a href="/blog/${blog.id}">Voir Détails</button>
                `;
                blogsContainer.appendChild(blogElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des blogs :', error);
            document.getElementById('blogsContainer').innerText = 'Erreur lors du chargement des blogs.';
        });
});

const twoFactorAuth = document.getElementById('setup2FAButton');
twoFactorAuth.addEventListener("onclick", () => {
    const token = sessionStorage.getItem('token'); // Retrieve the token from sessionStorage
    console.log('token:', token);

    if (!token) {
        console.error('No token found in sessionStorage');
        return;
    }

    fetch('/qrcode', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('qrcode-container').innerHTML = html;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});



document.getElementById('accessPrivateBlog').addEventListener('click', async (e) => {
    window.location.href = '/blogs/private';
});

