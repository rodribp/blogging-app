import React from "react";
import NavbarSample from "../components/navbar";
import { Container, Form, Row, Col, Button } from "react-bootstrap";

const Login = () => {
    return (
        <>
            <NavbarSample />
            <Container>
                <br />
                <div className="text-center">
                    <h2>Welcome to OrangeBlog!</h2>
                </div>
                <br />
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Form>  
                            <Form.Group className="mb-3">
                                <Form.Label>Enter your private key</Form.Label>
                                <Form.Control name="private-key" type="text" placeholder="XXXXXXXXXXXXXXXXXXXXX" />
                            </Form.Group>
                            <br />
                            <Col className="d-grid gap-2">
                                <Button variant="primary" type="submit">
                                    Log in
                                </Button>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>
            
        </>
    )
}

export default Login;