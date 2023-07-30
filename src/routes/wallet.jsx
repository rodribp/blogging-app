import React, { useEffect, useState } from 'react';
import NavbarSample from '../components/navbar';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import '../index.css'
import { getWalletUrl } from '../api/component';
import { getUserPrivKey } from '../session';

const Wallet = () => {
  const [isBlurred, setIsBlurred] = useState(true);
  const [walletUrl, setWalletUrl] = useState('');

  useEffect(() => {
    const fetchWalletUrl = async () => {
      try {
        const userPrivKey = getUserPrivKey();
        const url = await getWalletUrl(userPrivKey);

        setWalletUrl(url);
      } catch (error) {
        console.error('Error fetching url: ' + error)
      }
    };

    fetchWalletUrl();
  }, []);

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
      <Row className={isBlurred ? 'blur-div' : ''}>
        <QRCodeSVG size='350' value={walletUrl} />
      </Row>
      <br />
      <br />
      <Row>
        <Col className='d-grid gap-2' xs={12} md={{span: 4, offset: 4}} lg={{span: 4, offset: 4}}>
          <Button onClick={() => setIsBlurred(!isBlurred)} variant='primary'size="lg">
            {isBlurred ? 'See my qrcode wallet': 'Hide my qrcode wallet'}
          </Button>
        </Col>
      </Row>
    </Container>
  </>
  )
};
export default Wallet;