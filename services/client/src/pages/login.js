import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useNavigate } from "react-router-dom";
import { userLogin } from "../api";

const Login = () => {
    const navigate = useNavigate();

    const [loginData, setData] = useState([])

    const [msg, setMsg] = useState("");

    const submit = async () => {
        try {
          const response = await userLogin(loginData);

          if (response.data.errorCode !== 0) {
            setMsg(response.data.message);
          } else {
            navigate("/search");
          }
        } catch (error) {
          console.error(error);
          setMsg("Server error");
        }
        
    }

    return (
      <div className="home-bg">
        <Card className="text-center">
          <Card.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  value={loginData.email}
                  onChange={setData}
                  type="email"
                  placeholder="Enter email"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  value={loginData.password}
                  onChange={setData}
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>
              <Button onClick={submit} variant="light" type="button">
                Submit
              </Button>
              {msg && (
                <Form.Text id="passwordHelpBlock" danger>
                  {msg}
                </Form.Text>
              )}
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
}

export default Login
