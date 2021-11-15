import React, { useState, useEffect, useContext } from "react";
import { PopBoxCxt } from '../component/contexts'
import Form from "react-bootstrap/Form";
import InputGroup from 'react-bootstrap/InputGroup'
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container'
import { uploadPic } from "../api";

const UploadAvatar = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null)
    const { setPopbox } = useContext(PopBoxCxt);
    const [status, setStatus] = useState({
      status: null,
      msg: "",
    });
    const onImageUpload = async () => {
      // Create an object of formData
      const formData = new FormData();

      // Update the formData object
      formData.append("image", image, image.name);

      // Details of the uploaded file
      console.log(image);

      // Request made to the backend api
      // Send formData object
      try {
        const res = await uploadPic(formData);
        if(res.data.errorCode !== 0){
            setStatus({
                status:false,
                msg:res.data.message
            })
        } else{
            setStatus({
                status:true,
                msg:res.data.message
            })
            navigate("/dashboard");
        }
      } catch (error) {
          console.error(error);
			setPopbox({
          isShow: true,
          content: "Server error"
        });
      }
      
    };

    return (
      <div className="home-bg">
        <Container>
          <Card className="text-center center register">
            <Card.Header>Register</Card.Header>
            <Form>
              <Form.Group className="mb-3 p-3">
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
                  Allowed extensions: .jpg, .jpe, .jpeg, .png, .gif, .svg, .bmp
                  )
                </Form.Text>
              </Form.Group>
              <Button className="mb-3" onClick={onImageUpload} variant="light" type="button">
                Upload
              </Button>
            </Form>
          </Card>
        </Container>
      </div>
    );
}

export default UploadAvatar
