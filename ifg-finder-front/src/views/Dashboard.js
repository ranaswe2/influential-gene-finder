import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Table } from "reactstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const [disease, setDisease] = useState("");
  const [datasetFile, setDatasetFile] = useState(null);
  const [splittingColumns, setSplittingColumns] = useState('');
  const [datasetId, setDatasetId] = useState(null);
  const [ifgId, setIfgId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const [totalGenes, setTotalGenes] = useState(0);
  const [columns, setColumns] = useState(0);
  const [influentialGenes, setInfluentialGenes] = useState([]);
  const [fullDataset, setFullDataset] = useState([]);
  const [drugCandidates, setDrugCandidates] = useState([]);
  const [tbody, setTbody] = useState([]);
  const [drugCandidatesFile, setDrugCandidatesFile] = useState("");
  const thead = ["Drug Name", "P-value", "Targeted Influential Genes"];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in");
        
        navigate('/login');
      }
    };
  
    fetchUserInfo();
  }, [navigate]);

  // Function to handle file input change
  const handleFileChange = (e) => {
    setDatasetFile(e.target.files[0]);
  };

  // Upload dataset API call
  const uploadDataset = async () => {
    if (!disease || !datasetFile) {
      alert("Please select a file and provide disease name");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("disease", disease);
    formData.append("dataset_path", datasetFile);

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You are not logged in");
    return;
  }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/dataset/upload/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setDatasetId(data.dataset_id); // Save dataset_id for later
        alert("Dataset uploaded successfully");
        // Fetch and display dataset information
        fetchDatasetInfo(data.dataset.dataset_path);
      } else {
        alert("Error uploading dataset");
      }
    } catch (error) {
      console.error("Error during dataset upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch dataset info from CSV
  const fetchDatasetInfo = async (datasetPath) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000${datasetPath}`);
      const text = await response.text();
      const rows = text.split("\n");
      const columns = rows[0].split(",").length;
      setTotalGenes(rows.length - 1); // Minus header
      setColumns(columns-1);
    } catch (error) {
      console.error("Error fetching dataset info:", error);
    }
  };

  // Find influential genes API call
  const findInfluentialGenes = async () => {
    if (!datasetId || !splittingColumns) {
      alert("Please upload dataset and provide splitting column");
      return;
    }

    setIsFinding(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/ifg/find/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataset_id: datasetId, splitting_columns: splittingColumns }),
      });

      if (response.ok) {
        const data = await response.json();
        setIfgId(data.ifg_dataset_id); // Store ifg_dataset_id for later
        alert("Influential genes identified");
        // Fetch and display influential genes
        fetchInfluentialGenes(data.ifg_file.ifg_file_path);
      } else {
        alert("Error finding influential genes");
      }
    } catch (error) {
      console.error("Error finding influential genes:", error);
    } finally {
      setIsFinding(false);
    }
  };

  // Fetch influential genes info from CSV
  const fetchInfluentialGenes = async (ifgFilePath) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000${ifgFilePath}`);
      const text = await response.text();
      const rows = text.split("\n").slice(1); // Skip header
      const genes = rows.map((row) => row.split(",")[0]); // Get gene names
      const totalIFGs = genes.length
      setInfluentialGenes(genes);
      setFullDataset(rows);
    } catch (error) {
      console.error("Error fetching influential genes:", error);
    }
  };

  // Download PDF report for influential genes
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Influential Genes Report", 20, 10);
    const columns = ["Gene Name (Hugo Symbol)", "P Value", "Adjusted P Value"];
    const rows = fullDataset.map((row) => row.split(","));
    doc.autoTable({
      startY: 20,
      head: [columns],
      body: rows,
    });
    doc.save("influential-genes-report.pdf");
  };


  
  // Fetch drug candidates based on influentialgene_id
  const fetchDrugCandidates = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in");
      return;
    }

    try {
      console.log("ID =" +ifgId)
      const response = await fetch("http://127.0.0.1:8000/api/drug/find/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ influentialgene_id: ifgId }),
      });

      if (response.ok) {
        const data = await response.json();
        const filePath = data.drug_candidate.dsigdb_path;
        setDrugCandidatesFile(filePath); // Save file path for later use
        fetchAndDisplayFileData(filePath); // Display file data in the table
      } else {
        alert("Error fetching drug candidates");
      }
    } catch (error) {
      console.error("Error fetching drug candidates:", error);
    }
  };

  // Fetch and parse CSV file data from the given file path
  const fetchAndDisplayFileData = async (filePath) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000${filePath}`);
      const fileData = await response.text();
      const rows = fileData.split("\n");

      const tableData = rows.map((row) => {
        const columns = row.split(",");
        return {
          data: [columns[0], columns[1], columns[2]], // Assuming drug name, p-value, and gene list
          className: "",
        };
      });

      setTbody(tableData); // Update table body data
    } catch (error) {
      console.error("Error fetching and parsing CSV:", error);
    }
  };

  // Generate PDF from the table data
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Drug Candidates Table", 20, 10);

    doc.autoTable({
      head: [thead],
      body: tbody.map((row) => row.data),
    });

    doc.save("drug_candidates.pdf");
  };


  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        {/* Dataset Upload Section */}
        <Row>
          <Col xs={12}>
            <Card>
              <CardBody>
                <Input
                  type="text"
                  placeholder="Disease Name"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                />
                <Input
                  type="file"
                  onChange={handleFileChange}
                />
                <Button color="primary" onClick={uploadDataset} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload Dataset"}
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Dataset Info Cards */}
        <Row>
          <Col xs={12} md={4}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Dataset Info</CardTitle>
              </CardHeader>
              <CardBody>
              {isUploading ? "Preprocessing..." : " "}
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Total Genes</CardTitle>
              </CardHeader>
              <CardBody>
                <h1>{totalGenes}</h1>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Total Columns</CardTitle>
              </CardHeader>
              <CardBody>
                <h1>{columns}</h1>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Influential Genes Section */}
        <Row>
          <Col xs={12}>
            <Card>
              <CardBody>
                <Input
                 className="text-center"
                  type="text"
                  placeholder="Splitting Columns"
                  onChange={(e) => setSplittingColumns(e.target.value)}
                />
                <Button className="text-right" color="primary" onClick={findInfluentialGenes}>
                  
                  {isFinding ? "Finding..." : "Find Influential Genes"}
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Influential Genes Info */}
        <Row>
          <Col xs={12} md={4}>
            <Card>
              <CardHeader>
              <h5 className="card-category">Influential Genes</h5>
              <CardTitle tag="h4">Identified Influential Genes        ************************  </CardTitle>
              
              </CardHeader>
              <CardBody>
                <ol>
                  {influentialGenes.map((gene, index) => (
                    <li key={index}>{gene}</li>
                  ))}
                </ol>
              </CardBody>
            </Card>
          </Col>

          {/* Full Dataset and PDF Download */}
          <Col xs={12} md={8}>
            <Card>
              <CardHeader>
              <h5 className="card-category">Influential Genes</h5>
                <CardTitle tag="h4">Statistical Report</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Gene Name (Hugo Symbol)</th>
                      <th>P Value</th>
                      <th>Adjusted P Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullDataset.map((row, index) => {
                      const cells = row.split(",");
                      return (
                        <tr key={index}>
                          <td>{cells[0]}</td>
                          <td>{cells[1]}</td>
                          <td>{cells[2]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <Button color="primary" onClick={downloadPDF}>
                  Download PDF
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>


          {/* Trigger Button to Fetch Drug Candidates */}
      <Row>
        <Col xs={12} md={12}>    
          <Card className="card-tasks">
            <CardBody>
              <Table responsive>
                <tbody>
                  <tr>
                    <td className="simple-text text-right" color="primary"></td>
                    <td className="text-center">
                      <Button color="primary" onClick={fetchDrugCandidates}>Identify Drug Candidates</Button>
                    </td>
                    <td className="text-left"></td>
                  </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Table to Display Drug Candidates */}
      <Row>
        <Col xs={12}>
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Drug Candidates For The Current Dataset</CardTitle>
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead className="text-primary">
                  <tr>
                    {thead.map((prop, key) => (
                      <th key={key}>{prop}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tbody.map((prop, key) => (
                    <tr key={key} className={prop.className}>
                      {prop.data.map((cell, cellKey) => (
                        <td key={cellKey}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button color="primary" onClick={generatePDF}>
                Download PDF
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <p className="category">* These data are experimental, Further needs to be Lab Test</p>
    
      </div>
    </>
  );
}

export default Dashboard;
