document.addEventListener('DOMContentLoaded', () => {
    const blogForm = document.getElementById('blogForm');
    const articleForm = document.getElementById('articleForm');
    const editBlogForm = document.getElementById('editBlogForm');
    const editArticleForm = document.getElementById('editArticleForm');
    const personalSpaceContainer = document.getElementById('personalSpaceContainer');
    const toggleBlogFormButton = document.getElementById('toggleBlogForm');

    toggleBlogFormButton.addEventListener('click', () => {
        blogForm.classList.toggle('hidden');
    });

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
        await refreshPersonalSpace();
    });

    // public/js/profile/personal-space.js
    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('articleTitle').value;
        const content = document.getElementById('articleContent').value;
        const blogId = articleForm.getAttribute('data-blog-id');
        const response = await fetch(`/blog/${blogId}/article`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify({ title, content }),
        });
        if (response.ok) {
            articleForm.classList.add('hidden');
            await refreshPersonalSpace();
        } else {
            console.error('Erreur lors de la création de l\'article');
        }
    });

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
        await refreshPersonalSpace();
    });

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
        await refreshPersonalSpace();
    });

    personalSpaceContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('deleteBlog')) {
            const blogId = e.target.getAttribute('data-id');
            await fetch(`/blog/${blogId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            await refreshPersonalSpace();
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
            await refreshPersonalSpace();
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

    async function refreshPersonalSpace() {
        const response = await fetch('/personal-space', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
        });
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        personalSpaceContainer.innerHTML = doc.getElementById('personalSpaceContainer').innerHTML;
    }
});