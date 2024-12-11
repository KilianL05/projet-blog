const bcrypt = require('bcrypt');
const Blog = require('./models/Blog');
const Article = require('./models/Article');
const User = require('./models/User');

async function generateBlogsAndArticles() {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create a user with the hashed password
        const user = await User.create({
            email: 'user@example.com',
            password: hashedPassword
        });

        // Array of promises to create blogs and articles
        const blogPromises = [];

        for (let i = 0; i < 3; i++) {
            // Create a public blog
            const publicBlogPromise = Blog.create({
                title: `Public Blog ${i + 1}`,
                description: `Description for public blog ${i + 1}`,
                isPublic: true,
                userId: user.id // Associate the blog with the user
            }).then(publicBlog => {
                // Create 3 articles for each public blog
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

            // Add the promise to the list
            blogPromises.push(publicBlogPromise);

            // Create a private blog
            const privateBlogPromise = Blog.create({
                title: `Private Blog ${i + 1}`,
                description: `Description for private blog ${i + 1}`,
                isPublic: false,
                userId: user.id // Associate the blog with the user
            }).then(privateBlog => {
                // Create 3 articles for each private blog
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

            // Add the promise to the list
            blogPromises.push(privateBlogPromise);
        }

        // Execute all promises to create blogs and articles
        await Promise.all(blogPromises);

        console.log('Blogs and articles have been successfully generated.');
    } catch (err) {
        console.error('Error generating blogs and articles:', err);
    }
}

// Call the function to generate blogs
generateBlogsAndArticles();