import React from 'react';
import Headings from '@components/Headings';
import styled from '@emotion/styled';

const Heading = styled(Headings.h2)``;

/**
 * Paste in your SVG logo and return it from this component.
 * Make sure you have a height set for your logo.
 * It is recommended to keep the height within 25-35px.
 * Logo comes with a property value called `fill`. `fill` is useful
 * when you want to change your logo depending on the theme you are on.
 */
export default ({ fill }) => (
  <Heading>
    Home
  </Heading>
);
