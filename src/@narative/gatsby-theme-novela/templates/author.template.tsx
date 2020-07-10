import React, { useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";

import Section from "@components/Section";
import SEO from "@components/SEO";
import Layout from "@components/Layout";
import MDXRenderer from "@components/MDX";

import AuthorHero from "@narative/gatsby-theme-novela/src/sections/author/Author.Hero";

import mediaqueries from "@styles/media";

import { Template } from "@types";

const ArticleBody = styled.article`
  position: relative;
  padding: 35px 0 35px;
  padding-left: 68px;
  transition: background 0.2s linear;

  ${mediaqueries.desktop`
    padding-left: 53px;
  `}

  ${mediaqueries.tablet`
    padding: 70px 0 80px;
  `}

  ${mediaqueries.phablet`
    padding: 60px 0;
  `}
`;

const AuthorPage: Template = ({ location, pageContext }) => {
  const contentSectionRef = useRef<HTMLElement>(null);
  const author = pageContext.author;
  return (
    <Layout>
      <SEO
        pathname={location.pathname}
        title={author.name}
        description={author.bio}
      />
      <Section narrow>
        <AuthorHero author={author} />
      </Section>
      <ArticleBody ref={contentSectionRef}>
        <MDXRenderer content={author.body} />
      </ArticleBody>
      <AuthorsGradient />
    </Layout>
  );
}

export default AuthorPage;

const AuthorsGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 590px;
  z-index: 0;
  pointer-events: none;
  background: ${p => p.theme.colors.gradient};
  transition: ${p => p.theme.colorModeTransition};
`;
