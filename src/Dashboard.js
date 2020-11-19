import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Button, Form, Table, Col } from 'react-bootstrap';
import Navigation from './Navigation';
import Zipcodes from 'zipcodes';
import { getZipcode } from './graphql/queries';
import './App.css';
import './Dashboard.css';

function Dashboard() {
  var [items, setItems] = useState([]);  
  var [zipcode, setZipcode] = useState(); 

  useEffect(() => {
    const getUserZipcode = async () => {
      if (zipcode) {
        return zipcode;
      }  
      const user = await Auth.currentUserInfo();
      const sub = await user.attributes.sub;
      const userZipcode = await fetchZipcode(sub);
      if (userZipcode) {
        return userZipcode.zipcode;
      } else {
        return 98662;
      }
    }
    const fetchForecast = async () => {
      const currentZipcode = await getUserZipcode();
      const coordinates = await Zipcodes.lookup(currentZipcode);
      const stationData = await fetch('/points/' + coordinates.latitude + ',' + coordinates.longitude);
      const station = await stationData.json();
      const gridId = await station.properties.gridId;
      const gridX = await station.properties.gridX;
      const gridY = await station.properties.gridY;
      const forecastData = await fetch('/gridpoints/' + gridId + '/' + gridX + ',' + gridY + '/forecast');
      const forecast = await forecastData.json();
      console.log(forecast.properties.periods);
      setItems(forecast.properties.periods);
    }
    fetchForecast();
  },[zipcode]);

  const fetchZipcode = async (sub) => {
    try {
      const zipcodeData = await API.graphql(graphqlOperation(getZipcode, {id: sub}));
      const zipcode = await zipcodeData.data.getZipcode;
      setZipcode(zipcode.zipcode);
      return zipcode;
    } catch (e) {
      console.log(e);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setZipcode(e.target.elements.zipcode.value);
  } 

  return (
    <>
      <Navigation />

      <div className="center-div center-div-dashboard transparent p-5 rounded shadow">

        <h1>Forecast for: {zipcode}</h1>
  
        <Table responsive className="transparent" variant="dark">
        <thead> 
          <tr className="transparent" key="forecast-data">
            {items.map(item => (
              <React.Fragment key={item.name}>
                <td>{item.name}</td>
              </React.Fragment> 
            ))}
          </tr>
        </thead>

        <tbody>
          <tr key="forecast-data-image">
            {items.map(item => (
              <React.Fragment key={"image-" + item.name}>
                <td><img src={item.icon} alt={item.shortForecast} /></td>
              </React.Fragment>
            ))}
          </tr>
          <tr key="forecast-data-summary">
            {items.map(item => (
              <React.Fragment key={"summary-" + item.name}>
                <td>{item.shortForecast}</td>
              </React.Fragment>
            ))}
          </tr>
        </tbody>
        </Table>

        <Form onSubmit={handleSubmit} autoComplete="off">
          <Form.Group controlId="formBasicZipcode">
            <Form.Row className="align-right">
              <Col xs={6}>
                <Form.Control type="text" name="zipcode" placeholder="Enter zip code"/>
              </Col>
              <Col xs={1}>
                <Button variant="dark" type="submit">
                  Submit
                </Button>
              </Col>
            </Form.Row>
          </Form.Group>
        </Form>
        
      </div>
    </>
  );
}

export default withAuthenticator(Dashboard);
