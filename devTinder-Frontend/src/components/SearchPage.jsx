import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [form, setForm] = useState({ name: "", location: "", skill: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;

  const fetchUsers = async (query, currentPage = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query.name) params.append("name", query.name);
      if (query.location) params.append("location", query.location);
      if (query.skill) params.append("skill", query.skill);
      params.append("page", currentPage);
      params.append("limit", limit);

      const res = await axios.get(`${BASE_URL}/user/search?${params.toString()}`, {
        withCredentials: true,
      });

      setResults(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((query, page) => fetchUsers(query, page), 500);

  useEffect(() => {
    debouncedSearch(form, page);
    return debouncedSearch.cancel;
  }, [form, page]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setPage(1); // reset to first page
  };

  const handleReset = () => {
    setForm({ name: "", location: "", skill: "" });
    setResults([]);
    setPage(1);
    setTotal(0);
  };

  const popularTags = ["React", "Node.js", "MongoDB", "Hyderabad", "Bangalore"];

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">🔍 Search Developers</h1>

      {/* Search Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="input input-bordered w-full md:max-w-xs dark:bg-gray-800 dark:border-gray-600"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="input input-bordered w-full md:max-w-xs dark:bg-gray-800 dark:border-gray-600"
        />
        <input
          type="text"
          name="skill"
          placeholder="Skill"
          value={form.skill}
          onChange={handleChange}
          className="input input-bordered w-full md:max-w-xs dark:bg-gray-800 dark:border-gray-600"
        />
        <button className="btn btn-error" onClick={handleReset}>
          Clear
        </button>
      </div>

      {/* Popular Tags */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Popular filters:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              className="badge badge-outline cursor-pointer hover:bg-base-300 dark:hover:bg-gray-700"
              onClick={() =>
                tag === "Hyderabad" || tag === "Bangalore"
                  ? setForm((f) => ({ ...f, location: tag }))
                  : setForm((f) => ({ ...f, skill: tag }))
              }
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : results.length > 0 ? (
          results.map((user) => (
            <Link
              to={`/profile/${user._id}`} // assuming you have dynamic profile route
              key={user._id}
              className="card bg-base-100 shadow-md border dark:border-gray-700 dark:bg-gray-800 hover:shadow-xl transition-transform hover:scale-[1.02]"
            >
              <div className="flex gap-4 p-4 items-center">
                <img
                  src={user.photoUrl}
                  className="w-16 h-16 rounded-full border"
                  alt="User"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">📍 {user.location}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    🛠️ {user.skills.join(", ")}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No users found. Try different filters!
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            ⬅ Prev
          </button>
          <span className="px-3">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
