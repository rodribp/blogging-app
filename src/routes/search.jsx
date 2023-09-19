import React from "react";
import NavbarSample from "../components/navbar";
import { Container, Row, Col, Tabs, Tab, Card, ListGroup, Image, Spinner } from 'react-bootstrap';
import { lookForUserOrTitleMatch } from "../api/sanity";
import { QRCodeSVG } from "qrcode.react";
import { getUserId } from "../session";
import oops from '../img/oops.png';

class SearchPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isMobile: window.innerWidth <= 768, // Define your mobile breakpoint
        isLoading: 1,
        accounts: [],
        articles: [],
        id: getUserId()
      };
    }
  
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        const params = new URLSearchParams(window.location.search);
        const search = params.get("u");

        this.handleSearch(search);
    }
  
    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }   
  
    handleResize = () => {
      this.setState({
        isMobile: window.innerWidth <= 768, // Update the isMobile state on resize
      });
    };
    
    handleSearch = async (search) => {
        const match = await lookForUserOrTitleMatch(search, this.state.id);

        if (!match) {
            return;
        }

        this.setState({
            accounts: match.filter(item => item._type === 'users'),
            articles: match.filter(item => item._type === 'articles'),
            isLoading: 0
        })
    }

    render() {
      const { isMobile, accounts, articles, isLoading } = this.state;
      return (
        <div >
            <NavbarSample />
            {isLoading ? (<div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Ensure the spinner covers the entire viewport height
    }}><Spinner animation='border' role='status'>
      <span className='visually-hidden'>Loading...</span>
    </Spinner></div>) : isMobile ? (
                // Render mobile layout with tabs
                <Container>
                    <br />
                    <Tabs defaultActiveKey="blogs" id="search-tabs">
                        <Tab eventKey="blogs" title="Blogs">
                            {/* Mobile account content */}
                            <Card>
                                {articles.length != 0 ? articles.map(article => (
                                            <ListGroup.Item>
                                            <Row>
                                                <Col xs="12" sm="10" lg="9">
                                                    <Card.Title>{article.title}</Card.Title>
                                                    <Card.Subtitle className='mb-2 text-muted'>from: {article.author.username} | wallet: {article.author.wallet} {article.edited == 1 ? '| edited' : ''}</Card.Subtitle>
                                                    <Card.Text>{article.content}</Card.Text>
                                                </Col>
                                                <Col xs="12" sm="2" lg="3" className="text-center">
                                                    <h5>Receiving some tips!</h5>
                                                    <QRCodeSVG value={article.author.lnurlp} />
                                                </Col>
                                            </Row>
                                            </ListGroup.Item>
                                )) : (<><h3>No articles found</h3>
                                <Image src={oops} height={200} width={400}/>
                                </>)}
                            </Card>
                        </Tab>
                        <Tab eventKey="accounts" title="Accounts">
                            {/* Mobile blog content */}
                            {/* <Card> */}
                                <ListGroup className="list-group-flush">
                                {accounts.length != 0 ? accounts.map(user => (<>
                                    <ListGroup.Item action href={'/user?u=' + user._id}>
                                        <h6>{user.username} | {user.wallet}</h6>
                                        <p style={{
                                                    maxHeight: '3em', // Adjust the maximum height as needed
                                                    whiteSpace: 'normal', // Allow text to wrap
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                            {/* Biography here */}
                                            {user.bio ? user.bio : 'No biography yet!'}
                                        </p>
                                    </ListGroup.Item>
                                </>)) : (<><h3>No accounts found</h3>
                                <Image src={oops} height={200} width={400}/>
                                </>)}
                                </ListGroup>
                            {/* </Card> */}
                        </Tab>
                    </Tabs>
                </Container>
            ) : (
                // Render desktop layout with columns
                <Container>
                    <br />
                    <Row>
                        <Col md={4}>
                            <Card>
                                {/* Desktop account content */}
                                <Card.Header as="h5">
                                    Accounts
                                </Card.Header>
                                <ListGroup className="list-group-flush">
                                {accounts.length != 0 ? accounts.map(user => (<>
                                    <ListGroup.Item action href={'/user?u=' + user._id}>
                                        <h6>{user.username} | {user.wallet}</h6>
                                        <p style={{
                                                    maxHeight: '3em', // Adjust the maximum height as needed
                                                    whiteSpace: 'normal', // Allow text to wrap
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                            {/* Biography here */}
                                            {user.bio ? user.bio : 'No biography yet!'}
                                        </p>
                                    </ListGroup.Item>
                                </>)) : (<><h3>No accounts found</h3>
                                <Image src={oops} height={100} width={200}/>
                                </>)}
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col md={8}>
                            <Card>
                                {/* Desktop blog content */}
                                <Card.Header as="h5">
                                    Blogs
                                </Card.Header>
                                <ListGroup className="list-group-flush">
                                {articles.length != 0 ? articles.map(article => (
                                            <ListGroup.Item>
                                            <Row>
                                                <Col xs="12" sm="10" lg="9">
                                                    <Card.Title>{article.title}</Card.Title>
                                                    <Card.Subtitle className='mb-2 text-muted'>from: {article.author.username} | wallet: {article.author.wallet} {article.edited == 1 ? '| edited' : ''}</Card.Subtitle>
                                                    <Card.Text>{article.content}</Card.Text>
                                                </Col>
                                                <Col xs="12" sm="2" lg="3" className="text-center">
                                                    <h5>Receiving some tips!</h5>
                                                    <QRCodeSVG value={article.author.lnurlp} />
                                                </Col>
                                            </Row>
                                            </ListGroup.Item>
                                )) : (<><h3>No articles found</h3>
                                <Image src={oops} height={200} width={400}/>
                                </>)}
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )}
            </div>
      );
    }
  }
  
  export default SearchPage;
  