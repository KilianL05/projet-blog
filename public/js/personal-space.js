document.addEventListener('DOMContentLoaded', () => {
    const blogForm = document.getElementById('blogForm');
    const articleForm = document.getElementById('articleForm');
    const editBlogForm = document.getElementById('editBlogForm');
    const editArticleForm = document.getElementById('editArticleForm');
    const personalSpaceContainer = document.getElementById('personalSpaceContainer');
    const toggleBlogFormButton = document.getElementById('toggleBlogForm');
    const toggleArticleFormButton = document.getElementById('toggleArticleForm');

    // Toggle visibility of blog form
    toggleBlogFormButton.addEventListener('click', () => {
        blogForm.classList.toggle('hidden');
    });

    // Toggle visibility of article form
    toggleArticleFormButton.addEventListener('click', () => {
        articleForm.classList.toggle('hidden');
    });

    // Fetch and display user's blogs with articles
    const fetchBlogs = async () => {
        const response = await fetch('/blogs/user', {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            }
        });
        const blogs = await response.json();
        personalSpaceContainer.innerHTML = '';
        for (const blog of blogs) {
            const blogElement = document.createElement('div');
            blogElement.className = 'bg-white p-4 rounded shadow-md';
            blogElement.innerHTML = `
                <h2 class="text-xl font-bold">${blog.title}</h2>
                <p>${blog.isPublic ? 'Public' : 'Private'}</p>
                <button class="editBlog bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700" data-id="${blog.id}">Editer</button>
                <button class="deleteBlog bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" data-id="${blog.id}">Supprimer</button>
                <button class="addArticle bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700" data-id="${blog.id}">Ajouter Article</button>
                <div class="articles mt-4"></div>
            `;
            personalSpaceContainer.appendChild(blogElement);

            // Fetch and display articles for each blog
            const articlesResponse = await fetch(`/blogs/${blog.id}`);
            const articles = await articlesResponse.json();
            const articlesContainer = blogElement.querySelector('.articles');
            articles.Articles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.className = 'bg-gray-100 p-2 rounded mt-2';
                articleElement.innerHTML = `
                    <h3 class="text-lg font-semibold">${article.title}</h3>
                    <p>${article.content}</p>
                    <button class="editArticle bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700" data-id="${article.id}">Editer</button>
                    <button class="deleteArticle bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" data-id="${article.id}">Supprimer</button>
                `;
                articlesContainer.appendChild(articleElement);
            });
        }
    };

    // Add a new blog
    blogForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('blogTitle').value;
        const isPublic = document.getElementById('blogPublic').checked;
        await fetch('/blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify({ title, isPublic }),
        });
        blogForm.classList.add('hidden');
        fetchBlogs();
    });

    // Add a new article
    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('articleTitle').value;
        const content = document.getElementById('articleContent').value;
        const blogId = articleForm.getAttribute('data-blog-id');
        await fetch(`/blog/${blogId}/article`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify({ title, content }),
        });
        articleForm.classList.add('hidden');
        fetchBlogs();
    });

    // Edit a blog
    editBlogForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('editBlogTitle').value;
        const isPublic = document.getElementById('editBlogPublic').checked;
        const blogId = editBlogForm.getAttribute('data-blog-id');
        await fetch(`/blog/${blogId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify({ title, isPublic }),
        });
        editBlogForm.classList.add('hidden');
        fetchBlogs();
    });

    // Edit an article
    editArticleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('editArticleTitle').value;
        const content = document.getElementById('editArticleContent').value;
        const articleId = editArticleForm.getAttribute('data-article-id');
        await fetch(`/article/${articleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify({ title, content }),
        });
        editArticleForm.classList.add('hidden');
        fetchBlogs();
    });

    // Edit or delete a blog, or add/edit/delete an article
    personalSpaceContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('deleteBlog')) {
            const blogId = e.target.getAttribute('data-id');
            await fetch(`/blog/${blogId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            fetchBlogs();
        } else if (e.target.classList.contains('editBlog')) {
            const blogId = e.target.getAttribute('data-id');
            const blogTitle = e.target.parentElement.querySelector('h2').innerText;
            const blogPublic = e.target.parentElement.querySelector('p').innerText === 'Public';
            document.getElementById('editBlogTitle').value = blogTitle;
            document.getElementById('editBlogPublic').checked = blogPublic;
            editBlogForm.setAttribute('data-blog-id', blogId);
            editBlogForm.classList.remove('hidden');
        } else if (e.target.classList.contains('addArticle')) {
            const blogId = e.target.getAttribute('data-id');
            articleForm.setAttribute('data-blog-id', blogId);
            articleForm.classList.remove('hidden');
        } else if (e.target.classList.contains('deleteArticle')) {
            const articleId = e.target.getAttribute('data-id');
            await fetch(`/article/${articleId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            fetchBlogs();
        } else if (e.target.classList.contains('editArticle')) {
            const articleId = e.target.getAttribute('data-id');
            const articleTitle = e.target.parentElement.querySelector('h3').innerText;
            const articleContent = e.target.parentElement.querySelector('p').innerText;
            document.getElementById('editArticleTitle').value = articleTitle;
            document.getElementById('editArticleContent').value = articleContent;
            editArticleForm.setAttribute('data-article-id', articleId);
            editArticleForm.classList.remove('hidden');
        }
    });

    fetchBlogs();
});