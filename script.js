const bcrypt = require('bcrypt');
const Blog = require('./models/Blog');
const Article = require('./models/Article');
const User = require('./models/User');

async function createUser(email, password, twoFactorEnabled) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return User.create({
        email,
        password: hashedPassword,
        twoFactorEnabled,
        twoFactorSecret: null // Set the twoFactorSecret field to null
    });
}

async function createBlogWithArticles(user, title, description, isPublic) {
    const blog = await Blog.create({
        title,
        description,
        isPublic,
        userId: user.id
    });

    const articlePromises = [];
    for (let j = 0; j < 3; j++) {
        articlePromises.push(Article.create({
            title: `${title} - Article ${j + 1}`,
            content: `Content for article ${j + 1} of ${title}`,
            blogId: blog.id
        }));
    }
    await Promise.all(articlePromises);
}

async function generateDatas() {
    try {
        const user1 = await createUser('user1@example.com', 'password123', true);
        const user2 = await createUser('user2@example.com', 'password123', false);

        const blogPromises = [];
        blogPromises.push(createBlogWithArticles(user1, 'Tech Trends', 'Latest trends in technology', true));
        blogPromises.push(createBlogWithArticles(user1, 'Personal Diary', 'Daily personal thoughts and experiences', false));
        blogPromises.push(createBlogWithArticles(user2, 'Travel Adventures', 'Stories from around the world', true));
        blogPromises.push(createBlogWithArticles(user2, 'Cooking Secrets', 'Delicious recipes and cooking tips', false));

        await Promise.all(blogPromises);

        console.log('Blogs and articles have been successfully generated.');
    } catch (err) {
        console.error('Error generating blogs and articles:', err);
    }
}

// Call the function to generate blogs
generateDatas();