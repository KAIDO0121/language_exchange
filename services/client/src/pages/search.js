import React, { useState, useContext } from "react";
import { PopBoxCxt } from '../component/contexts'
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useSelLang } from "../component/hook";
import { matchUserByLang } from "../api";
import LangGroup from "../component/langGroup";

const Search = () => {
    const { setPopbox } = useContext(PopBoxCxt);
    
    const { allLang, selectLevelHandler, selectLangHandler, selLang } =
		useSelLang();

    const submit = async () => {

      try {
        const response = await matchUserByLang(selLang);
        
        /*
        if (response.data.errorCode === 2) {
          setStatus(prev => ({
            ...prev,
            username: {
              status: false,
              msg: response.data.message
            }
          }));
        } 
        */
      } catch (error) {
        console.error(error);
        setPopbox({
          isShow: true,
          content: "Server error",
        });
      }
      
  }
  

    return (
      <div className="bg2">
        <Card className="text-center center">
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
              Find Partners
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
}

export default Search