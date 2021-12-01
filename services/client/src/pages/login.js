import React, { useState, useContext } from "react";
import { LoginCxt, PopBoxCxt } from "../component/contexts";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../api";
import { Navigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { setPopbox } = useContext(PopBoxCxt);
  const { isLogin, setLogin } = useContext(LoginCxt);
  const [loginData, setData] = useState({
    username: "",
    password: "",
  });

  const [status, setStatus] = useState({
    username: {
      status: null,
      msg: "",
    },
    password: {
      status: null,
      msg: "",
    },
  });

  const submit = async () => {
    if (loginData.username === "") {
      setStatus((prev) => ({
        ...prev,
        username: {
          status: false,
          msg: "Username is required",
        },
      }));
      return;
    }
    if (loginData.password === "") {
      setStatus((prev) => ({
        ...prev,
        password: {
          status: false,
          msg: "Password is required",
        },
      }));
      return;
    }
    try {
      const response = await userLogin(loginData);

      if (response.data.errorCode === 2) {
        setStatus((prev) => ({
          ...prev,
          username: {
            status: false,
            msg: response.data.message,
          },
        }));
      } else if (response.data.errorCode === 3) {
        setStatus((prev) => ({
          ...prev,
          password: {
            status: false,
            msg: response.data.message,
          },
        }));
      } else if (response.data.errorCode === 0) {
        setLogin(true);
        navigate("/search");
      } else {
        setPopbox({
          isShow: true,
          content: response.data.message,
        });
      }
    } catch (error) {
      console.error(error);
      setPopbox({
        isShow: true,
        content: "Server error",
      });
    }
  };

  if (isLogin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="home-bg">
      <Card className="text-center center">
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <InputGroup hasValidation>
                <Form.Control
                  isInvalid={status.username.status === false}
                  value={loginData.username}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  type="text"
                  placeholder="Enter username"
                />

                {status.username.status === false && (
                  <Form.Control.Feedback type="invalid">
                    {status.username.msg}
                  </Form.Control.Feedback>
                )}
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <InputGroup hasValidation>
                <Form.Control
                  isInvalid={status.password.status === false}
                  value={loginData.password}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  type="password"
                  placeholder="Enter password"
                />

                {status.password.status === false && (
                  <Form.Control.Feedback type="invalid">
                    {status.password.msg}
                  </Form.Control.Feedback>
                )}
              </InputGroup>
            </Form.Group>
            <Button onClick={submit} variant="light" type="button">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
