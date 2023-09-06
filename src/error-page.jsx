
import { useRouteError } from "react-router-dom";
import NavbarSample from "./components/navbar";
import { Container, Row, Col, Image } from "react-bootstrap";
import oops from './img/oops.png';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <NavbarSample />
      <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={4}>
          <Image src={oops} height={208}/>
        </Col>
        <Col xs={12} md={8}>
          <p className="error-heading">Oops! Something went wrong</p>
          <Container>
            <Row>
              <Col xs={12} md={6}>
                <p className="status">{error.status}</p>
                <p className="status-text">{error.statusText}</p>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
    </>
    
  );
}