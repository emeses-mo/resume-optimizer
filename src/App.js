import React, { useState } from 'react';
import JobSearchForm from './JobSearchForm';
import ResumeUpload from './ResumeUpload';

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');

  const handleJobSearch = async (role, location) => {
    // Simulated job search results
    const searchResults = [
      { title: 'Commercial Lawyer', company: 'Acme Corp', location: 'Manchester', description: 'Seeking a commercial lawyer for a growing team.' },
      { title: 'Insurance Analyst', company: 'Beta LLP', location: 'Liverpool', description: 'A role analyzing insurance claims and disputes.' }
    ];

    const filteredJobs = searchResults.filter(
      (job) => job.title.toLowerCase().includes(role.toLowerCase()) && job.location.toLowerCase().includes(location.toLowerCase())
    );
    setJobs(filteredJobs);
  };

  const handleResumeUpload = (resumeText) => {
    setResume(resumeText);
    console.log("Resume text:", resumeText);
  };

  const handleJobSelection = async (job) => {
    if (resume) {
      try {
        // Ensure resume is passed as plain text
        const resumeText = resume; // This should be the extracted resume text from the uploaded file
        const jobDescription = job.description;
  
        // Send resume text and job description to the backend API for optimization
        const optimizedResume = await handleResumeOptimization(resumeText, jobDescription);
        
        // Set the optimized resume in state and display it
        setOptimizedResume(optimizedResume);
      } catch (error) {
        console.error("Error optimizing resume:", error);
      }
    } else {
      console.log("Please upload a resume first.");
    }
  };
  

  const handleResumeOptimization = async (resumeText, jobDescription) => {
    const response = await fetch('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, jobDescription })
    });
  
    // Check for a successful response
    if (response.ok) {
      const data = await response.json();
      return data.result;  // Return the optimized resume text
    } else {
      throw new Error('Failed to optimize resume');
    }
  };
  

  return (
    <div>
      <h1>Job Search</h1>
      <JobSearchForm onSearch={handleJobSearch} />
      <ResumeUpload onResumeUpload={handleResumeUpload} />

      <div>
        <h2>Search Results</h2>
        {jobs.length > 0 ? (
          <ul>
            {jobs.map((job, index) => (
              <li key={index}>
                <h3>{job.title} - {job.company}</h3>
                <p>{job.location}</p>
                <p>{job.description}</p>
                <button onClick={() => handleJobSelection(job)}>Optimize Resume for This Job</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs found</p>
        )}
      </div>

      {optimizedResume && (
        <div>
          <h2>Optimized Resume:</h2>
          <p>{optimizedResume}</p>
        </div>
      )}
    </div>
  );
};

export default App;
