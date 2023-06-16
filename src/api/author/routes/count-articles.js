module.exports = {
    routes: [
        { // Path defined with a URL parameter
            method: 'GET',
            path: '/authors/:id/articles/count',
            handler: 'author.countArticles',
            config: {
                auth: false,
            },
        },
    ]
}