
import { useState } from "react";

function RecruiterDashboard() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    skills: "",
    job_type: "Full Time",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Please login with your recruiter account first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/jobs/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Object.values(data).flat().join(" ") ||
            "Unable to post job."
        );
      }

      setMessage("Job posted successfully!");

      setForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        skills: "",
        job_type: "Full Time",
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="recruiter-dashboard">
      <h1>Recruiter Dashboard</h1>
      <h2>Post a New Job</h2>

      <form onSubmit={handleSubmit}>
        <label>Job Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Company</label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <label>Salary</label>
        <input
          name="salary"
          value={form.salary}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label>Skills</label>
        <input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="Python, Django, React"
          required
        />

        <label>Job Type</label>
        <select
          name="job_type"
          value={form.job_type}
          onChange={handleChange}
        >
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default RecruiterDashboard;
