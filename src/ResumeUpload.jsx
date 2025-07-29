import React, { useState } from 'react';
import mammoth from 'mammoth';

const ResumeUpload = ({ onResumeUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        // Use Mammoth to extract text from the .docx file
        try {
          const { value: resumeText } = await mammoth.extractRawText({ arrayBuffer });
          onResumeUpload(resumeText); // Send extracted text to the parent component
        } catch (error) {
          console.error('Error extracting text from file:', error);
        }
      };

      reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="resume">Upload Resume</label>
        <input
          type="file"
          id="resume"
          accept=".docx"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit">Upload Resume</button>

      {file && <p>Uploaded Resume: {file.name}</p>}
    </form>
  );
};

export default ResumeUpload;
