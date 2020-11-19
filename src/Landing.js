import React from 'react';
import Navigation from './Navigation';
import { Row, Col, Button } from 'react-bootstrap';
import './App.css';

function Landing() {
  return (
      <>
        <Navigation />
        <div className="center-div transparent p-5 rounded shadow">
              <h1>My Weather</h1>
              <Row>
                <Col>
                    <Button href="/dashboard" className="block" variant="dark" size="lg">Dashboard</Button>
                </Col>
                <Col>
                    <Button href="/profile" className="block" variant="dark" size="lg">Profile</Button>
                </Col>   
              </Row> 
        </div>
      </>
  );
}

export default Landing;
