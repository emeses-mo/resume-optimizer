import React, { useState } from 'react';

const JobSearchForm = ({ onSearch }) => {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the parent function to search jobs
    onSearch(role, location);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="role">Job Role</label>
        <input
          type="text"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Lawyer, Software Developer"
        />
      </div>
      <div>
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Manchester, Liverpool"
        />
      </div>
      <button type="submit">Search Jobs</button>
    </form>
  );
};

export default JobSearchForm;
