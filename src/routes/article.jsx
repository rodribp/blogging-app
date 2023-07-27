import React from 'react';
import NavbarSample from '../components/navbar';
import { Container } from 'react-bootstrap';
import CreateArticleForm from '../components/article-form';
const Article = () => (
  <>
    <NavbarSample />
    <Container>
      <br />
      <CreateArticleForm />
    </Container>
  </>
);
export default Article;