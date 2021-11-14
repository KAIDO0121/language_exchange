import React, { useState, useContext } from "react";
import { PopBoxCxt } from '../component/contexts'
import Form from "react-bootstrap/Form";
import InputGroup from 'react-bootstrap/InputGroup'
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { getAllLang, getMyLangs, editProfile } from "../api";

const Search = () => {
    const { setPopbox } = useContext(PopBoxCxt);
    const [form, setForm] = useState({
        user_offer_lang: [
          {
            lang_name: "Chinese",
            level: 3,
          },
          {
            lang_name: "Swedish",
            level: 6,
          },
          {
            lang_name: "Danish",
            level: 6,
          },
        ],
        user_acpt_lang: [
          {
            lang_name: "Chinese",
            level: 3,
          },
          {
            lang_name: "Swedish",
            level: 3,
          },
          {
            lang_name: "Arabic",
            level: 3,
          },
        ],
    });
    const [allLang, setAllLang] = useState([]);
  
    const [status, setStatus] = useState({
      status: null,
      msg: "",
    });
    return (
        <div className="bg2">
            <Card className="text-center center">
                <Card.Body>
                    <Form>

                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Search