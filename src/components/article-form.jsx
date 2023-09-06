import {Container, Row, Col, Form, Button, Alert, Spinner} from 'react-bootstrap';
import { useState } from 'react';
import { articleSchema, insertSanity } from '../api/sanity';
import { getUserId } from '../session';

function CreateArticleForm() {
  const usrId = getUserId();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  const [alert, setAlert] = useState(<></>);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAlert(<Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>)

    if (formData.title.length < 10) {
      setAlert(<Alert key='info' variant='info'>
        Title must be 10 characters long or more
      </Alert>)
      return;
    }

    if (formData.content.length < 30) {
      setAlert(<Alert key='info' variant='info'>
        Content must be 30 characters long or more
      </Alert>)
      return;
    }

    let scheme = articleSchema(formData.title, formData.content, usrId);
    let response = await insertSanity(scheme);

    if (!scheme) {
      setAlert(<Alert key='danger' variant='danger'>
        There was an error while getting the usr ID
      </Alert>)
    } else if (!response) {
      setAlert(<Alert key='danger' variant='danger'>
        There was an error while uploading the article
      </Alert>)
    } else {
      setFormData({title: '', content: ''})
      setAlert(<Alert key='success' variant='success'>
        Article uploaded succesfully
      </Alert>)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          {alert}
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control name='title' value={formData.title} onChange={handleChange} type="text" placeholder="Title of the article" />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Content</Form.Label>
            <Form.Control name='content' value={formData.content} onChange={handleChange} as="textarea" rows={3} placeholder='Whatever you want to talk about' />
          </Form.Group>
        </Row>
        <Row className='xs-grid'>
          <Col xs={{span: 2, offset: 4}} md={{span: 1, offset: 9}}>
            <Button variant='danger' href='/'>
              Cancel
            </Button>
          </Col>
          <Col xs={{span: 5, offset: 1}} md={{span: 2, offset: 0}}>
            <Button variant='primary' type='submit'>
              Submit article
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}

export default CreateArticleForm;