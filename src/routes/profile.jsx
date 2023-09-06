import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Tooltip, OverlayTrigger, Alert, Stack, Spinner, Modal } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import NavbarSample from "../components/navbar";
import { getUserInfo, getUserArticles, deleteArticleById, updateArticleById } from "../api/sanity";
import { getUserId } from "../session";
import { AiOutlineCopy, AiOutlineSetting, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';

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
        title: '',
        content: '',
        _id: ''
    })

    const [articlesAlert, setArticlesAlert] = useState(<></>);
    const [articles, setArticles] = useState([]);
    const [updateAlert, setUpdateAlert] = useState(<></>);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [currentIdOnDelete, setCurrentIdOnDelete] = useState('');
    //function that copies on clipboard lnurlp
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(userData.lnurlp);
        setShow(true);
    }

    const handleFormChange = (e) => {
        setIsEditing(true);
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

    const fetchArticles = async () => {
        const response = await getUserArticles(id);

        setArticles(response);
    }

    const handleDeleteArticle = async () => {
        setArticlesAlert(<Spinner animation='border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>)
        const response = await deleteArticleById(currentIdOnDelete);

        if (!response) {
            setArticlesAlert(<Alert variant="danger" dismissible>
                there's a problem deleting the article
            </Alert>)
            return;
        }

        fetchArticles();
        setArticlesAlert(<Alert variant="success" dismissible>
                Article deleted
            </Alert>)
        setCurrentIdOnDelete('');
        setShowConfirmModal(false);
    }

    const handleOpenModal = (articleId, title, content) => {
        formData.title = title;
        formData.content = content;
        formData._id = articleId;
        setShowModal(true);
        setArticlesAlert(<></>)
    }

    const handleEditArticle = async () => {
        setUpdateAlert(<Spinner animation='border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>)

        const response = await updateArticleById(formData._id, formData.title, formData.content);

        if (!response) {
            setUpdateAlert(<Alert variant="danger" dismissible>
                Error editing article
            </Alert>)
            return;
        }

        setShowModal(false);
        fetchArticles();
        setArticlesAlert(<Alert variant="success" dismissible>
            Article edited
        </Alert>);
        setIsEditing(false);
        setUpdateAlert(<></>);
    }

    const handleOpenModalDelete = (articleId) => {
        setShowConfirmModal(true);
        setCurrentIdOnDelete(articleId);
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
                            <Card.Footer align="end">
                                <Button variant="light" href="/settings">
                                    <AiOutlineSetting /> | Settings
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                    {/* Overlay of my articles submitted */}
                    <Col lg={{span: 8}}>
                        {articlesAlert}
                        {articles ? articles.map((article) => (
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
                                        <Col  xs="12" sm="12" lg="2">
                                            <Stack gap={2}>
                                                        <OverlayTrigger
                                                key={'top'}
                                                placement={'top'}
                                                overlay={
                                                    <Tooltip>
                                                        Edit article!
                                                    </Tooltip>
                                                }
                                                >
                                                    <Button variant="primary" onClick={() => handleOpenModal(article._id, article.title, article.content)}>
                                                        <AiOutlineEdit/>
                                                    </Button>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                key={'top'}
                                                placement={'top'}
                                                overlay={
                                                    <Tooltip>
                                                        Delete article!
                                                    </Tooltip>
                                                }
                                                >
                                                    <Button variant="danger" onClick={() => handleOpenModalDelete(article._id)}>
                                                        <AiOutlineDelete/>
                                                    </Button>
                                                </OverlayTrigger>
                                            </Stack>
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
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Edit modal</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                    {updateAlert}
                        <Form onSubmit={(e) => e.preventDefault()}>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" name="title" value={formData.title} onChange={handleFormChange} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Content</Form.Label>
                                <Form.Control rows={6} as="textarea" name="content" value={formData.content} onChange={handleFormChange} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button onClick={handleEditArticle} variant={!isEditing ? "secondary" : "primary"} disabled={!isEditing}>Save changes</Button>
                    </Modal.Footer>
            </Modal>
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal} backdrop="static" keyboard={false}>
                <Modal.Header><Modal.Title>Are you sure?</Modal.Title></Modal.Header>
                <Modal.Body>Once you delete an article there's no way to recover it</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>No, go back</Button>
                    <Button variant="danger" onClick={() => handleDeleteArticle()}>Yes, delete article</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Profile;