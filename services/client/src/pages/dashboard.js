import React, { useState, useEffect, useContext } from "react";
import { PopBoxCxt } from "../component/contexts";
import Form from "react-bootstrap/Form";
import CardGroup from "react-bootstrap/CardGroup";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import LangGroup from "../component/langGroup";
import { useSelLang } from "../component/hook";
import { getMyProfile, editProfile, uploadPic } from "../api";

const Dashboard = () => {
  const { setPopbox } = useContext(PopBoxCxt);
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
    status: null,
    msg: "",
  });

  const submit = async () => {
    try {
      const updated = { ...profile, ...selLang };
      const response = await editProfile(updated);

      if (image) {
        const img = new FormData();
        img.append("image", image, image.name);
        const updatePic = await uploadPic(img);
        if (updatePic.data.errorCode === 0) {
          setStatus({
            status: true,
            msg: "",
          });
        } else {
          setStatus({
            status: false,
            msg: updatePic.data.message,
          });
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
  }, []);

  return (
    <div className="home-bg">
      <Container>
        <CardGroup className="text-center center register">
          <Card
            className="p-3"
            style={{
              width: "18rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="image-container">
              <img src={profile.pic} className="prfile_pic" />
            </div>

            <Card.Body>
              <Card.Title className="text-center">
                {profile.username}
              </Card.Title>
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
                      isValid={status.status === true}
                      isInvalid={status.status === false}
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                    />

                    {status.status === false && (
                      <Form.Control.Feedback type="invalid">
                        {status.msg}
                      </Form.Control.Feedback>
                    )}
                  </InputGroup>
                  <Form.Text muted>
                    Allowed extensions: .jpg, .jpe, .jpeg, .png, .gif, .svg,
                    .bmp )
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
    </div>
  );
};

export default Dashboard;
