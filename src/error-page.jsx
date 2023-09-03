
import { useRouteError } from "react-router-dom";
import NavbarSample from "./components/navbar";
import { Container, Row, Col, Alert } from "react-bootstrap";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <NavbarSample />
      <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6}>
          <Alert variant="danger">
            <h1 className="text-center">Oops! Something went wrong. {error.status + ' ' + error.statusText}</h1>
            <p className="text-center">We're sorry, but it seems there was an error.</p>
            <p className="text-center">
              You can <a href="/">go back to the homepage</a> or try again later.
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
    </>
    
  );
}