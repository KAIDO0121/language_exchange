import React, { useState, useContext } from "react";
import { PopBoxCxt } from "../component/contexts";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { v4 as uuidv4 } from "uuid";
import { useSelLang } from "../component/hook";
import { matchUserByLang } from "../api";
import LangGroup from "../component/langGroup";
import {
  Col,
  Row,
  Container,
  ListGroup,
  Badge,
  Spinner,
} from "react-bootstrap";
import placeholder from "../style/avatar-placeholder.png";
import { FixedSizeList as List } from "react-window";
import { Link } from "react-router-dom";

const Search = () => {
  const { setPopbox } = useContext(PopBoxCxt);
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [status, setStatus] = useState({
    langs: {
      status: null,
      msg: "",
    },
  });

  const { allLang, selectLevelHandler, selectLangHandler, selLang } =
    useSelLang();

  const submit = async () => {
    if (!status.langs.status) return;

    setLoading(true);

    const _filteredLang = {
      user_offer_langs: selLang.user_offer_langs.filter(
        (el) => el.lang_name !== false
      ),
      user_acpt_langs: selLang.user_acpt_langs.filter(
        (el) => el.lang_name !== false
      ),
    };

    try {
      const response = await matchUserByLang(_filteredLang);
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
          <Card.Body>
            <Form>
              <LangGroup
                setStatus={setStatus}
                allLang={allLang}
                selectLevelHandler={selectLevelHandler}
                selectLangHandler={selectLangHandler}
                form={selLang}
              />
            </Form>

            {isLoading ? (
              <Button variant="light" disabled>
                <Spinner
                  style={{ marginRight: "0.5rem" }}
                  as="span"
                  animation="border"
                  size="sm"
                />
                Loading...
              </Button>
            ) : (
              <Button onClick={submit} variant="light" type="button">
                Find partners
              </Button>
            )}
          </Card.Body>
        </Card>
      </Row>
      <Row>
        <ListGroup>
          <TableHeader />
          {list.length ? (
            <List
              height={400}
              itemCount={list.length}
              itemData={list}
              itemSize={100}
            >
              {User}
            </List>
          ) : (
            <ListGroup.Item className="text-center">
              No matched users...
            </ListGroup.Item>
          )}
        </ListGroup>
      </Row>
    </Container>
  );
};

const User = (props) => {
  const { data, index, style } = props;
  return (
    <ListGroup.Item style={style}>
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
      <Badge
        key={uuidv4()}
        className={`m-1 ${type === "offer" ? "offer_lang" : "acpt_lang"}`}
      >
        {lang.lang_name}
      </Badge>
      <Badge key={uuidv4()} className="m-1" bg="light" text="dark">
        Lv.{lang.level}
      </Badge>
    </>
  ));
};

export default Search;
