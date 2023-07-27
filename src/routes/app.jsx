import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import NavbarSample from '../components/navbar';
import {QRCodeSVG} from 'qrcode.react';

const App = () => {
  
  

  return (
    <>
      <NavbarSample />
      <Container>
        <br />
        <Row>
          <Card >
            <Card.Body>
              <Row>
                <Col xs="12" sm="10" lg="9">
                  <Card.Title>Card sample</Card.Title>
                  <Card.Text>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis necessitatibus quibusdam consectetur saepe odio sapiente, odit dolorum. Reprehenderit soluta molestiae quidem aspernatur tenetur, doloremque voluptatibus iure quas pariatur doloribus ipsam!
                  </Card.Text>
                </Col>
                <Col xs="12" sm="2" lg="3" className='text-center'>
                  <h5>Receiving some tips!</h5>
                  <QRCodeSVG value='https://www.google.com' />
                </Col>
              </Row>
              
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </>
  );
};
export default App;