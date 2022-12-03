import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavigationBar() {
  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Nav>
            <Nav.Link href="/visual">Visual</Nav.Link>
            <Nav.Link href="/similar-recipes">Similar Recipes</Nav.Link>
            <Nav.Link href="/polarity">Polarity</Nav.Link>
            <Nav.Link href="/data-processing">Data Processing</Nav.Link>
            <Nav.Link href="/" onClick={handleLogout}>
              Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;
