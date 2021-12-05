import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { PopBoxCxt, LoginCxt } from "../component/contexts";
import Form from "react-bootstrap/Form";
import CardGroup from "react-bootstrap/CardGroup";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import placeholder from "../style/avatar-placeholder.png";
import LangGroup from "../component/langGroup";
import { useSelLang } from "../component/hook";
import { getMyProfile, editProfile, uploadPic } from "../api";

const Dashboard = () => {
  const { setPopbox } = useContext(PopBoxCxt);
  const { isLogin } = useContext(LoginCxt);
  const [image, setImage] = useState(null);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    pic: null,
    bio: "",
  });

  const { allLang, selectLevelHandler, selectLangHandler, selLang } =
    useSelLang();

  const [status, setStatus] = useState({
    langs: {
      status: null,
      msg: "",
    },
    pic: {
      status: null,
      msg: "",
    },
  });

  const submit = async () => {
    if (!status.langs.status) return;
    try {
      const _filteredLang = {
        user_offer_langs: selLang.user_offer_langs.filter(
          (el) => el.lang_name !== false
        ),
        user_acpt_langs: selLang.user_acpt_langs.filter(
          (el) => el.lang_name !== false
        ),
      };

      const updated = { ...profile, ..._filteredLang };
      const response = await editProfile(updated);

      if (image) {
        const img = new FormData();
        img.append("image", image, image.name);
        const updatePic = await uploadPic(img);
        if (updatePic.data.errorCode === 0) {
          setStatus((prev) => ({
            ...prev,
            pic: { status: true, msg: " " },
          }));
        } else {
          setStatus((prev) => ({
            ...prev,
            pic: { status: false, msg: updatePic.data.message },
          }));
          setPopbox({
            isShow: true,
            content: updatePic.data.message,
          });
          return;
        }
      }

      if (response.data.errorCode === 0) {
        window.location.reload();
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

  useEffect(() => {
    if (!isLogin) return;

    getMyProfile()
      .then((res) => {
        const { username, email, pic, bio } = res.data.userprofile;
        const _profile = {
          username,
          email,
          pic,
          bio,
        };
        setProfile(_profile);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isLogin]);

  if (!isLogin) {
    return <Navigate to="/" />;
  }

  return (
    <Container className="p-3">
      <CardGroup className="">
        <Card
          className="p-3"
          style={{
            width: "18rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="image-container">
            <img
              src={profile.pic ?? placeholder}
              alt="profile_pic"
              className="prfile_pic"
            />
          </div>

          <Card.Body>
            <Card.Title className="text-center">{profile.username}</Card.Title>
            <Card.Title className="text-center">{profile.email}</Card.Title>
          </Card.Body>
        </Card>
        <Card className="p-3">
          <Card.Body>
            <Form>
              <LangGroup
                allLang={allLang}
                selectLevelHandler={selectLevelHandler}
                selectLangHandler={selectLangHandler}
                form={selLang}
                setStatus={setStatus}
              />
              <Row className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label className="text-left">Bio</Form.Label>
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
              </Row>
              <Row className="mb-3">
                <Form.Label className="ml-3">
                  Upload your profile photo
                </Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    isValid={status.pic.status === true}
                    isInvalid={status.pic.status === false}
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                  />

                  {status.pic.status === false && (
                    <Form.Control.Feedback type="invalid">
                      {status.pic.msg}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
                <Form.Text muted>
                  Allowed extensions: .jpg, .jpe, .jpeg, .png, .gif, .svg, .bmp
                  )
                </Form.Text>
              </Row>
            </Form>
            <Button onClick={submit} variant="light" type="button">
              Submit
            </Button>
          </Card.Body>
        </Card>
      </CardGroup>
    </Container>
  );
};

export default Dashboard;
