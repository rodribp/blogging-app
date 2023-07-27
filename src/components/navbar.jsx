import Container from 'react-bootstrap/Container';
import { Navbar, Nav, Image, Button} from 'react-bootstrap';
import { AiFillEdit, AiFillWallet, AiOutlineLogout, AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai"
import logo from '../img/logo1.png'
import { useState } from 'react';

function NavbarSample() {
    
const [isLogged, setIsLogged] = useState(true);

const handleLogout = () => {
  setIsLogged(false)
}

const handleLogin = () => {
  setIsLogged(true)
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
                <Navbar.Brand href="/">
                    <Image alt="" src={logo} height="30" className="d-inline-block align-top" />{'        '}OrangeBlog
                </Navbar.Brand>
                <Nav>
                    {elements}
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavbarSample;