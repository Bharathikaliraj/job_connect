
import { useEffect, useState } from "react";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Please login first to view your applications.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/jobs/applications/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || data.error || "Unable to load applications."
          );
        }

        setApplications(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  if (loading) {
    return <p>Loading your applications...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="my-applications">
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <p>No applications found for your account.</p>
      ) : (
        applications.map((application) => (
          <div className="job-card" key={application.id}>
            <h3>{application.job_title}</h3>
            <p>🏢 Company: {application.company}</p>
            <p>📌 Status: {application.status}</p>
            <p>
              📅 Applied on:{" "}
              {new Date(application.applied_at).toLocaleDateString()}
            </p>

            {application.cover_letter && (
              <p>Cover Letter: {application.cover_letter}</p>
            )}

            {application.resume && (
              <p>
                📄 <a
                  href={`http://127.0.0.1:8000${application.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyApplications;
