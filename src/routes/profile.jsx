import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import BioForm from "../components/biography";
import NavbarSample from "../components/navbar";
import { getUserInfo } from "../api/sanity";
import { getUserId } from "../session";

const Profile = () => {
    const id = getUserId();

    const [userData, setUserData] = useState({
        username: '',
        wallet_name: '',
        lnurlp: ''
    });

    useEffect(() => {
        const fillOutInfo = async () => {
            const response = await getUserInfo(id);

            setUserData({
                username: response[0].username,
                wallet_name: response[0].wallet,
                lnurlp: response[0].lnurlp
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
                    <Col lg={{span: 4}}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Your profile</Card.Title>
                                <Card.Text>Username: {userData.username}</Card.Text>
                                <Card.Text>Wallet name: {userData.wallet_name}</Card.Text>
                                <BioForm />
                                <br />
                                <Card.Text>LNURLP:</Card.Text>
                                <div className="text-center">
                                    <QRCodeSVG size={250} value={userData.lnurlp} />
                                    <input disabled value={userData.lnurlp}></input>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={{span: 8}}>
                    
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Profile;