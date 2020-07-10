module.exports = {
  siteMetadata: {
    title: `Ana Wall`,
    name: `Ana Wall`,
    siteUrl: `https://ana.mba`,
    description: `Personal site for Ana Wall.`,
    hero: {
      heading: `Ana Wall. Product Management, Brand Development, Customer Experience.`,
      maxWidth: 950,
    },
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/anaandwall`,
      },
      {
        name: `instagram`,
        url: `https://instagram.com/anawall`,
      },
      {
        name: `linkedin`,
        url: `https://www.linkedin.com/in/anawall/`,
      },
    ],
  },
  mapping: {
    'Mdx.frontmatter.author': `Mdx`,
  },
  plugins: [
    {
      resolve: "@narative/gatsby-theme-novela",
      options: {
        contentPosts: "content/posts",
        contentAuthors: "content/authors",
        basePath: "/",
        authorsPage: true,
        authorsPath: "/",
        sources: {
          local: true,
          contentful: false,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Novela by Narative`,
        short_name: `Novela`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
      },
    },
  ],
};
