
import { useEffect, useState } from "react";

function RecruiterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadApplications() {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Please login with your recruiter account.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/jobs/recruiter-applications/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Unable to load applicants."
        );
      }

      setApplications(data);
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function updateStatus(applicationId, newStatus) {
    const token = localStorage.getItem("authToken");

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/jobs/applications/${applicationId}/status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "Unable to update application status."
        );
      }

      setApplications((previous) =>
        previous.map((application) =>
          application.id === applicationId
            ? { ...application, status: data.status }
            : application
        )
      );

      setMessage(`Application status updated to ${newStatus}.`);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  if (loading) {
    return <p>Loading applicants...</p>;
  }

  return (
    <div className="recruiter-applications">
      <h1>Applicants</h1>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      {applications.length === 0 ? (
        <p>No applications found for your jobs yet.</p>
      ) : (
        applications.map((application) => (
          <div className="job-card" key={application.id}>
            <h3>{application.job_title}</h3>

            <p>Company: {application.company}</p>
            <p>Applicant: {application.applicant_name}</p>
            <p>Email: {application.applicant_email}</p>
            <p>Status: {application.status}</p>

            <p>
              Applied on:{" "}
              {new Date(
                application.applied_at
              ).toLocaleDateString()}
            </p>

            {application.cover_letter && (
              <p>Cover Letter: {application.cover_letter}</p>
            )}

            {application.resume && (
              <p>
                <a
                  href={`http://127.0.0.1:8000${application.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              </p>
            )}

            <button
              onClick={() =>
                updateStatus(application.id, "Shortlisted")
              }
            >
              Shortlist
            </button>

            <button
              onClick={() =>
                updateStatus(application.id, "Rejected")
              }
            >
              Reject
            </button>

            <button
              onClick={() =>
                updateStatus(application.id, "Selected")
              }
            >
              Select
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default RecruiterApplications;
