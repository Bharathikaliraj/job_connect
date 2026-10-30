
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/jobs/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load jobs");
        }
        return response.json();
      })
      .then((data) => {
        const selectedJob = data.find(
          (item) => item.id === Number(id)
        );
        setJob(selectedJob || null);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleApply(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (resume && resume.type !== "application/pdf") {
      setError("Please upload a PDF resume.");
      return;
    }

    const formData = new FormData();
    formData.append("job", job.id);
    formData.append("applicant_name", applicantName);
    formData.append("applicant_email", applicantEmail);
    formData.append("cover_letter", coverLetter);

    if (resume) {
      formData.append("resume", resume);
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/jobs/apply/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Object.values(data).flat().join(" ") ||
          "Application failed"
        );
      }

      setMessage("Application submitted successfully!");
      setApplicantName("");
      setApplicantEmail("");
      setCoverLetter("");
      setResume(null);
      event.currentTarget.reset();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  if (loading) return <p>Loading job details...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className="job-details">
      <h1>{job.title}</h1>

      <p>🏢 Company: {job.company}</p>
      <p>📍 Location: {job.location}</p>
      <p>💰 Salary: {job.salary}</p>
      <p>🛠️ Skills: {job.skills}</p>
      <p>💼 Job Type: {job.job_type}</p>

      <h3>Description</h3>
      <p>{job.description}</p>

      <hr />

      <h2>Apply for this Job</h2>

      <form onSubmit={handleApply}>
        <div>
          <label htmlFor="applicantName">Full Name</label>
          <input
            id="applicantName"
            type="text"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="applicantEmail">Email Address</label>
          <input
            id="applicantEmail"
            type="email"
            value={applicantEmail}
            onChange={(e) => setApplicantEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="coverLetter">Cover Letter</label>
          <textarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell us why you are suitable for this job"
          />
        </div>

        <div>
          <label htmlFor="resume">Upload Resume (PDF)</label>
          <input
            id="resume"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) =>
              setResume(e.target.files?.[0] || null)
            }
          />
        </div>

        <button type="submit">Apply Now</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default JobDetails;
