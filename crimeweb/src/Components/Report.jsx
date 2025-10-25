import reportback from "../images/image2.png"
import "../Styles/report.css"

import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

const Report = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  // to manage loading state during form submission
  const [isLoading, setIsLoading] = useState(false);
  // for real-time details analysis
  const [detailsAnalysis, setDetailsAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

 

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  // This effect will run to analyze the 'details' text as the user types.
  useEffect(() => {
    // A debounce function to prevent sending a request on every keystroke.
    const handler = setTimeout(() => {
      const currentCrimeDetails = details;
      if (currentCrimeDetails.trim() === '') {
        setDetailsAnalysis(''); // Clear analysis if input is empty
        return;
      }

      const analyzeDetails = async () => {
        setIsAnalyzing(true);
        try {
          const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: currentCrimeDetails })
          });
          const result = await response.json();
          if (response.ok && result.results && result.results.length > 0) {
            setDetailsAnalysis(result.results[0]);
          } else {
            throw new Error(result.error || 'Failed to get analysis.');
          }
        } catch (error) {
          console.error('Error analyzing details:', error);
          setDetailsAnalysis('Analysis failed');
        } finally {
          setIsAnalyzing(false);
        }
      };

      analyzeDetails();
    }, 500); // Wait 500ms after user stops typing.

    // Cleanup function to cancel the timeout if the user types again.
    return () => clearTimeout(handler);
  }, [details, API_URL]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = { name, email, phone, details };
    try {
      const response = await fetch(`${API_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Report submitted successfully!');
        // Clear form on success
        setName('');
        setEmail('');
        setPhone('');
        setDetails('');
      } else {
        // If the server returns an error, display it
        throw new Error(result.message || 'Failed to submit report.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  
  // ... later in the JSX
  
  return (
    <div id="report" className='Report-background' style={{ backgroundImage: `url(${reportback})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', width: '100%' }}>
      <h1>Report a crime</h1>
      <p>Fill Up Form Detail</p>
      <form className="report-form" onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" placeholder=' Enter your Name' required value={name} onChange={e => setName(e.target.value)} />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" placeholder='Enter your Email' required value={email} onChange={e => setEmail(e.target.value)} />

        <label htmlFor="phone">Phone No.:</label>
        <input type="tel" id="phone" name="phone" pattern="[0-9]{10}" placeholder='Enter your mobile number' required value={phone} onChange={e => setPhone(e.target.value)} />

        <label htmlFor="details">Crime Details:</label>
        <textarea id="details" name="details" rows="4" placeholder='Give crime details' required value={details} onChange={e => setDetails(e.target.value)}></textarea>

        {/* Display the real-time analysis result */}
        {(isAnalyzing || detailsAnalysis) && (
          <div className="details-analysis-container">
             <p className={`details-analysis-result ${detailsAnalysis === 'SPAM' ? 'spam' : 'not-spam'}`}>
              {isAnalyzing ? 'Analyzing...' : `Content Type: ${detailsAnalysis}`}
            </p>
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}

export default Report