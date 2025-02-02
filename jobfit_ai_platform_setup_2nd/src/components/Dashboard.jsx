import React, { useState, useEffect, useContext } from 'react';
import { SupabaseContext } from '../context/SupabaseContext';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [jobData, setJobData] = useState([]);
  const { supabase, session, user } = useContext(SupabaseContext);
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('id, title, company, location, min_amount, max_amount, description');
        if (error) {
          console.error('Error fetching job data:', error);
        } else {
          setJobData(data);
          processChartData(data);
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };

    fetchJobData();
  }, [supabase]);

  const processChartData = (data) => {
    const titleCounts = {};
    data.forEach(job => {
      titleCounts[job.title] = (titleCounts[job.title] || 0) + 1;
    });

    const labels = Object.keys(titleCounts);
    const counts = Object.values(titleCounts);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Job Title Counts',
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleUploadResumeClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(fileName, selectedFile);

      if (error) {
        console.error('Error uploading file:', error);
        toast.error('Error uploading resume.');
      } else {
        console.log('File uploaded successfully:', data);
        toast.success('Resume uploaded successfully!');
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading resume.');
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchInputKeyPress = async (e) => {
    if (e.key === 'Enter') {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('id, title, company, location, min_amount, max_amount, description')
          .ilike('title', `%${searchQuery}%`);
        if (error) {
          console.error('Error searching jobs:', error);
        } else {
          setSearchResults(data);
        }
      } catch (error) {
        console.error('Error searching jobs:', error);
      }
    }
  };

  const handleJobCardClick = (job) => {
    navigate(`/job/${job.id}`);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>SmartHire AI</h1>
        <nav>
          <button onClick={handleUploadResumeClick}>Upload Resume</button>
          <a href="#">Job Insights</a>
          <input
            type="text"
            placeholder="Search companies, job titles..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={handleSearchInputKeyPress}
          />
          <select>
            <option>City</option>
          </select>
          <button onClick={handleSignOut}>Sign Out</button>
        </nav>
      </header>
      <div className="dashboard-title">
        <h2>JobFit AI</h2>
        <p>Find Your Perfect Job Match with AI-Powered Resume Tailoring</p>
      </div>
      {isModalOpen && (
        <div className="upload-resume-modal">
          <div className="upload-resume-modal-content">
            <h2>Upload Resume</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
      {chartData && (
        <div className="chart-container">
          <Chart type='bar' data={chartData} />
        </div>
      )}
      <h2>Job Listings</h2>
      {(searchResults.length > 0 ? searchResults : jobData).map((job, index) => (
        <div key={index} className="job-card" onClick={() => handleJobCardClick(job)}>
          <h3>{job.title}</h3>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Location:</strong> {job.location}</p>
          {job.min_amount && job.max_amount && (
            <p>
              <strong>Salary:</strong> {job.min_amount} - {job.max_amount}
            </p>
          )}
          <p>{job.description?.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
