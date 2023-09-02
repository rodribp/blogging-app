import React, { useState, useEffect } from "react";
import NavbarSample from "../components/navbar";
import { Container, Row, Col, Button, Card, ListGroup, Form, Spinner, Alert,  } from "react-bootstrap";
import { getUserId } from "../session";
import { getUserInfo, updateUserInfo } from "../api/sanity";
import { AiOutlineUser, AiOutlineSecurityScan, AiOutlineEdit, AiOutlineSetting } from "react-icons/ai";

const buttonStyle = {
    width: '100%', // Make the button fill the entire width of the ListGroup.Item
    height: '100%', // Make the button fill the entire height of the ListGroup.Item
    backgroundColor: 'transparent',
    border: 'none',
    padding: '3%',
    outline: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s', // Add a smooth transition for the background color change
    textAlign: 'start', 
  };
  

  const hoverStyle = {
    backgroundColor: '#f0f0f0', // Gray background color on hover
  };
  
  function NoBorderStyleButton( {message, onClick} ) {
    const [isHovered, setIsHovered] = React.useState(false);
  
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  
    const buttonStyles = {
      ...buttonStyle,
      ...(isHovered && hoverStyle),
    };

    return (
      <button
        type="button"
        style={buttonStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {message == 'My profile' ? (<AiOutlineUser />) : message == 'Security' ? (<AiOutlineSecurityScan />) : message == 'Appearance' ? (<AiOutlineEdit />) : ''}

        <span> | {message}</span>
      </button>
    );
  }

const Settings = () => {
    const id = getUserId();

    const [edge, setEdge] = useState('Settings');
    const [formData, setFormData] = useState({
        username: '',
        wallet: '',
        bio: ''
    })
    const [updateAlert, setUpdateAlert] = useState(<></>);

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
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

        setUpdateAlert(<Alert variant="success" key="success" dismissible>
                Succesfully updated
        </Alert>)
    }

    const fillOutInfo = async () => {
        const response = await getUserInfo(id);

        setFormData({
            username: response[0].username,
            wallet: response[0].wallet,
            bio: response[0].bio
        })
    }

    useEffect(() => {
        fillOutInfo();
    }, [])

    return (
        <>
            <NavbarSample />
            <br />
            <Container>
                <Row>
                    <Col lg={3} sm={12} xs={12}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item style={{ padding: '0', margin: '0' }}>
                                    <NoBorderStyleButton message={'My profile'} onClick={() => setEdge('Profile')} />
                                </ListGroup.Item>
                                <ListGroup.Item style={{ padding: '0', margin: '0' }}>
                                    <NoBorderStyleButton message={'Security'} onClick={() => setEdge('Security')} />
                                </ListGroup.Item>
                                <ListGroup.Item style={{ padding: '0', margin: '0' }}>
                                    <NoBorderStyleButton message={'Appearance'} onClick={() => setEdge('Customization')} />
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col lg={9} sm={12} xs={12}>
                        <Card>
                            <Card.Header><Card.Title>{edge == 'Profile' ? (<AiOutlineUser />) : edge == 'Security' ? (<AiOutlineSecurityScan />) : edge == 'Customization' ? (<AiOutlineEdit />) : (<AiOutlineSetting />)} | {edge}</Card.Title></Card.Header>
                                {
                                    edge == 'Profile' ? (<Card.Body>
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
                                                                    <br />
                                                                    <div align="end"><Button variant="primary" onClick={handleSubmitEvent}>
                                                                        Save Changes
                                                                    </Button></div>
                                                        </Card.Body>
                                                        )
                                    :
                                    edge == 'Security' ? (<Card.Body>

                                                        </Card.Body>)
                                    :
                                    edge == 'Customization' ? (<Card.Body>
                                                                
                                                            </Card.Body>)
                                    :
                                    (<Card.Body>
                                        <h4 className="mb-4">Welcome to the Settings page!</h4>
                                        <p className="mb-2">Here, you can customize various aspects of your OrangeBlog experience:</p>
                                        <ul className="mb-4">
                                            <li>Manage your profile information</li>
                                            <li>Enhance the security of your account</li>
                                            <li>Adjust the appearance and layout</li>
                                        </ul>
                                        <p>Feel free to explore the options in the navigation menu on the left and make the changes that best suit your preferences.</p>
                                    </Card.Body>)
                                }
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Settings;