import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function JobList({ keyword = "", location = "" }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/jobs/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        return response.json();
      })
      .then((data) => {
        setJobs(data);
      })
      .catch((error) => {
        console.error("FETCH ERROR:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const searchKeyword = keyword.trim().toLowerCase();
    const searchLocation = location.trim().toLowerCase();

    const matchesKeyword =
      !searchKeyword ||
      [job.title, job.company, job.skills].some((value) =>
        value?.toLowerCase().includes(searchKeyword)
      );

    const matchesLocation =
      !searchLocation ||
      job.location?.toLowerCase().includes(searchLocation);

    return matchesKeyword && matchesLocation;
  });

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  return (
    <div className="job-list">
      <h2>Available Jobs</h2>

      {filteredJobs.length === 0 ? (
        <p>No matching jobs found.</p>
      ) : (
        filteredJobs.map((job) => (
          <div className="job-card" key={job.id}>
            <h3>{job.title}</h3>
            <p>🏢 {job.company}</p>
            <p>📍 {job.location}</p>
            <p>💰 {job.salary}</p>
            <p>🛠️ {job.skills}</p>
            <p>💼 {job.job_type}</p>

            <Link to={`/job/${job.id}`}>
              View Details
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default JobList;