import React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const LangGroup = ({
  allLang,
  selectLangHandler,
  selectLevelHandler,
  form = {
    user_offer_langs: [
      {
        lang_name: "English",
        level: 1,
      },
      {
        lang_name: "Japanese",
        level: 1,
      },
      {
        lang_name: "French",
        level: 1,
      },
    ],
    user_acpt_langs: [
      {
        lang_name: "Chinese",
        level: 1,
      },
      {
        lang_name: "Swedish",
        level: 1,
      },
      {
        lang_name: "Arabic",
        level: 1,
      },
    ],
  },
}) => {
  const isDuplicated = (name) => {
    return (
      form.user_acpt_langs.some((el) => el.lang_name === name) ||
      form.user_offer_langs.some((el) => el.lang_name === name)
    );
  };
  return (
    <>
      <Row className="mb-3">
        <Card.Subtitle className="text-left b-b-default mb-3">
          I am accepting...
        </Card.Subtitle>
        <Form.Group as={Col}>
          <Form.Select
            className="mr-2"
            onChange={(e) =>
              selectLangHandler({
                index: 0,
                name: e.target.value,
                type: "acpt",
              })
            }
          >
            {allLang.map((el) => (
              <option
                value={el.name}
                selected={el.name === form.user_acpt_langs[0].lang_name}
                disabled={isDuplicated(el.name)}
                key={`${el.code}-0`}
              >
                {el.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            value={form.user_acpt_langs[0].level}
            onChange={(e) =>
              selectLevelHandler({
                type: "acpt",
                index: 0,
                level: e.target.value,
              })
            }
            type="number"
            min={1}
            max={10}
            placeholder="Enter language level 1-10"
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Select
            className="mr-2"
            onChange={(e) =>
              selectLangHandler({
                index: 1,
                name: e.target.value,
                type: "acpt",
              })
            }
          >
            {allLang.map((el) => (
              <option
                selected={el.name === form.user_acpt_langs[1].lang_name}
                disabled={isDuplicated(el.name)}
                key={`${el.code}-1`}
              >
                {el.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            value={form.user_acpt_langs[1].level}
            onChange={(e) =>
              selectLevelHandler({
                type: "acpt",
                index: 1,
                level: e.target.value,
              })
            }
            min={1}
            max={10}
            type="number"
            placeholder="Enter language level 1-10"
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Select
            className="mr-2"
            onChange={(e) =>
              selectLangHandler({
                index: 2,
                name: e.target.value,
                type: "acpt",
              })
            }
          >
            {allLang.map((el) => {
              return (
                <option
                  selected={el.name === form.user_acpt_langs[2].lang_name}
                  disabled={isDuplicated(el.name)}
                  key={`${el.code}-2`}
                >
                  {el.name}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            value={form.user_acpt_langs[2].level}
            onChange={(e) =>
              selectLevelHandler({
                type: "acpt",
                index: 2,
                level: e.target.value,
              })
            }
            min={1}
            max={10}
            type="number"
            placeholder="Enter language level 1-10"
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Card.Subtitle className="text-left b-b-default mb-3">
          I am offering...
        </Card.Subtitle>

        <Form.Group as={Col}>
          <Form.Select
            className="mr-2"
            onChange={(e) =>
              selectLangHandler({
                index: 0,
                name: e.target.value,
                type: "offer",
              })
            }
          >
            {allLang.map((el) => {
              return (
                <option
                  selected={el.name === form.user_offer_langs[0].lang_name}
                  disabled={isDuplicated(el.name)}
                  key={`${el.code}-2`}
                >
                  {el.name}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            value={form.user_offer_langs[0].level}
            onChange={(e) =>
              selectLevelHandler({
                type: "offer",
                index: 0,
                level: e.target.value,
              })
            }
            type="number"
            min={1}
            max={10}
            placeholder="Enter language level 1-10"
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Select
            className="mr-2"
            onChange={(e) =>
              selectLangHandler({
                index: 1,
                name: e.target.value,
                type: "offer",
              })
            }
          >
            {allLang.map((el) => {
              return (
                <option
                  selected={el.name === form.user_offer_langs[1].lang_name}
                  disabled={isDuplicated(el.name)}
                  key={`${el.code}-2`}
                >
                  {el.name}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            value={form.user_offer_langs[1].level}
            onChange={(e) =>
              selectLevelHandler({
                type: "offer",
                index: 1,
                level: e.target.value,
              })
            }
            min={1}
            max={10}
            type="number"
            placeholder="Enter language level 1-10"
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Select
            className="mr-2"
            onChange={(e) =>
              selectLangHandler({
                index: 2,
                name: e.target.value,
                type: "offer",
              })
            }
          >
            {allLang.map((el) => {
              return (
                <option
                  selected={el.name === form.user_offer_langs[2].lang_name}
                  disabled={isDuplicated(el.name)}
                  key={`${el.code}-2`}
                >
                  {el.name}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Control
            value={form.user_offer_langs[2].level}
            onChange={(e) =>
              selectLevelHandler({
                type: "offer",
                index: 2,
                level: e.target.value,
              })
            }
            min={1}
            max={10}
            type="number"
            placeholder="Enter language level 1-10"
          />
        </Form.Group>
      </Row>
    </>
  );
};

export default LangGroup;
