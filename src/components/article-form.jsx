import {Container, Row, Col, Form, Button} from 'react-bootstrap';

function CreateArticleForm() {
  return (
    <Form>
      <Container>
        <Row>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Title of the article" />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder='Whatever you want to talk about' />
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