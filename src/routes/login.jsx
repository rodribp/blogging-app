import React, { useState } from "react";
import NavbarSample from "../components/navbar";
import { Container, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { getUserIdByPrivKey } from "../api/sanity";
import { loginByUsrId } from "../api/component";
import { login } from "../session";
import { verifyPassword } from "../api/security";

const Login = () => {

    const [formData, setFormData] = useState({
        privKey: '',
        password: ''
    });
    const [alert, setAlert] = useState(<></>)

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setAlert(<Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
        </Spinner>);

        let responseSanity = await getUserIdByPrivKey(formData.privKey);
        let responseLnBits = await loginByUsrId(formData.privKey);
        if (!responseSanity) {
            setAlert(<Alert key='danger' variant="danger">
                Private key not found
            </Alert>)
        } else if (!responseLnBits) {
            setAlert(<Alert key='danger' variant="danger">
                Wallet not found
            </Alert>)
        } else {
            let verify = await verifyPassword(formData.password, responseSanity.hash);
            if (!verify) {
                setAlert(<Alert key='danger' variant="danger">
                    Incorrect password
                </Alert>)
            } else {
                login(responseSanity.id, formData.privKey);
                window.location.href = '/';
            }
        }
    }

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
                        <div className="text-center">
                            {alert}
                        </div>
                        <Form onSubmit={handleSubmit}>  
                            <Form.Group className="mb-3">
                                <Form.Label>Enter your private key</Form.Label>
                                <Form.Control onChange={handleChange} value={formData.privKey} name="privKey" type="text" placeholder="XXXXXXXXXXXXXXXXXXXXX" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control onChange={handleChange} value={formData.password} name="password" type="password" placeholder="your password account" />
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