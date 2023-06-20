module.exports = {
    documentation: {
        enabled: true,
        config: {
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
        },
    },
};