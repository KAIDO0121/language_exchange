import React, { useState, useEffect, useContext } from "react";
import { PopBoxCxt, LoginCxt } from "../component/contexts";
import { Navigate, useNavigate } from "react-router-dom";
import { Col, Row, Container, Badge } from "react-bootstrap";
import { getUserProfile, getUserLangs } from "../api";
import placeholder from "../style/avatar-placeholder.png";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    pic: null,
    bio: "",
    user_offer_langs: [],
    user_acpt_langs: [],
  });
  const { isLogin, setLogin } = useContext(LoginCxt);
  const navigate = useNavigate();
  const { id } = useParams();
  const { setPopbox } = useContext(PopBoxCxt);

  useEffect(() => {
    if (!id) return;
    if (!isLogin) {
      setPopbox({
        isShow: true,
        content: "You have to Login to proceed !",
        cb: () => {
          navigate("/");
          setPopbox({ isShow: false, content: "" });
        },
      });
    }
    getUserProfile(id)
      .then((res) => {
        if (res.data.userprofile) {
          const { username, email, pic, bio } = res.data.userprofile;
          setProfile((prev) => ({
            ...prev,
            username,
            email,
            pic,
            bio,
          }));
        }
        if (res.data.errorCode === 1) {
          setProfile((prev) => ({
            username: false,
            email: "",
            pic: null,
            bio: "",
            user_offer_langs: [],
            user_acpt_langs: [],
          }));

          setPopbox({
            isShow: true,
            content: "User not found",
            cb: () => {
              navigate("/search");
              setPopbox({ isShow: false, content: "" });
            },
          });
        }
      })
      .catch((error) => {
        setPopbox({
          isShow: true,
          content: "User not found",
          cb: () => {
            navigate("/search");
            setPopbox({ isShow: false, content: "" });
          },
        });
        console.error(error);
      });
    getUserLangs(id)
      .then((res) => {
        setProfile((prev) => ({
          ...prev,
          user_acpt_langs: res.data.langs?.user_acpt_langs,
          user_offer_langs: res.data.langs?.user_offer_langs,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!id) {
    return <Navigate to="/" />;
  }

  return (
    <Container className="p-3">
      {profile.username !== false && (
        <Row>
          <Col lg={1}></Col>
          <Col lg={4}>
            <img
              style={{ width: "15rem" }}
              className="prfile_pic"
              src={profile.pic ?? placeholder}
            />
          </Col>
          <Col lg={3}>
            <Row>
              <h6 className="text-secondary">USER NAME</h6>
            </Row>
            <Row className="m-2">{profile.username}</Row>
            <Row>
              <h6 className="text-secondary">EMAIL</h6>
            </Row>
            <Row className="m-2">{profile.email}</Row>
            <Row>
              <h6 className="text-secondary">He / She offers</h6>
            </Row>
            <Row className="m-2">
              <ListOfLang langs={profile.user_offer_langs} type="offer" />
            </Row>
            <Row>
              <h6 className="text-secondary">He / She accepts</h6>
            </Row>
            <Row className="m-2">
              <ListOfLang langs={profile.user_acpt_langs} type="acpt" />
            </Row>
          </Col>
          <Col lg={4}>
            <Row>
              <h6 className="text-secondary">BIO</h6>
            </Row>
            <Row className="m-2">{profile.bio}</Row>
          </Col>
        </Row>
      )}
    </Container>
  );
};

const ListOfLang = ({ langs = [], type }) => {
  return langs?.map((lang, idx) => (
    <Row key={`${lang}-${type}-${idx}`}>
      <Col>
        <Badge
          className={`m-1 ${type === "offer" ? "offer_lang" : "acpt_lang"}`}
        >
          {lang?.lang_name}
        </Badge>
      </Col>

      <Col>
        <Badge className="m-1" bg="light" text="dark">
          Lv.{lang?.level}
        </Badge>
      </Col>
      <Col></Col>
      <Col></Col>
    </Row>
  ));
};

export default UserProfile;
