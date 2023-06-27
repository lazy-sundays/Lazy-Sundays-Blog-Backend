module.exports = {
    documentation: {
        enabled: true,
        config: {
            openapi: '3.0.0',
            info: {
                version: '1.0.0',
                title: 'DOCUMENTATION',
                description: '',
                termsOfService: 'YOUR_TERMS_OF_SERVICE_URL',
                contact: {
                name: 'TEAM',
                email: 'contact-email@something.io',
                url: 'mywebsite.io'
                },
                license: {
                name: 'Apache 2.0',
                url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
                },
            },
            "x-strapi-config": {
                // Do not generate for plugins
                plugins: [],
                mutateDocumentation: (generatedDocumentationDraft) => {
                    generatedDocumentationDraft.paths[
                        "/random-article" // must be an existing path
                    ].get.responses["200"]={
                        "description": "OK. Returns the ID of a randomly selected article.",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "integer",
                                            "example": "1"
                                        }
                                    }
                                }
                            }   
                        }
                    };
                    generatedDocumentationDraft.paths[
                        "/authors/{id}/articles/count"
                    ].get.responses["200"]={
                        "description": "OK. Returns the number of articles written by a specific author",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "count": {
                                            "type": "integer",
                                            "example": "1"
                                        }
                                    }
                                }
                            }   
                        }  
                    };
                        
                },
            },
            security: [ { bearerAuth: [] } ],
            servers: [{ url: 'http://localhost:1337/api', description: 'Development server' }],
            externalDocs: {
                description: 'Find out more',
                url: 'https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html'
            },
        },
    },
};