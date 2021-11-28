import React, { useState, useEffect, useContext } from "react";
import { PopBoxCxt } from "../component/contexts";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { uploadPic } from "../api";

const UploadAvatar = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const { setPopbox } = useContext(PopBoxCxt);
  const [status, setStatus] = useState({
    status: null,
    msg: "",
  });
  const onImageUpload = async () => {
    const formData = new FormData();

    formData.append("image", image, image.name);

    try {
      const res = await uploadPic(formData);
      if (res.data.errorCode !== 0) {
        setStatus({
          status: false,
          msg: res.data.message,
        });
      } else {
        setStatus({
          status: true,
          msg: res.data.message,
        });
        navigate("/dashboard");
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
    <div className="home-bg">
      <Container>
        <Card className="text-center center register">
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
                Allowed extensions: .jpg, .jpe, .jpeg, .png, .gif, .svg, .bmp )
              </Form.Text>
            </Form.Group>
            <Button
              className="mb-3"
              onClick={onImageUpload}
              variant="light"
              type="button"
            >
              Upload
            </Button>
            <Link to="/dashboard">
              <Button className="mb-3" variant="light" type="button">
                Skip this step
              </Button>
            </Link>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default UploadAvatar;
