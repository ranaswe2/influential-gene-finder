
import React from "react";
import profilePic from '../assets/img/mike.jpg';
import bg from '../assets/img/bg5.jpg';

import { thead, tbody } from "variables/general";
import { FormGroup, Form, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Table } from "reactstrap";



// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";

function User() {
  return (
    <>
      <PanelHeader size="sm"/>
      <div className="content" >
        <Row>
          <Col md="8"  xs={12}>
            <Card>
              <CardHeader>
                <h5 className="title">Edit Profile</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                   <Col className="pr-1" md="8">
                      <FormGroup>
                        <label>Name</label>
                        <Input
                          defaultValue="Mike"
                          placeholder="Company"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                   <Col className="pr-1" md="8">
                      <FormGroup>
                        <label>Email</label>
                        <Input
                          defaultValue="kader.bd@gmail.com"
                          disabled
                          placeholder="Company"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="8">
                      <FormGroup>
                        <label>Profession</label>
                        <Input
                          defaultValue="Professor of Theif Technology"
                          placeholder="Home Address"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="8">
                      <FormGroup>
                        <label>Joined From</label>
                        <Input
                          defaultValue="Nov 1, 2024"
                          disabled
                          placeholder="Home Address"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col md="4"  xs={12}>
            <Card className="card-user">
              <div className="image">
                <img alt="..." src={bg} />
              </div>
              <CardBody>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={profilePic}
                    />
                    <h5 className="title">Obaydul Kader</h5>
                  </a>
                  <p className="description">kader.bd@gmail.com</p>
                  <p className="description">Professor of Theif Technology</p>
                </div>
                
              </CardBody>
            </Card>
          </Col>

        </Row>

        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                
              <CardTitle tag="h4">Your Work History</CardTitle>
                <CardTitle tag="h4"></CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      {thead.map((prop, key) => {
                        if (key === thead.length - 1)
                          return (
                            <th key={key} className="text-right">
                              {prop}
                            </th>
                          );
                        return <th key={key}>{prop}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {tbody.map((prop, key) => {
                      return (
                        <tr key={key}>
                          {prop.data.map((prop, key) => {
                            if (key === thead.length - 1)
                              return (
                                <td key={key} className="text-right">
                                  {prop}
                                </td>
                              );
                            return <td key={key}>{prop}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    </>
  );
}

export default User;
