import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Tooltip, OverlayTrigger, Alert, Modal, Spinner } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import NavbarSample from "../components/navbar";
import { getUserInfo, updateUserInfo, getUserArticles } from "../api/sanity";
import { getUserId } from "../session";
import { AiOutlineCopy, AiOutlineSetting } from 'react-icons/ai';

const Profile = () => {
    const id = getUserId();

    const [userData, setUserData] = useState({
        username: '',
        wallet_name: '',
        lnurlp: '',
        bio: ''
    });

    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        wallet: '',
        bio: ''
    })

    const [updateAlert, setUpdateAlert] = useState(<></>);
    const [articles, setArticles] = useState([]);
    //function that copies on clipboard lnurlp
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(userData.lnurlp);
        setShow(true);
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    //filling profile info
    const fillOutInfo = async () => {
        const response = await getUserInfo(id);

        setUserData({
            username: response[0].username,
            wallet_name: response[0].wallet,
            lnurlp: response[0].lnurlp,
            bio: response[0].bio
        })
        setFormData({
            username: response[0].username,
            wallet: response[0].wallet,
            bio: response[0].bio
        })
    }

    const handleSubmitEvent = async () => {
        setUpdateAlert(<Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>);

        const response = await updateUserInfo(id, formData.username, formData.wallet, formData.bio);

        if (!response) {
            setUpdateAlert(<Alert variant="danger" key="danger" dismissible>
                Error updating data
            </Alert>)
            return;
        }

        await fillOutInfo();

        setShowModal(false);
    }

    const fetchArticles = async () => {
        const response = await getUserArticles(id);

        setArticles(response);
    }

    //when the page loads
    useEffect(() => {
        fillOutInfo();
        fetchArticles();
    }, [])

    return (
        <>
            <NavbarSample></NavbarSample>
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
                            <Card.Footer>
                                <Container>
                                    <Row>
                                        <Col lg="8">
                                            <Button variant="light" href="/settings">
                                                <AiOutlineSetting />
                                            </Button>
                                        </Col>
                                        <Col lg="4">
                                            <Button variant="primary" onClick={() => setShowModal(true)}>Edit profile</Button>
                                        </Col>
                                    </Row>
                                </Container>
                                

                            </Card.Footer>
                        </Card>
                    </Col>
                    {/* Overlay of my articles submitted */}
                    <Col lg={{span: 8}}>
                        {articles.map((article) => (
                            <>
                                <Row key={article._id}>
                                <Card>
                                    <Card.Body>
                                    <Row>
                                        <Col xs="12" sm="12" lg="12">
                                        <Card.Title>{article.title}</Card.Title>
                                        <Card.Text>{article.content}</Card.Text>
                                        </Col>
                                    </Row>
                                    </Card.Body>
                                </Card>
                                </Row>
                                <br />
                            </>
                        ))}
                    </Col>
                </Row>
                <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static"
        keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {updateAlert}
                        <Form>
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control name="username" type="text" value={formData.username} onChange={handleFormChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Wallet name</Form.Label>
                                <Form.Control name="wallet" type="text" value={formData.wallet} onChange={handleFormChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Biography</Form.Label>
                                <Form.Control name="bio" as="textarea" value={formData.bio} onChange={handleFormChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSubmitEvent}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    )
}

export default Profile;