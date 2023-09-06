import Container from 'react-bootstrap/Container';
import { Navbar, Nav, Image, Button} from 'react-bootstrap';
import { AiFillEdit, AiFillWallet, AiOutlineLogout, AiOutlineLogin, AiOutlineUserAdd, AiOutlineUser } from "react-icons/ai"
import logo from '../img/logo1.png'
import { useState } from 'react';
import { isLoggedIn, logOut } from '../session';

function NavbarSample() {
    
const [isLogged, setIsLogged] = useState(isLoggedIn());

const handleLogout = () => {
    setIsLogged(!isLoggedIn());
    window.location.href = '/';
    logOut();
}
    
    var elements = isLogged ? (
        <>
        <Nav.Link href='/article'>
                <AiFillEdit />
                {'     '}
                Create an article
        </Nav.Link>
                { '     ' }
    <Nav.Link href='/wallet'>
            <AiFillWallet />
            {'     '}
            My wallet
    </Nav.Link>
    { '     ' }
    <Nav.Link href='/profile'>
            <AiOutlineUser />
            {'     '}
            My profile
    </Nav.Link>
    { '     ' }
    <Nav.Link onClick={handleLogout}>
            <AiOutlineLogout />
            {'     '}
            Logout
    </Nav.Link>
      </>) : (
        <>
    <Nav.Link href='/login'>
        <AiOutlineLogin />
        {'     '}
        Login
    </Nav.Link>
    </>);

    if (window.location.pathname == "/login" && !isLogged) {
        elements = (
            <Nav.Link href='/signup'>
                <AiOutlineUserAdd />
                {'     '}
                Signup
            </Nav.Link>
        )
    }

    return (
        <Navbar expand='lg' sticky='top' bg='dark' variant='dark'>
            <Container>
                <Navbar.Brand href="/" style={isLogged ? {paddingRight: '50%'} : {paddingRight: '76%'}}>
                    <Image alt="" src={logo} height="30" className="d-inline-block align-top"/>{'        '}OrangeBlog
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav>
                        {elements}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarSample;