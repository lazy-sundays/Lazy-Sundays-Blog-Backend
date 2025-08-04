// Function to generate preview pathname based on content type and document
const getPreviewPathname = (uid, { locale, document }) => {
  const { slug } = document;

  // Handle different content types with their specific URL patterns
  switch (uid) {
    // Handle product pages
    case "api::author.author": {
      if (slug) {
        return `/authors/${slug}`; // Individual product page
      }
    }
    // Handle blog articles
    case "api::article.article": {
      if (slug) {
        return `/articles/${slug}`; // Individual article page
      }
    }
    default: {
      return null;
    }
  }
};

module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env("CLIENT_URL")],
      async handler(uid, { documentId, locale, status }) {
        try {
          const clientUrl = env("CLIENT_URL");
          const previewSecret = env("STRAPI_WEBHOOK_SECRET"); // Make sure to set this in your .env file

          if (!previewSecret) {
            // Handle missing secret key
            return {
              error: "Preview secret not provided",
              status: 500,
            };
          }

          // Fetch the complete document from Strapi
          const document = await strapi.documents(uid).findOne({ documentId });

          if (!document) {
            return {
              error: "Document not found",
              status: 404,
            };
          }

          // Generate the preview pathname based on content type and document
          const pathname = getPreviewPathname(uid, { locale, document });

          // Disable preview if the pathname is not found
          if (!pathname) {
            return null;
          }

          // Use Next.js draft mode passing it a secret key and the content-type status
          const urlSearchParams = new URLSearchParams({
            url: pathname,
            secret: previewSecret,
            status,
          });
          return `${clientUrl}/api/preview?${urlSearchParams.toString()}`;
        } catch (error) {
          // Handle any unexpected errors
          return {
            error: "An unexpected error occurred",
            status: 500,
          };
        }
      },
    },
  },
});
