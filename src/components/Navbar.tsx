import React from "react";
import {Form, Navbar, Container, Nav, Offcanvas, NavDropdown, FormControl, Row, Col, Button} from "react-bootstrap"
import {SyntheticEvent, useState, useEffect} from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "../styling/navbar.css"


const CustomNavbar = () => {

   
    
    
    return (
            <Navbar bg="dark" variant="dark"  expand={false}  fixed = "top" className = "main-nav">
            <Container fluid > 
                <Navbar.Brand href="#">Metoda Pośrednika</Navbar.Brand>
                <Navbar.Toggle aria-controls="offcanvasNavbar" />
                <Navbar.Offcanvas className="navbar-side"
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="end"
                bg="dark"
                >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id="offcanvasNavbarLabel" className ="ChartTitle"></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body >
                </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
            </Navbar>
    );
  }
  export { CustomNavbar};