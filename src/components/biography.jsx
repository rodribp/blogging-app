import { useEffect, useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { getBio, editBio } from "../api/sanity";
import { getUserId } from "../session";

const BioForm = () => {
    const id = getUserId();

    useEffect(() => {
      const bio = async () => {
        const bioFromSanity = await getBio(id);

        setBio(bioFromSanity ? bioFromSanity : 'No biography added');
      }

      bio();
    }, [])

    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState('');
    const [alert, setAlert] = useState(<></>)

    const handleEditButtonClick = () => {
      setIsEditing(true);
    };
  
    const handleSaveButtonClick = async () => {
      setAlert(<Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
      </Spinner>)
      let response = await editBio(id, bio);

      if (response) {
        setAlert(<Alert key='success' variant='success'>
                Biography edited succesfully
            </Alert>)
        setIsEditing(false);
      } else {
        setAlert(<Alert key='danger' variant='danger'>
                Error editing biography
            </Alert>)
      }
    };
  
    const handleBioChange = (e) => {
      setBio(e.target.value);
    };
  
    return (
      <Form>
        <Form.Group>
          {alert}
          <Form.Label>Biography:</Form.Label>
          <Form.Control
            name="bio"
            as="textarea"
            rows={3}
            disabled={!isEditing}
            value={bio}
            onChange={handleBioChange}
          />
        </Form.Group>
        {isEditing ? (
          <Button onClick={handleSaveButtonClick} type="button">
            Save
          </Button>
        ) : (
          <Button onClick={handleEditButtonClick} type="button">
            Edit
          </Button>
        )}
      </Form>
    );
  };
  
export default BioForm;