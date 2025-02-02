import React, { useState, useContext } from 'react';
import { SupabaseContext } from '../context/SupabaseContext';

function JobSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { supabase } = useContext(SupabaseContext);

  const handleSearch = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .ilike('title', `%${searchTerm}%`);
      if (error) {
        console.error('Error searching jobs:', error);
      } else {
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching jobs:', error);
    }
  };

  return (
    <div className="search-container">
      <h1>Job Search</h1>
      <input
        type="text"
        placeholder="Search by job title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {searchResults.map((job, index) => (
        <div key={index} className="job-card">
          <h3>{job.title}</h3>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p>{job.description.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}

export default JobSearch;
