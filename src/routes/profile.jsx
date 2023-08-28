import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Tooltip, OverlayTrigger } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import NavbarSample from "../components/navbar";
import { getUserInfo } from "../api/sanity";
import { getUserId } from "../session";
import { AiOutlineCopy } from 'react-icons/ai';
import GetAlert from "../helpers/alerts";
import { toBeEmpty } from "@testing-library/jest-dom/matchers";

const Profile = () => {
    const id = getUserId();

    const [userData, setUserData] = useState({
        username: '',
        wallet_name: '',
        lnurlp: '',
        bio: ''
    });
    const [alert, setAlert] = useState(<></>);
    //function that copies on clipboard lnurlp
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(userData.lnurlp);
        setAlert(<GetAlert variant="success" message="Text copied on clipboard" />)
    }

    //when the page loads
    useEffect(() => {
        //filling profile info
        const fillOutInfo = async () => {
            const response = await getUserInfo(id);

            setUserData({
                username: response[0].username,
                wallet_name: response[0].wallet,
                lnurlp: response[0].lnurlp,
                bio: response[0].bio
            })
        }

        fillOutInfo();
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
                                {alert}
                                </Form>
                            </Card.Body>
                            <Card.Footer align="end">
                                <Button>Edit info</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                    {/* Overlay of my articles submitted */}
                    <Col lg={{span: 8}}>

                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Profile;