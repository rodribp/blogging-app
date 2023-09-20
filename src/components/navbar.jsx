import Container from 'react-bootstrap/Container';
import { Navbar, Nav, Image, Button, Form, Tooltip, OverlayTrigger, Row, Col} from 'react-bootstrap';
import { AiFillEdit, AiFillWallet, AiOutlineLogout, AiOutlineLogin, AiOutlineUserAdd, AiOutlineUser, AiOutlineSearch } from "react-icons/ai"
import logo from '../img/logo1.png'
import { useState } from 'react';
import { isLoggedIn, logOut } from '../session';

function NavbarSample() {
    
const [isLogged, setIsLogged] = useState(isLoggedIn());
const [search, setSearch] = useState('');

const handleLogout = () => {
    setIsLogged(!isLoggedIn());
    window.location.href = '/';
    logOut();
}

const handleSearch = (e) => {
    e.preventDefault();
    if(search == ''){
        return;
    }
    window.location.href = '/search?s=' + search;
}

const handleChange = (e) => {
    const search = e.target.value;

    setSearch(search);
}

    var elements = isLogged ? (
        <>
        <Nav>
        ㅤ
        </Nav>
        <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
                placeholder='Search'
                value={search}
                onChange={handleChange}
            />
        </Form>
        <Nav>
        ㅤㅤ
        </Nav>
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
        <Nav>
        ㅤ
        </Nav>
        <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
                placeholder='Search'
                value={search}
                onChange={handleChange}
            />
        </Form>
        <Nav>
        ㅤㅤ
        </Nav>
        <Nav.Link href='/login'>
            <AiOutlineLogin />
            {'     '}
            Login
        </Nav.Link>
    </>);

    if (window.location.pathname == "/login" && !isLogged) {
        elements = (<>
            <Nav>
        ㅤ
        </Nav>
        <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
                placeholder='Search'
                value={search}
                onChange={handleChange}
            />
        </Form>
        <Nav>
        ㅤㅤ
        </Nav>
            <Nav.Link href='/signup'>
                <AiOutlineUserAdd />
                {'     '}
                Signup
            </Nav.Link>
            </>
        )
    }

    return (
        <Navbar expand='lg' sticky='top' bg='dark' variant='dark'>
            <Container>
                <Navbar.Brand href="/">
                    <Image alt="" src={logo} height="30" className="d-inline-block align-top"/>{'        '}OrangeBlog
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll"/>
                <Navbar.Collapse id="navbarScroll" className='justify-content-end' >
                    <Nav>
                        {elements}
                    </Nav>
                </Navbar.Collapse>
                
            </Container>
        </Navbar>
    );
}

export default NavbarSample;