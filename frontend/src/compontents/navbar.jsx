
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>JobConnect</h2>

      <div>
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/companies">Companies</Link>
        <Link to="/my-applications">My Applications</Link>
        <Link to="/recruiter-dashboard">Recruiter Dashboard</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/my-posted-jobs">My Posted Jobs</Link>
        <Link to="/recruiter-applications">Applicants</Link>
      </div>
    </nav>
  );
}

export default Navbar;
