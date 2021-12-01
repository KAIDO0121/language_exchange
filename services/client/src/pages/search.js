import React, { useState, useContext } from "react";
import { PopBoxCxt } from "../component/contexts";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useSelLang } from "../component/hook";
import { matchUserByLang } from "../api";
import LangGroup from "../component/langGroup";
import Spinner from "react-bootstrap/Spinner";
import { Col, Row, Container, ListGroup, Badge } from "react-bootstrap";
import placeholder from "../style/avatar-placeholder.png";
import { FixedSizeList as List } from "react-window";
import { Link } from "react-router-dom";

const Search = () => {
  const { setPopbox } = useContext(PopBoxCxt);
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { allLang, selectLevelHandler, selectLangHandler, selLang } =
    useSelLang();

  const submit = async () => {
    setLoading(true);
    try {
      const response = await matchUserByLang(selLang);
      setLoading(false);
      if (response.data.errorCode === 0) {
        setList(response.data.users);
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
    <Container>
      <Row className="p-3">
        <Card className="text-center">
          {!isLoading && (
            <Card.Body>
              <Form>
                <LangGroup
                  allLang={allLang}
                  selectLevelHandler={selectLevelHandler}
                  selectLangHandler={selectLangHandler}
                  form={selLang}
                />
              </Form>
              <Button onClick={submit} variant="light" type="button">
                Find partners
              </Button>
            </Card.Body>
          )}
          {isLoading && <Spinner animation="border" />}
        </Card>
      </Row>
      <Row>
        <ListGroup>
          <TableHeader />
          <List
            height={400}
            itemCount={list.length}
            itemData={list}
            itemSize={100}
          >
            {User}
          </List>
        </ListGroup>
      </Row>
    </Container>
  );
};

const User = (props) => {
  const { data, index, style } = props;
  return (
    <ListGroup.Item key={`${data[index]}-${index}`} style={style}>
      <Row>
        <Col lg={2}>
          {
            <Link to={`/userProfile/${data[index].id}`}>
              <img
                style={{ width: "5rem" }}
                className="prfile_pic"
                src={data[index].pic ?? placeholder}
              />
            </Link>
          }
        </Col>
        <Col lg={10}>
          <Row className="m-1">{data[index].username}</Row>
          <Row>
            <Col lg={6}>
              <ListOfLang langs={data[index].user_offer_langs} type="offer" />
            </Col>
            <Col lg={6}>
              <ListOfLang langs={data[index].user_acpt_langs} type="acpt" />
            </Col>
          </Row>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

const TableHeader = () => (
  <ListGroup.Item>
    <Row>
      <Col lg={2}>
        <Badge bg="light" text="dark">
          <h6>User Profile</h6>
        </Badge>
      </Col>
      <Col lg={5} className="offer_header">
        <Badge className="offer_lang">
          <h6>He / She offers</h6>
        </Badge>
      </Col>
      <Col lg={5} className="acpt_header">
        <Badge className="acpt_lang">
          <h6>He / She accepts</h6>
        </Badge>
      </Col>
    </Row>
  </ListGroup.Item>
);

const ListOfLang = ({ langs, type }) => {
  return langs.map((lang) => (
    <>
      <Badge className={`m-1 ${type === "offer" ? "offer_lang" : "acpt_lang"}`}>
        {lang.lang_name}
      </Badge>
      <Badge className="m-1" bg="light" text="dark">
        Lv.{lang.level}
      </Badge>
    </>
  ));
};

export default Search;
