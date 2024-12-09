// Assurez-vous d'avoir mis en place Sequelize et d'importer vos modèles.
const Blog = require('./models/Blog');
const Article = require('./models/Article');

async function generateBlogsAndArticles() {
    try {
        // Array de promesses pour créer blogs et articles
        const blogPromises = [];

        for (let i = 0; i < 3; i++) {
            // Créez un blog public
            const publicBlogPromise = Blog.create({
                title: `Public Blog ${i + 1}`,
                description: `Description for public blog ${i + 1}`,
                isPublic: true
            }).then(publicBlog => {
                // Créez 3 articles pour chaque blog public
                const articlePromises = [];
                for (let j = 0; j < 3; j++) {
                    articlePromises.push(Article.create({
                        title: `Article ${j + 1} for Public Blog ${i + 1}`,
                        content: `Content for article ${j + 1} of public blog ${i + 1}`,
                        blogId: publicBlog.id
                    }));
                }
                return Promise.all(articlePromises);
            });

            // Ajoutez la promesse à la liste
            blogPromises.push(publicBlogPromise);

            // Créez un blog privé
            const privateBlogPromise = Blog.create({
                title: `Private Blog ${i + 1}`,
                description: `Description for private blog ${i + 1}`,
                isPublic: false
            }).then(privateBlog => {
                // Créez 3 articles pour chaque blog privé
                const articlePromises = [];
                for (let j = 0; j < 3; j++) {
                    articlePromises.push(Article.create({
                        title: `Article ${j + 1} for Private Blog ${i + 1}`,
                        content: `Content for article ${j + 1} of private blog ${i + 1}`,
                        blogId: privateBlog.id
                    }));
                }
                return Promise.all(articlePromises);
            });

            // Ajoutez la promesse à la liste
            blogPromises.push(privateBlogPromise);
        }

        // Exécuter toutes les promesses pour créer les blogs et articles
        await Promise.all(blogPromises);

        console.log('Les blogs et les articles ont été générés avec succès.');
    } catch (err) {
        console.error('Erreur lors de la génération des blogs et articles :', err);
    }
}

// Appelez la fonction pour générer les blogs
generateBlogsAndArticles();