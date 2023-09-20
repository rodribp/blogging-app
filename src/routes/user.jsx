import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, OverlayTrigger, Tooltip, Alert, Spinner } from "react-bootstrap";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import NavbarSample from "../components/navbar";
import { getUserInfo, getUserArticles, followSchema, insertSanity, checkIsFollowed, deleteFollow  } from "../api/sanity";
import { QRCodeSVG } from "qrcode.react";
import { getUserId } from "../session";


const UserPage = () => {
    const params = new URLSearchParams(window.location.search);
    const _id = params.get("u");
    const id = getUserId();

    const [userData, setUserData] = useState({
        username: '',
        wallet_name: '',
        lnurlp: '',
        bio: ''
    });
    const [articles, setArticles] = useState([]);
    const [show, setShow] = useState(false);
    const [isFollowed, setIsFollowed] = useState('');
    const [indicator, setIndicator] = useState(<></>);


    const fillOutInfo = async () => {
        const response = await getUserInfo(_id);

        setUserData({
            username: response[0].username,
            wallet_name: response[0].wallet,
            lnurlp: response[0].lnurlp,
            bio: response[0].bio
        })
    }

    const fetchArticles = async () => {
        const response = await getUserArticles(_id);

        setArticles(response);
    }

    const checkFollow = async () => {
        const response = await checkIsFollowed(id, _id);

        if (response.length == 0) {
            console.log('Not followed');
            return;
        }


        setIsFollowed(response[0]._id)
        setIndicator(<AiOutlineCheck />);
    }

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(userData.lnurlp);
        setShow(true);
    }

    const handleFollowUser = async () => {
        setIndicator(<Spinner animation='border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>);
        const scheme = followSchema(id, _id);
        const response = await insertSanity(scheme);

        if (!response) {
            console.log('Error following user ' + response);
            return;
        }

        setIsFollowed(response._id);
        setIndicator(<AiOutlineCheck />);
    }

    const handleUnfollowUser = async () => {
        setIndicator(<Spinner animation='border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>);
        const response = await deleteFollow(isFollowed);

        if (!response) {
            console.log('Error unfollowing user');
            return;
        }

        setIsFollowed('');
        setIndicator(<></>)
    }

    useEffect(() => {
        fillOutInfo();
        fetchArticles();
        checkFollow();
    }, [])

    return (<>
        <NavbarSample />
        <Container>
            <br />
            <Row>
                {/* Profile's info overlay */}
                <Col lg={{span: 4}}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{userData.username} | {userData.wallet_name}</Card.Title>
                            <Card.Text>{userData.bio ? userData.bio : 'No biography set yet'}</Card.Text>
                            <div className="d-flex justify-content-center align-items-center">
                                <QRCodeSVG size={150} value={userData.lnurlp} />
                            </div>
                            <br />
                            <Form>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    value={userData.lnurlp}
                                    disabled
                                />
                                <OverlayTrigger
                                key={'top'}
                                placement={'top'}
                                overlay={
                                    <Tooltip>
                                        Copy to clipboard!
                                    </Tooltip>
                                }
                                >
                                    <Button variant="primary" id="button-addon2" onClick={handleCopyToClipboard}>
                                        <AiOutlineCopy />
                                    </Button>
                                </OverlayTrigger>
                            </InputGroup>
                            <Alert show={show} variant="success" key="success" onClose={() => setShow(false)} dismissible>
                                Lnurl copied to clipboard!
                            </Alert>
                            </Form>
                        </Card.Body>
                        {id ? !isFollowed ? (<Card.Footer align="end">
                            {indicator}
                            ㅤ
                            <Button onClick={handleFollowUser}>Follow</Button>
                        </Card.Footer>) : (<Card.Footer align="end">
                            {indicator}
                            ㅤ
                            <Button variant="danger" onClick={handleUnfollowUser}>Unfollow</Button>
                        </Card.Footer>) : (<></>)}
                    </Card>
                </Col>
                {/* Overlay of articles submitted */}
                <Col lg={{span: 8}}>
                    {articles.length != 0 ? articles.map((article) => (
                        <>
                            <Row>
                            <Card>
                                <Card.Body>
                                <Row>
                                    <Col xs="12" sm="12" lg="10">
                                    <Card.Title>{article.title}</Card.Title>
                                    <Card.Subtitle className='text-muted'>{article.edited == 1 ? 'edited' : ''}</Card.Subtitle>
                                    <Card.Text>{article.content}</Card.Text>
                                    </Col>
                                </Row>
                                </Card.Body>
                            </Card>
                            </Row>  
                            <br />
                        </>
                    )) : <div align="center"> <span style={{fontSize: '24px'}}>No articles submitted yet</span></div>}
                </Col>
            </Row>
        </Container>
    </>);
}

export default UserPage;