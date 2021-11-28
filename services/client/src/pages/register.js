import React, { useState, useContext } from "react";
import { PopBoxCxt } from "../component/contexts";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { registerUser, checkEmail, checkUserName, userLogin } from "../api";
import { useSelLang } from "../component/hook";
import LangGroup from "../component/langGroup";

const Register = () => {
  const navigate = useNavigate();

  const { allLang, selectLevelHandler, selectLangHandler, selLang } =
    useSelLang();
  const { setPopbox } = useContext(PopBoxCxt);
  const [profile, setProfile] = useState({
    password: "",
    username: "",
    email: "",
    bio: "",
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
    email: {
      status: null,
      msg: "",
    },
  });

  const validateCol = async ({ type, value }) => {
    if (type === "email") {
      try {
        const response = await checkEmail(value);
        if (response.data.errorCode !== 0) {
          setStatus((prev) => ({
            ...prev,
            email: {
              status: false,
              msg: response.data.message,
            },
          }));
        } else {
          setStatus((prev) => ({
            ...prev,
            email: {
              status: true,
              msg: response.data.message,
            },
          }));
          return true;
        }
      } catch (error) {
        console.error(error);
        setPopbox({
          isShow: true,
          content: "Server error",
        });
      }
    } else if (type === "username") {
      try {
        const response = await checkUserName(value);
        if (response.data.errorCode !== 0) {
          setStatus((prev) => ({
            ...prev,
            username: {
              status: false,
              msg: response.data.message,
            },
          }));
        } else {
          setStatus((prev) => ({
            ...prev,
            username: {
              status: true,
              msg: response.data.message,
            },
          }));
          return true;
        }
      } catch (error) {
        console.error(error);
        setPopbox({
          isShow: true,
          content: "Server error",
        });
      }
    } else {
      const passwordRegx =
        /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,15}$/;
      if (!passwordRegx.test(value)) {
        setStatus((prev) => ({
          ...prev,
          password: {
            status: false,
            msg: "Password must be 6-15 characters, contain both alphanumeric and a special characters (!@#$%^&*).",
          },
        }));
      } else {
        setStatus((prev) => ({
          ...prev,
          password: {
            status: true,
            msg: "Password is available.",
          },
        }));
        return true;
      }
    }
  };

  const submit = async () => {
    const validateAllCol = await Promise.all([
      validateCol({ type: "email", value: profile.email }),
      validateCol({ type: "username", value: profile.username }),
      validateCol({ type: "password", value: profile.password }),
    ]);

    if (validateAllCol.includes(undefined)) return;
    try {
      const updated = { ...profile, ...selLang };
      const response = await registerUser(updated);

      if (response.data.errorCode === 0) {
        const loginRes = await userLogin({
          username: profile.username,
          password: profile.password,
        });
        if (loginRes.data.errorCode === 0) {
          localStorage.setItem("access_token", loginRes.data.access_token);
          localStorage.setItem("refresh_token", loginRes.data.refresh_token);
        }
        navigate("/uploadAvatar");
      } else {
        setPopbox({
          isShow: true,
          content: "Server error",
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

  return (
    <div className="home-bg">
      <Container>
        <Card className="text-center center register">
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <InputGroup hasValidation>
                  <Form.Control
                    isValid={status.email.status === true}
                    isInvalid={status.email.status === false}
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    onBlur={(e) =>
                      validateCol({
                        type: "email",
                        value: e.target.value,
                      })
                    }
                    type="email"
                    placeholder="Enter email"
                  />

                  {status.email.status === false && (
                    <Form.Control.Feedback type="invalid">
                      {status.email.msg}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <InputGroup hasValidation>
                  <Form.Control
                    isValid={status.password.status === true}
                    isInvalid={status.password.status === false}
                    value={profile.password}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    onBlur={(e) =>
                      validateCol({
                        type: "password",
                        value: e.target.value,
                      })
                    }
                    type="password"
                    placeholder="Password"
                  />
                  {status.password.status === false && (
                    <Form.Control.Feedback type="invalid">
                      {status.password.msg}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <InputGroup hasValidation>
                  <Form.Control
                    isValid={status.username.status === true}
                    isInvalid={status.username.status === false}
                    value={profile.username}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    onBlur={(e) =>
                      validateCol({
                        type: "username",
                        value: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="Your username"
                  />
                  {status.username.status === false && (
                    <Form.Control.Feedback type="invalid">
                      {status.username.msg}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  className="bio"
                  as="textarea"
                  rows={3}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  placeholder="Your Bio"
                />
              </Form.Group>
              <LangGroup
                allLang={allLang}
                selectLevelHandler={selectLevelHandler}
                selectLangHandler={selectLangHandler}
                form={selLang}
              />
              <Button onClick={submit} variant="light" type="button">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Register;
