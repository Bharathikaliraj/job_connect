
import { useEffect, useState } from "react";

function MyPostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadJobs() {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Please login with your recruiter account.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/jobs/my-posted-jobs/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Unable to load jobs."
        );
      }

      setJobs(data);
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleEdit(job) {
    const description = window.prompt(
      "Enter the updated job description:",
      job.description
    );

    if (description === null) {
      return;
    }

    if (!description.trim()) {
      setError("Job description cannot be empty.");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `http://127.0.0.1:8000/api/jobs/${job.id}/manage/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ description }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Unable to update job."
        );
      }

      setJobs((previousJobs) =>
        previousJobs.map((item) =>
          item.id === job.id ? { ...item, ...data } : item
        )
      );

      setMessage("Job updated successfully!");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  async function handleDelete(job) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"?`
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `http://127.0.0.1:8000/api/jobs/${job.id}/manage/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Unable to delete job."
        );
      }

      setJobs((previousJobs) =>
        previousJobs.filter((item) => item.id !== job.id)
      );

      setMessage("Job deleted successfully!");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  if (loading) {
    return <p>Loading your posted jobs...</p>;
  }

  return (
    <div className="my-posted-jobs">
      <h1>My Posted Jobs</h1>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      {jobs.length === 0 ? (
        <p>You have not posted any jobs yet.</p>
      ) : (
        jobs.map((job) => (
          <div className="job-card" key={job.id}>
            <h3>{job.title}</h3>
            <p>Company: {job.company}</p>
            <p>Location: {job.location}</p>
            <p>Salary: {job.salary}</p>
            <p>Skills: {job.skills}</p>
            <p>Job Type: {job.job_type}</p>
            <p>{job.description}</p>

            <button onClick={() => handleEdit(job)}>
              Edit Job
            </button>

            <button onClick={() => handleDelete(job)}>
              Delete Job
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyPostedJobs;
