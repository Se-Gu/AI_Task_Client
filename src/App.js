import React, { useState } from "react";
import axios from "axios";
import { Grid, Paper, TextField, Button } from "@material-ui/core";
import { ProgressBar, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [labels, setLabels] = useState([]);
  const [scores, setScores] = useState([]);
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add a state variable for loading status

  const translations = {
    "house rental": "kiralık ev",
    phone: "telefon",
    car: "araç",
    "real estate": "emlak",
    clothing: "giyim",
  };

  const translateLabel = (label) => {
    return translations[label] || label;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/classify", {
        text: inputText,
      });
      setOutputText(
        response.data.sequence
          .substring(response.data.sequence.indexOf(":") + 1)
          .trim()
      );
      setLabels(response.data.labels.map(translateLabel));
      setScores(response.data.scores);
    } catch (error) {
      console.error(error);
      setOutputText("Error processing text");
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", height: "100vh" }}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} md={6}>
          <Paper
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <form onSubmit={handleSubmit}>
              <TextField
                label="Enter text"
                variant="outlined"
                margin="normal"
                fullWidth
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </form>
            {outputText && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <h1>Çeviri:</h1>
                <div>{outputText}</div>
                <h1>Kategoriler:</h1>
                {labels.map((label, index) => (
                  <div key={index} className="my-2">
                    <p>{label}</p>
                    <ProgressBar now={scores[index] * 100} srOnly />
                  </div>
                ))}
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
