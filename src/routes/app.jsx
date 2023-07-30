import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import NavbarSample from '../components/navbar';
import {QRCodeSVG} from 'qrcode.react';
import { getAllArticles } from '../api/sanity';
import { getDataFromUsrId, getLnurlp } from '../api/component';

const App = () => {
  
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      let response = await getAllArticles();

      setArticles(response);
    }

    fetchArticles();
  }, [])

  return (
    <>
      <NavbarSample />
      <Container>
        
        {articles.map((article) => (
          <>
            <br />
            <Row key={article._id}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col xs="12" sm="10" lg="9">
                      <Card.Title>{article.title}</Card.Title>
                      <Card.Subtitle className='mb-2 text-muted'>from: {article.author.username} | wallet: {article.author.wallet}</Card.Subtitle>
                      <Card.Text>{article.content}</Card.Text>
                    </Col>
                    <Col xs="12" sm="2" lg="3" className="text-center">
                      <h5>Receiving some tips!</h5>
                      <QRCodeSVG value={article.author.lnurlp} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Row>
          </>
        ))}
      </Container>
    </>
  );
};
export default App;