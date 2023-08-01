import React, { useState } from "react";
import NavbarSample from "../components/navbar";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { createNewUser, getDataFromUsrId, getLnurlp  } from "../api/component";
import { userSchema, insertSanity } from "../api/sanity";
import { isStrong } from "../api/security";

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        walletName: '',
        password1: '',
        password2: ''
    })

    const [alert, setAlert] = useState(<></>);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({   
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let responsePassword = isStrong(formData.password1);
        if (formData.name == '' || formData.walletName == '' || formData.password1 == '' || formData.password2 == '') {
            setAlert(<Alert key='danger' variant='danger'>
            Please fill out all the fields
          </Alert>)
        } if (formData.password1 != formData.password2) {
            setAlert(<Alert key='danger' variant='danger'>
            Passwords don't match
          </Alert>)
        } else if (!responsePassword.isSafe) {
            setAlert(<Alert key='danger' variant='danger'>
                    {responsePassword.message}
                  </Alert>)
        } else {
            setAlert(<Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
            </Spinner>)
            let usr = await createNewUser(formData.name, formData.walletName);
            let data = await getDataFromUsrId(usr);
            let lnurlp = await getLnurlp(data.inkey);
            let schema = await userSchema(formData.name, formData.walletName, formData.password1, usr, lnurlp);
            let responseSanity = await insertSanity(schema);

            if (!usr) {
                setAlert(<Alert key='danger' variant='danger'>
                    There was an error while signing up on lnbits
                  </Alert>)
            } else if (!responseSanity) {
                setAlert(<Alert key='danger' variant='danger'>
                    There was an error while signing up on sanity
                  </Alert>)
            } else {
                setAlert(<Alert key='success' variant='success'>
                User created succesfully, now you can login using this private key: {usr}
            </Alert>)
            }
        }
    }

    return (<>
                <NavbarSample />
                <Container>
                    <br />
                    <div className="text-center">
                        <h2>Want to join our community?</h2>
                    </div>
                    <br />
                    <Row className="justify-content-md-center">
                        <Col md={6}>
                            {alert}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formName" className="mb-3">
                                    <Form.Label>Enter your name</Form.Label>
                                    <Form.Control name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Satoshi Nakamoto" />
                                </Form.Group>
                                <Form.Group controlId="formWallet" className="mb-3">
                                    <Form.Label>Wallet name</Form.Label>
                                    <Form.Control name="walletName" type="text" value={formData.walletName} onChange={handleChange} placeholder="satoshi's wallet" />
                                </Form.Group>
                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control name="password1" type="password" value={formData.password1} onChange={handleChange} placeholder="Some password" />
                                </Form.Group>
                                <Form.Group controlId="formPassword" className="mb-3">
                                    <Form.Label>Confirmation</Form.Label>
                                    <Form.Control name="password2" type="password" value={formData.password2} onChange={handleChange} placeholder="Confirm password" />
                                </Form.Group>
                                <br />
                                <Col className="d-grid gap-2">
                                    <Button variant="primary" type="submit">
                                        Create account
                                    </Button>
                                </Col>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </>);
}

export default SignUp;