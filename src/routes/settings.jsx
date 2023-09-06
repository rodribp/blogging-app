import React, { useState, useEffect, useRef } from "react";
import NavbarSample from "../components/navbar";
import { Container, Row, Col, Button, Card, ListGroup, Form, Spinner, Alert, Image, Badge } from "react-bootstrap";
import { getUserId } from "../session";
import { getUserInfo, updateUserInfo, getPasswordById, changePassword } from "../api/sanity";
import { AiOutlineUser, AiOutlineSecurityScan, AiOutlineEdit, AiOutlineSetting } from "react-icons/ai";
import workingon from '../img/workingon.png'
import { verifyPassword, isStrong } from "../api/security";

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
    const [dissSaveButton, setDissSaveButton] = useState(false);
    const [formPassword, setFormPassword] = useState({
        password1: '',
        password2: '',
        password3: '' 
    });
    const [disabled, setDisabled] = useState({
        pass1: false,
        pass2: true
    });
    const [isOk, setIsOk] = useState(<></>)
    const [hash, setHash] = useState('');
    const [disPassButton, setDisPassButton] = useState(true);
    const [passAlert, setPassAlert] = useState(<></>);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setDissSaveButton(true);

        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handlePassChange = async (e) => {
        const { name, value } = e.target;

        setFormPassword({
            ...formPassword,
            [name]: value
        })

        if (name == ['password1']) {
            const isPassword = await verifyPassword(value, hash);
            
            if (!isPassword) {
                setIsOk(<Badge pill bg="danger">X</Badge>);
            } else {
                setIsOk(<Badge pill bg="success">Ok</Badge>);
                setDisabled({
                    pass1: true,
                    pass2: false
                })
            }
        }

        if (name == ['password2']) {
            const response = isStrong(value);
            if (formPassword.password3 != value) {
                setPassAlert(<Alert variant="danger">Passwords don't match!</Alert>)
                setDisPassButton(true);
                return;
            }

            if (value == '') {
                setPassAlert(<Alert variant="danger">Password is nothing</Alert>)
                setDisPassButton(true);
                return;
            }

            if (!response.isSafe) {
                setPassAlert(<Alert variant="danger">{response.message}</Alert>)
                setDisPassButton(true);
                return;
            }

            if (value == formPassword.password1) {
                setPassAlert(<Alert variant="danger">Cannot use the last password</Alert>)
                setDisPassButton(true);
                return;
            }

            setPassAlert(<Alert variant="success">Valid password!</Alert>)
            setDisPassButton(false);
        }

        if (name == ['password3']) {
            const response = isStrong(value);
            if (formPassword.password2 != value) {
                setPassAlert(<Alert variant="danger">Passwords don't match!</Alert>)
                setDisPassButton(true);
                return;
            }

            if (value == '') {
                setPassAlert(<Alert variant="danger">Password is nothing</Alert>)
                setDisPassButton(true);
                return;
            }

            if (!response.isSafe) {
                setPassAlert(<Alert variant="danger">{response.message}</Alert>)
                setDisPassButton(true);
                return;
            }

            if (value == formPassword.password1) {
                setPassAlert(<Alert variant="danger">Cannot use the last password</Alert>)
                setDisPassButton(true);
                return;
            }

            setPassAlert(<Alert variant="success">Valid password!</Alert>)
            setDisPassButton(false);
        }
    }

    const getHash = async () => {
        const response = await getPasswordById(id);
        setHash(response[0].password);
    }

    const handleChangePassword = async () => {
        setPassAlert(<Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>);
        const response = await changePassword(id, formPassword.password2);

        if (!response) {
            setUpdateAlert(<Alert variant="danger" key="danger" dismissible>
                Error changing password
            </Alert>);
            return;
        }

        setDisPassButton(true);
        setFormPassword({
            password1: '',
            password2: '',
            password3: '' 
        });
        setIsOk(<></>);
        setDisabled({
            pass1: false,
            pass2: true
        });
        setPassAlert(<Alert variant="success" key="success" dismissible>
                Password changed succesfully
        </Alert>);
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
                Profile changed succesfully!
        </Alert>)
        setDissSaveButton(false);
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
        getHash();
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
                                                                    <Form onSubmit={(e) => e.preventDefault()}>
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
                                                                    <div align="end"><Button variant={!dissSaveButton ? 'secondary' : 'primary'} onClick={handleSubmitEvent} disabled={!dissSaveButton}>
                                                                        Save Changes
                                                                    </Button></div>
                                                        </Card.Body>
                                                        )
                                    :
                                    edge == 'Security' ? (<Card.Body>
                                                            <h5>Change password</h5>    
                                                            <br />
                                                            {passAlert}
                                                            <Form onSubmit={(e) => e.preventDefault()}>
                                                                <Form.Group>
                                                                    <Form.Label>Current password {isOk}</Form.Label>
                                                                    <Form.Control disabled={disabled.pass1} name="password1" type="password" value={formPassword.password1} onChange={handlePassChange} />
                                                                </Form.Group>
                                                                <Form.Group>
                                                                    <Form.Label>New password</Form.Label>
                                                                    <Form.Control disabled={disabled.pass2} name="password2" type="password" value={formPassword.password2} onChange={handlePassChange} />
                                                                </Form.Group>
                                                                <Form.Group>
                                                                    <Form.Label>Confirm new password</Form.Label>
                                                                    <Form.Control disabled={disabled.pass2} name="password3" type="password" value={formPassword.password3} onChange={handlePassChange} />
                                                                </Form.Group>
                                                            </Form>
                                                            <br />
                                                            <div align="end"><Button disabled={disPassButton} onClick={handleChangePassword}>
                                                                Change password
                                                            </Button></div>
                                                        </Card.Body>)
                                    :
                                    edge == 'Customization' ? (<Card.Body align="center">
                                                                <Image src={workingon} height={208}/>
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