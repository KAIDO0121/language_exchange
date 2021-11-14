import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
      <div className="home-bg">
        <div className="center">
          <h1 className="title">Start your journy here</h1>
          <Card className="text-center">
            <Card.Body>
              <Button variant="light">
                <Link to="/register">Register</Link>
              </Button>
              <Button variant="light">
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="light">
                <Link to="/search">Visit</Link>
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
}

export default Home