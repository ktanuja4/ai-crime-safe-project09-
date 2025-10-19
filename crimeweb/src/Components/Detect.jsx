import React, { useState } from 'react';
import detectback from "../images/image2.png";
import "../Styles/detect.css";
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';

const Detect = () => {
  const [file, setFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [urlResult, setUrlResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [urlToAnalyze, setUrlToAnalyze] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.warning('Please select a file.');
      return;
    }

    setUrlResult('');
    setAnalysisResult(''); // Clear previous results before starting a new analysis
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/analyse-file`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unknown error occurred during analysis.');
      }

      // Just store the result from the backend
      console.log(result.result)
      setAnalysisResult(result.result);
      toast.success('File analysis successful!');
    } catch (error) {
      console.error('Error analyzing file:', error);
      // Display the specific error message
      setAnalysisResult(`Error: ${error.message}`);
      toast.error(error.message || 'Error analyzing file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = (event) => {
    setUrlToAnalyze(event.target.value);
  };

  const handleUrlSubmit = async (event) => {
    event.preventDefault();
    if (!urlToAnalyze.trim()) {
      toast.warning('Please enter a URL.');
      return;
    }

    setIsLoading(true);
    setAnalysisResult('');
    setAnalysisResult('');

    try {
      const response = await fetch(`${API_URL}/scam/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToAnalyze }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze URL.');
      }
      setUrlResult(result.result || 'URL analysis complete.');
      toast.success('URL analysis successful!');
    } catch (error) {
      console.error('Error analyzing URL:', error);
      setUrlResult(`Error: ${error.message}`);
      toast.error(error.message || 'Error analyzing URL.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="detect">
      <div className='Detect-background' style={{ backgroundImage: `url(${detectback})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', width: '100%' }}>
        <h1>CRIME DETECTION</h1>
        <p>UPLOAD CRIME RELATED DATA FOR AI ANALYSIS</p>
        
        <div className="analyse-data">
          <form onSubmit={handleFileSubmit}>
            <p>Select File</p>
            <input type="file" className="detect-file-input" onChange={handleFileChange} accept=".pdf,.txt" id="file-upload-input" />
            {file && <span className="file-selected-tick">  <FaCheck /> {file.name}</span>}
            {file && <button type="submit" className="FileAnalyse" disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyse'}
            </button>}
          </form>
        </div>

        {/* Conditionally render the results block only when there's a result */}
        {analysisResult && (
          <div className="analysis-result-container">
            <p>Analysis Result:</p>
            {/* Apply a different class based on the result for styling */}
            <p className={`analysis-result ${
              analysisResult.includes('SPAM') ? 'spam' : 
              analysisResult.includes('NOT SPAM') ? 'not-spam' : 
              'error'
            }`}>{analysisResult}</p>
          </div>
        )}

        <div className="analyse-url">
          <form onSubmit={handleUrlSubmit}>
            <p>Enter URL</p>
            <input type="text" className="detect-url-input" placeholder='Enter url' value={urlToAnalyze} onChange={handleUrlChange} required />
            {urlToAnalyze && <button type="submit" className="Analysis" disabled={isLoading}>
              {isLoading ? 'Classifying...' : 'Classify'}
            </button>}
          </form>
        </div>
        {/* Conditionally render the URL results block only when there's a result */}
        {urlResult && (
          <div className="Classify-result-container">
            <p>Analysis Result:</p>
            {/* Apply a different class based on the result for styling */}
            <p className={`classify-result ${
              urlResult.includes('Malicious') ? 'Malicious' :
              urlResult.includes('Benign') ? 'Benign' :
              'error'
             }`}>{urlResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Detect;