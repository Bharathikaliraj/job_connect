
import { useState } from "react";
import JobList from "../compontents/joblist";

function Home() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [searchFilters, setSearchFilters] = useState({
    keyword: "",
    location: "",
  });

  function handleSearch(e) {
    e.preventDefault();

    setSearchFilters({
      keyword: keyword,
      location: location,
    });
  }

  return (
    <div className="home">

      <section className="hero">
        <h1>Find Your Dream Job</h1>

        <p>
          Discover the right job opportunities and build your career.
        </p>

        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Job title or skills"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button type="submit">Search Jobs</button>
        </form>
      </section>

      <JobList
        keyword={searchFilters.keyword}
        location={searchFilters.location}
      />

    </div>
  );
}

export default Home;
