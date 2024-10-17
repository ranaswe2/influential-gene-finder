import React, { useEffect, useState } from "react";
import { Button, FormGroup, Form, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Table } from "reactstrap";
import profilePic from '../assets/img/mike.jpg';
import bg from '../assets/img/bg5.jpg';
import PanelHeader from "components/PanelHeader/PanelHeader.js";

function User() {
  const [userInfo, setUserInfo] = useState(null); // Initially null to check loading state
  const [editableUserInfo, setEditableUserInfo] = useState({});
  const [workHistory, setWorkHistory] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newProfilePic, setNewProfilePic] = useState(null);

  // Fetch user info on load
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in");
        return;
      }
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/info/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data); // Check the response structure
        setUserInfo(data[0] || data); // Adjust according to the structure
        setEditableUserInfo(data[0] || data); // Adjust accordingly
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
  
    fetchUserInfo();
  }, []);
  
  const [historyData, setHistoryData] = useState([]); // Initialize state for history data

  // Fetch user history data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust according to how you store the token
        const response = await fetch('http://127.0.0.1:8000/api/user/history/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the JWT token
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error('Failed to fetch history data:', error);
      }
    };
  
    fetchData();
  }, []);

  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    setNewProfilePic(e.target.files[0]);
  };

  // Handle user profile update
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("name", editableUserInfo.name);
    formData.append("profession", editableUserInfo.profession);
    if (newProfilePic) {
      formData.append("image", newProfilePic); // Upload profile picture
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/update/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      setUserInfo(data.user);
      setEditing(false);
      alert(data.message);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  // Loading state check
  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        {/* First Card: Edit Profile */}
        <Row>
          <Col md="8" xs={12}>
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
                          value={editableUserInfo.name || ""}
                          placeholder="Name"
                          type="text"
                          onChange={(e) => setEditableUserInfo({ ...editableUserInfo, name: e.target.value })}
                          disabled={!editing}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="8">
                      <FormGroup>
                        <label>Email</label>
                        <Input
                          value={editableUserInfo.email || ""}
                          placeholder="Email"
                          type="text"
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="8">
                      <FormGroup>
                        <label>Profession</label>
                        <Input
                          value={editableUserInfo.profession || ""}
                          placeholder="Profession"
                          type="text"
                          onChange={(e) => setEditableUserInfo({ ...editableUserInfo, profession: e.target.value })}
                          disabled={!editing}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {editing && (
                    <Row>
                      <Col md="8">
                        <FormGroup>
                          <label>Upload New Profile Picture</label>
                          <Input type="file" onChange={handleProfilePicChange} />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                  <Button color="primary" onClick={() => setEditing(!editing)}>
                    {editing ? "Cancel Edit" : "Edit Profile"}
                  </Button>
                  {editing && (
                    <Button color="success" onClick={handleUpdateProfile} style={{ marginLeft: "10px" }}>
                      Save Changes
                    </Button>
                  )}
                </Form>
              </CardBody>
            </Card>
          </Col>

          {/* Second Card: Profile Picture */}
          <Col md="4" xs={12}>
            <Card className="card-user">
              <div className="image">
                <img alt="..." src={bg} />
              </div>
              <CardBody>
                <div className="author">
                  <img
                    alt="..."
                    className="avatar border-gray"
                    src={`http://127.0.0.1:8000${userInfo.image_path || profilePic}`}
                  />
                  <h5 className="title">{userInfo.name}</h5>
                  <p className="description">{userInfo.email}</p>
                  <p className="description">{userInfo.profession}</p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Third Card: Work History Table */}
        <Row>
      <Col xs={12}>
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Your Work History</CardTitle>
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead className="text-primary">
                <tr>
                  <th>Dataset File</th>
                  <th>Splitting Column</th>
                  <th>IFG File</th>
                  <th>Drug Candidate File</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((dataset) =>
                  dataset.influential_genes.map((gene, geneIndex) => (
                    <tr key={`${dataset.dataset_path}-${geneIndex}`}>
                      <td>
                        {
                          <a href={dataset.dataset_path} download>
                          {dataset.dataset_path.match(/[^/\\&?]+\.\w{3,4}(?=([?&].*$|$))/)[0]})
                        </a>}
                      </td>
                      <td>{gene.splitting_columns}</td>
                      <td>
                        {gene.ifg_file_path ? (
                          <a href={gene.ifg_file_path} download>
                            Download IFG File
                          </a>
                        ) : (
                          'No IFG File'
                        )}
                      </td>
                      <td>
                        {gene.drug_candidates.length > 0 ? (
                          gene.drug_candidates.map((drug, drugIndex) => (
                            <div key={`${geneIndex}-drug-${drugIndex}`}>
                              <a href={drug.dsigdb_path} download>
                                Download Drug Candidate File
                              </a>
                            </div>
                          ))
                        ) : (
                          'No Drug Candidates'
                        )}
                      </td>
                    </tr>
                  ))
                )}
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
