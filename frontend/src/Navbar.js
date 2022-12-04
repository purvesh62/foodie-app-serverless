import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import axios from "axios";

function NavigationBar() {
  const handleLogout = () => {
    axios.post("https://ak2nvhm6hpyyzkj3dcdxd6hgxa0hztxc.lambda-url.us-east-1.on.aws",
                {
                    "table_name": "users",
                    "type": "update",
                    "data": {
                      "primary_key": "email",
                      "primary_key_value": localStorage.getItem("email"),
                      "update_key": "is_active",
                      "update_key_value": false
                    }
                  }).then((res)=>{
                    console.log("User logged out", res);
                  }).catch(function (error) {
                    console.log("Error in logging out", error);
                  });
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
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link href="/chat">Chat</Nav.Link>
            {/* {if (localStorage.getItem("type") !== "user") {
              <Nav.Link href="/chat">Customer Representative</Nav.Link>
            } } */}
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
