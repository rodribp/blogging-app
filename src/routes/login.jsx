import React, { useState } from "react";
import NavbarSample from "../components/navbar";
import { Container, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { getUserIdByPrivKey } from "../api/sanity";
import { loginByUsrId } from "../api/component";
import { login } from "../session";

const Login = () => {

    const [privKey, setPrivKey] = useState('');
    const [spinner, setSpinner] = useState(<></>)

    const handleChange = (e) => {
        const value = e.target.value;
        setPrivKey(value);
    }

    const handleSubmit = async (e) => {
        setSpinner(<Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>);
        e.preventDefault();

        let res1 = await loginByUsrId(privKey);
        let usrId = await getUserIdByPrivKey(privKey);


        if (!res1) {
            console.log('there was an error while login on lnbits');
        } else if (!usrId) {
            console.log('there was an error getting user id from sanity');
        } else {
            login(usrId, privKey);
            window.location.href = '/';
        }

        
    }

    return (
        <>
            <NavbarSample />
            <Container>
                <br />
                <div className="text-center">
                    <h2>Welcome to OrangeBlog!</h2>
                    {spinner}
                </div>
                <br />
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Form onSubmit={handleSubmit}>  
                            <Form.Group className="mb-3">
                                <Form.Label>Enter your private key</Form.Label>
                                <Form.Control onChange={handleChange} value={privKey} name="privateKey" type="text" placeholder="XXXXXXXXXXXXXXXXXXXXX" />
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