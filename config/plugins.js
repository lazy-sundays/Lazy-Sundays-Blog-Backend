module.exports = {
  documentation: {
    enabled: true,
    config: {
      info: {
        version: "0.1.0",
        title: "The Lazy Sundays Blog - API",
        description:
          "API documentation for the The Lazy Sundays Blog, a personal blog for games, movies. tv, music, etc.",
        termsOfService: null,
        contact: {
          name: "Lazy Sundays Staff",
          email: "contact@alazysunday.com",
          url: "https://alazysunday.com",
        },
      },
      "x-strapi-config": {
        // Do not generate for plugins
        plugins: [],
        mutateDocumentation: (generatedDocumentationDraft) => {
          generatedDocumentationDraft.paths[
            "/random-article" // must be an existing path
          ].get.responses["200"] = {
            description: "OK. Returns a randomly selected article.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    documentId: {
                      type: "string",
                      example: "vwixeniz8z954lh3jpcbothi",
                    },
                    slug: {
                      type: "string",
                      example: "test",
                    },
                  },
                },
              },
            },
          };
          generatedDocumentationDraft.paths[
            "/authors/{slug}/articles/count"
          ].get.responses["200"] = {
            description:
              "OK. Returns the number of articles written by a specific author",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    count: {
                      type: "integer",
                      example: "1",
                    },
                  },
                },
              },
            },
          };
        },
      },
    },
  },
};
