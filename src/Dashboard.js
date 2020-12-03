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

      const error = {
        'name': 'The forecast for ' + currentZipcode + ' is currently unavalible',
        'icon': '/images/sad.png'
      }

      const coordinates = await Zipcodes.lookup(currentZipcode);

      if (coordinates !== undefined) {
        const stationData = await fetch('https://api.weather.gov/points/' + coordinates.latitude + ',' + coordinates.longitude, { "User-Agent" : ('my-weather','bmikailenko@gmail.com') })
        const station = await stationData.json();
        const gridId = await station.properties.gridId;
        const gridX = await station.properties.gridX;
        const gridY = await station.properties.gridY;
        const forecastData = await fetch('https://api.weather.gov/gridpoints/' + gridId + '/' + gridX + ',' + gridY + '/forecast', { "User-Agent"   : ('my-weather','bmikailenko@gmail.com') });
        const forecast = await forecastData.json();
        if (forecast.properties !== undefined) {
          setItems(forecast.properties.periods);
        } else {
          setItems([error]);
        }  
      } else {
        setItems([error]);
      }  
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
      console.log('You dont have a zipcode with us yet!');
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

        {(items[0]) ? (
          <>
             <h1>{items[0].temperature}°F</h1>
             <img src={items[0].icon} alt={items[0].shortForecast} />
             <p>
               {items[0].detailedForecast}
            </p>
          </>
        ) :
          <>
            Loading data...
          </>
        }


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

        <div style={{position: "relative", right:"60vh", color: "rgba(255, 255, 255, 0.8)"}}>
          {(zipcode) ? (zipcode) : (98662)}
        </div>

        
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
