import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { createZipcode, updateZipcode } from './graphql/mutations';
import { getZipcode } from './graphql/queries';
import Navigation from './Navigation';
import './App.css';

function Profile() {
  var [zipcode, setZipcode] = useState();  

  useEffect(() => {
    const getUserZipcode = async () => { 
      const user = await Auth.currentUserInfo();
      const sub = await user.attributes.sub;
      const zipcodeData = await API.graphql(graphqlOperation(getZipcode, {id: sub}));
      var userZipcode = null;
      if (zipcodeData.data.getZipcode !== null) {
        userZipcode = await await zipcodeData.data.getZipcode.zipcode;
      }
      if (userZipcode) {
        setZipcode(userZipcode)
      } else {
        setZipcode('You dont have one yet!');
      }
    }
    getUserZipcode();
  },[zipcode]);

  const updateUserZipcode = async (newZipcode) => {
    try {
      const user = await Auth.currentUserInfo();
      const sub = await user.attributes.sub;
      const graphqlEntry = { 'id': sub, 'zipcode': newZipcode };
      if (zipcode === 'You dont have one yet!') {
        await API.graphql(graphqlOperation(createZipcode, {input: graphqlEntry}));
      } else {
        await API.graphql(graphqlOperation(updateZipcode, {input: graphqlEntry}));
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newZipcode = e.target.elements.zipcode.value;
    updateUserZipcode(newZipcode);
    setZipcode(e.target.elements.zipcode.value);
  } 

  return (
    <div>

      <Navigation />

      <div className="center-div center-div-profile transparent p-5 rounded shadow">

        <h1>Profile</h1>

        <h6> Your current zipcode is: {zipcode}</h6>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicZipcode">
            <Form.Control type="text" name="zipcode" placeholder="Enter a new zip code"/>
            <Form.Text className="text">
              We'll never share your zip code with anyone else.
            </Form.Text>
          </Form.Group>
          <Button className="block" variant="dark" type="submit">
            Submit
          </Button>
        </Form>
        
      </div>
    </div>
  );
}

export default withAuthenticator(Profile);