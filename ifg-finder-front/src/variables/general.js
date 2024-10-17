
import { useState, useEffect } from 'react';

const DrugCandidatesTable = ({ ifgId }) => {
  const [drugCandidates, setDrugCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDrugCandidates = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/drug/find/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ influentialgene_id: ifgId }),
      });

      if (response.ok) {
        const data = await response.json();
        const csvPath = data.drug_candidate.dsigdb_path;
        fetchCsvData(csvPath); // Fetch the CSV data from the path
      } else {
        alert("Error fetching drug candidates");
      }
    } catch (error) {
      console.error("Error fetching drug candidates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCsvData = async (csvPath) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000${csvPath}`);
      const text = await response.text();
      const rows = text.split("\n").map((row) => row.split(","));
      setDrugCandidates(rows);
    } catch (error) {
      console.error("Error fetching CSV data:", error);
    }
  };

  useEffect(() => {
    if (ifgId) {
      fetchDrugCandidates();
    }
  }, [ifgId]);

  return { drugCandidates, isLoading };
};


const tasks = [
  {
    checked: true,
    text: 'G',
  },
  {
    checked: false,
    text: "V",
  },
  {
    checked: true,
    text: "C",
  },
];

// ##############################
// // // table head data and table body data for Tables view
// #############################

const thead = ["Drug Name", "P-value", "Targeted Influential Genes"];
const tbody = [
  {
    className: "table-success",
    data: ["0175029-0000 PC3 DOWN", "0.0092", " DDX5, ING2, SYNJ2 and CAMSAP1"],
  },
  {
    className: "",
    data: ["doxorubicin PC3 DOWN", "0.0073", "ING2, SYNJ2, and CAMSAP1"],
  },
  {
    className: "table-info",
    data: ["H-7 MCF7 DOWN", "0.001654", "ING2, SYNJ2, and CAMSAP1"],
  },
  {
    className: "",
    data: ["0175029-0000 MCF7 DOWN", "0.001564", "ING2, SYNJ2, and CAMSAP1"],
  },
  {
    className: "table-danger",
    data: ["camptothecin MCF7 DOWN", "0.005634", "ING2, SYNJ2, and CAMSAP1"],
  },
  { className: "", 
    data: ["sanguinarine HL60 DOWN", "0.0056728", "SYNJ2, CAMSAP1"] 
  },
  {
    className: "table-warning",
    data: ["digoxin HL60 DOWN", "0.00356", "SYNJ2, CAMSAP1"],
  },
  { className: "", 
    data: ["azacitidine MCF7 DOWN", "0.00736", "SYNJ2, CAMSAP1"] 
  },
  {
    className: "table-warning",
    data: ["helveticoside HL60 DOWN", "0.00234", "SYNJ2, CAMSAP1"],
  },
  { className: "", 
    data: ["ouabain HL60 DOWN", "0.006783", "SYNJ2, CAMSAP1"] 
  },
  {
    className: "table-warning",
    data: ["lanatoside C HL60 DOWN", "0.0023441", "SYNJ2, CAMSAP1"],
  },
  { className: "", 
    data: ["proscillaridin HL60 DOWN", "0.00783", "SYNJ2, CAMSAP1"] 
  },
  {
    className: "table-warning",
    data: ["digoxigenin HL60 DOWN", "0.01853", "SYNJ2, CAMSAP1"],
  },
  { className: "", 
    data: ["digitoxigenin PC3 DOWN", "0.0067231", "SYNJ2, CAMSAP1"] 
  },
  {
    className: "table-warning",
    data: ["digitoxigenin HL60 DOWN", "0.007143", "SYNJ2, CAMSAP1"],
  },
  { className: "", 
    data: ["doxorubicin MCF7 DOWN", "0.00085", "ING2, CAMSAP1"] 
  },
  {
    className: "table-warning",
    data: ["alsterpaullone PC3 DOWN", "0.001734", "ING2, CAMSAP1"],
  },
];

// tasks list for Tasks card in Dashboard view
// data for <thead> of table in TableList view
// data for <tbody> of table in TableList view
export { tasks, thead, tbody };
