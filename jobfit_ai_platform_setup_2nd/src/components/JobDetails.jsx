import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SupabaseContext } from '../context/SupabaseContext';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const { supabase } = useContext(SupabaseContext);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();
        if (error) {
          console.error('Error fetching job details:', error);
        } else {
          setJob(data);
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [id, supabase]);

  const handleTailorResume = () => {
    // Implement resume tailoring logic here
    console.log('Tailor resume clicked for job:', job);
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-details-container">
      <h2>{job.title}</h2>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p><strong>Experience Required:</strong> {job.experience}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Qualifications:</strong> {job.qualifications}</p>
      <button onClick={handleTailorResume}>Tailor Resume</button>
    </div>
  );
}

export default JobDetails;
