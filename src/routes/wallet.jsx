import React, { useEffect, useState } from 'react';
import NavbarSample from '../components/navbar';
import { Container, Row, Col, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import '../index.css'
import { getWalletUrl } from '../api/component';
import { getUserPrivKey } from '../session';
import { verifyPassword } from '../api/security';
import { getUserIdByPrivKey } from '../api/sanity';

const Wallet = () => {
  const [isBlurred, setIsBlurred] = useState(true);
  const [walletUrl, setWalletUrl] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(<></>);
  const [button, setButton] = useState(<Button onClick={() => setModalShow(true)} variant='primary'size="lg">
  See my qrcode wallet
</Button>);

  const userPrivKey = getUserPrivKey();

  useEffect(() => {
    const fetchWalletUrl = async () => {
      try {
        const url = await getWalletUrl(userPrivKey);

        setWalletUrl(url);
      } catch (error) {
        console.error('Error fetching url: ' + error)
      }
    };

    fetchWalletUrl();
  }, []);

  const showModal = () => {
    setAlert(<></>);
    setPassword('');
    setModalShow(true);
  }

  const hideCode = () => {
    setIsBlurred(true);
    setButton(<Button onClick={() => showModal()} variant='primary'size="lg">
    See my qrcode wallet
  </Button>);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAlert(<Spinner animation='border' role='status'>
      <span className='visually-hidden'>Loading...</span>
    </Spinner>)

    let response = await getUserIdByPrivKey(userPrivKey);
    let verify = await verifyPassword(password, response.hash);

    if (verify) {
      setIsBlurred(false);
      setModalShow(false);
      setButton(<Button onClick={() => hideCode()} variant='primary'size="lg">
                  Hide my qrcode
                </Button>);
    } else {
      setAlert(<Alert key='danger' variant='danger'>
        Incorrect password
      </Alert>)
    }
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  }

  return (
  <>
    <NavbarSample />
    <Container>
      <br />
      <Row className='text-center'>
        <h3>You can scan the following QR code to access your wallet, please DO NOT share it with anyone</h3>
      </Row>
      <br />
      <br />
      <Row className={isBlurred ? 'blur-div text-center' : 'text-center'}>
        <QRCodeSVG size='350' value={walletUrl} />
        <p>private key: {userPrivKey}</p>
      </Row>
      <br />
      <br />
      <Row>
        <Col className='d-grid gap-2' xs={12} md={{span: 4, offset: 4}} lg={{span: 4, offset: 4}}>
          {button}
        </Col>
      </Row>
    </Container>
    <Modal
        size="lg"
        show={modalShow}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-sm">
            Confirm identity
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
                {alert}
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control onChange={handleChange} value={password} type='password' name="password" placeholder='Your password'></Form.Control>
                </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModalShow(false)} variant='danger'>Cancel</Button>
            <Button variant='primary' type='submit'>Confirm</Button>
          </Modal.Footer>
        </Form>
    </Modal>
  </>
  )
};
export default Wallet;