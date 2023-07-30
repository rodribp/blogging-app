import React, { useState } from "react";
import NavbarSample from "../components/navbar";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { createNewUser, getDataFromUsrId, getLnurlp  } from "../api/component";
import { userSchema, insertSanity } from "../api/sanity";

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        walletName: ''
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
        setAlert(<Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>)
        let usr = await createNewUser(formData.name, formData.walletName);
        let data = await getDataFromUsrId(usr);
        let lnurlp = await getLnurlp(data.inkey);
        let responseSanity = await insertSanity(userSchema(formData.name, formData.walletName, usr, lnurlp));

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