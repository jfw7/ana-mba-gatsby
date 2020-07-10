const createPaginatedPages = require('gatsby-paginate');
const path = require('path');
const crypto = require(`crypto`);
const _slugify = require('slugify');

function buildPaginatedPath(index, basePath) {
  if (basePath === '/') {
    return index > 1 ? `${basePath}page/${index}` : basePath;
  }
  return index > 1 ? `${basePath}/page/${index}` : basePath;
}

function slugify(string, base) {
  const slug = string
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return `${base}/${slug}`.replace(/\/\/+/g, '/');
}

const templatesDirectory = path.resolve(__dirname, 'src/@narative/gatsby-theme-novela/templates');
const templates = {
  articles: path.resolve(templatesDirectory, 'articles.template.tsx'),
  article: path.resolve(templatesDirectory, 'article.template.tsx'),
  author: path.resolve(templatesDirectory, 'author.template.tsx'),
};

const GatsbyFluid_withWebp = `
  base64
  aspectRatio
  src
  srcSet
  srcWebp
  srcSetWebp
  sizes
`;

exports.createPages = async ({ actions: { createPage }, graphql }, themeOptions) => {
  const {
  authorsPath,
  pageLength = 6,
} = themeOptions;

  const query = await graphql(`{
    authors: allAuthor {
      edges {
        node {
          authorsPage
          bio
          body
          id
          name
          featured
          social {
            url
          }
          slug
          avatar {
            small: childImageSharp {
              fluid(maxWidth: 50, quality: 100) {
                ${GatsbyFluid_withWebp}
              }
            }
            medium: childImageSharp {
              fluid(maxWidth: 100, quality: 100) {
                ${GatsbyFluid_withWebp}
              }
            }
            large: childImageSharp {
              fluid(maxWidth: 328, quality: 100) {
                ${GatsbyFluid_withWebp}
              }
            }
          }
        }
      }
    }
  }`);

  function normalizeAvatar(author) {
    let avatar = {
      small: {},
      medium: {},
      large: {},
    };

    if (author.avatar) {
      avatar = {
        small: author.avatar.small.fluid,
        medium: author.avatar.medium.fluid,
        large: author.avatar.large.fluid,
      };
    } else {
      console.log('\u001B[33m', `Missing avatar for "${author.name}"`);
    }

    return avatar;
  }

  const authors = query.data.authors.edges.map(({ node: author }) => {
    return {
      ...author,
      avatar: normalizeAvatar(author),
    };
  });

  authors.forEach(author => {
    const articlesTheAuthorHasWritten = [];
    const path = author.slug;

    const page = {
      path,
      component: templates.author,
      context: {
        author,
        basePath: path,
        slug: author.slug,
        id: author.id,
        name: author.name
      },
    };

    createPage(page);
  });
};

const mdxResolverPassthrough = fieldName => async (
  source,
  arguments_,
  context,
  info,
) => {
  const type = info.schema.getType(`Mdx`);
  const mdxNode = context.nodeModel.getNodeById({
    id: source.parent,
  });
  const resolver = type.getFields()[fieldName].resolve;
  const result = await resolver(mdxNode, arguments_, context, {
    fieldName,
  });
  return result;
};

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    Author: {
      body: {
        resolve: mdxResolverPassthrough(`body`),
      },
    },
  });
};





exports.sourceNodes = ({ actions }) => {
  actions.createTypes(`
    type Social {
      url: String!
    }
    type Author implements Node {
      authorsPage: Boolean!
      bio: String!
      name: String!
      featured: Boolean!
      social: [Social!]
      id: ID!
      slug: String!
      title: String!
      date: Date! @dateformat
      author: String!
      body: String!
      avatar: File @fileByRelativePath
    }
  `);
};



exports.onCreateNode = ({ node, actions, getNode, createNodeId }, themeOptions) => {
  function generateSlug(...arguments_) {
    return `/${arguments_.join('/')}`.replace(/\/\/+/g, '/');
  }
  const { createNode, createParentChildLink } = actions;
  const authorsPath = themeOptions.contentAuthors || 'content/authors';
  const basePath = themeOptions.basePath || '/';
  const fileNode = getNode(node.parent);
  const source = fileNode && fileNode.sourceInstanceName;

  if (node.internal.type === `Mdx` && source === authorsPath) {
    const slug = node.frontmatter.slug
      ? `/${node.frontmatter.slug}`
      : slugify(node.id, {
          lower: true,
        });

    const fieldData = {
      name: node.frontmatter.name,
      bio: node.frontmatter.bio,
      avatar: node.frontmatter.avatar,
      social: node.frontmatter.social,
      featured: node.frontmatter.featured,
      authorsPage: true,
      slug: generateSlug(basePath, slug),
    };

    createNode({
      ...fieldData,
      // Required fields.
      id: createNodeId(`${node.id} >>> Author`),
      parent: node.id,
      children: [],
      internal: {
        type: `Author`,
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(fieldData))
          .digest(`hex`),
        content: JSON.stringify(fieldData),
        description: `Author`,
      },
    });

    createParentChildLink({ parent: fileNode, child: node });

    return;
  }
}
