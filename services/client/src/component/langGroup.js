import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

const LangGroup = ({
  allLang,
  selectLangHandler,
  selectLevelHandler,
  setStatus,
  form = {
    user_offer_langs: [
      {
        lang_name: "English",
        level: 1,
      },
    ],
    user_acpt_langs: [
      {
        lang_name: "Chinese",
        level: 1,
      },
    ],
  },
}) => {
  const [allValid, setAllValid] = useState(new Array(6));

  const isDuplicated = (name) => {
    return (
      form.user_acpt_langs.some((el) => el.lang_name === name) ||
      form.user_offer_langs.some((el) => el.lang_name === name)
    );
  };
  const validateLevel = (value, idx) => {
    if (value > 10 || value < 1) {
      setAllValid((prev) => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      });
    } else {
      setAllValid((prev) => {
        const updated = [...prev];
        updated[idx] = true;
        return updated;
      });
    }
  };

  useEffect(() => {
    if (allValid.includes(false)) {
      setStatus((prev) => ({
        ...prev,
        langs: {
          status: false,
          msg: "Level inputs contains invalid values",
        },
      }));
    } else {
      setStatus((prev) => ({
        ...prev,
        langs: {
          status: true,
          msg: "",
        },
      }));
    }
  }, [allValid]);

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
            {allLang.map((el, idx) => (
              <option
                value={el.name}
                selected={el.name === form.user_acpt_langs[0].lang_name}
                disabled={isDuplicated(el.name) || el.code === "" || idx === 0}
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
            onBlur={(e) => validateLevel(e.target.value, 0)}
            type="number"
            min={1}
            max={10}
            placeholder="Level 1-10"
          />
          <Form.Text muted>Language level</Form.Text>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Select
            className="mr-2"
            defaultValue="Select a language"
            onChange={(e) =>
              selectLangHandler({
                index: 1,
                name: e.target.value,
                type: "acpt",
                idx: e.target.selectedIndex,
              })
            }
          >
            {allLang.map((el) => (
              <option
                selected={el.name === form.user_acpt_langs?.[1]?.lang_name}
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
            value={form.user_acpt_langs?.[1]?.level}
            disabled={form.user_acpt_langs?.[1]?.lang_name ? false : true}
            onChange={(e) =>
              selectLevelHandler({
                type: "acpt",
                index: 1,
                level: e.target.value,
              })
            }
            onBlur={(e) => validateLevel(e.target.value, 1)}
            min={1}
            max={10}
            type="number"
            placeholder="Level 1-10"
          />
          <Form.Text muted>Language level</Form.Text>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Select
            className="mr-2"
            defaultValue="Select a language"
            onChange={(e) =>
              selectLangHandler({
                index: 2,
                name: e.target.value,
                type: "acpt",
                idx: e.target.selectedIndex,
              })
            }
          >
            {allLang.map((el) => {
              return (
                <option
                  selected={el.name === form.user_acpt_langs?.[2]?.lang_name}
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
            value={form.user_acpt_langs?.[2]?.level}
            disabled={form.user_acpt_langs?.[2]?.lang_name ? false : true}
            onChange={(e) =>
              selectLevelHandler({
                type: "acpt",
                index: 2,
                level: e.target.value,
              })
            }
            onBlur={(e) => validateLevel(e.target.value, 2)}
            min={1}
            max={10}
            type="number"
            placeholder="Level 1-10"
          />
          <Form.Text muted>Language level</Form.Text>
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
                idx: e.target.selectedIndex,
              })
            }
          >
            {allLang.map((el, idx) => {
              return (
                <option
                  selected={el.name === form.user_offer_langs[0].lang_name}
                  disabled={
                    isDuplicated(el.name) || el.code === "" || idx === 0
                  }
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
            onBlur={(e) => validateLevel(e.target.value, 3)}
            type="number"
            min={1}
            max={10}
            placeholder="Level 1-10"
          />
          <Form.Text muted>Language level</Form.Text>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Select
            className="mr-2"
            defaultValue="Select a language"
            onChange={(e) =>
              selectLangHandler({
                index: 1,
                name: e.target.value,
                type: "offer",
                idx: e.target.selectedIndex,
              })
            }
          >
            {allLang.map((el) => {
              return (
                <option
                  selected={el.name === form.user_offer_langs?.[1]?.lang_name}
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
            value={form.user_offer_langs?.[1]?.level}
            disabled={form.user_offer_langs?.[1]?.lang_name ? false : true}
            onChange={(e) =>
              selectLevelHandler({
                type: "offer",
                index: 1,
                level: e.target.value,
              })
            }
            onBlur={(e) => validateLevel(e.target.value, 4)}
            min={1}
            max={10}
            type="number"
            placeholder="Level 1-10"
          />
          <Form.Text muted>Language level</Form.Text>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Select
            className="mr-2"
            defaultValue="Select a language"
            onChange={(e) =>
              selectLangHandler({
                index: 2,
                name: e.target.value,
                type: "offer",
                idx: e.target.selectedIndex,
              })
            }
          >
            {allLang.map((el) => {
              return (
                <option
                  selected={el.name === form.user_offer_langs?.[2]?.lang_name}
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
            value={form.user_offer_langs?.[2]?.level}
            disabled={form.user_offer_langs?.[2]?.lang_name ? false : true}
            onChange={(e) =>
              selectLevelHandler({
                type: "offer",
                index: 2,
                level: e.target.value,
              })
            }
            onBlur={(e) => validateLevel(e.target.value, 5)}
            min={1}
            max={10}
            type="number"
            placeholder="Level 1-10"
          />
          <Form.Text muted>Language level</Form.Text>
        </Form.Group>
      </Row>
    </>
  );
};

export default LangGroup;
