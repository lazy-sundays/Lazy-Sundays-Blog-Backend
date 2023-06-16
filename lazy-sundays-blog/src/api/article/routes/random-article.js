module.exports = {
    routes: [
        { // Path defined with a URL parameter
            method: 'GET',
            path: '/random-article',
            handler: 'article.randomArticle',
            config: {
                auth: false,
            },
        },
    ]
}