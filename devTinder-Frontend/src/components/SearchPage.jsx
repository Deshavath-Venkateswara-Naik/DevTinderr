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

      const res = await axios.get(
        `${BASE_URL}/user/search?${params.toString()}`,
        { withCredentials: true }
      );

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
    setPage(1);
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
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">
        🔍 Search Developers
      </h1>

      {/* Search Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        {["name", "location", "skill"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            className="input input-bordered w-full md:max-w-xs dark:bg-gray-800 dark:border-gray-600"
          />
        ))}
        <button
          className="btn btn-error hover:brightness-110"
          onClick={handleReset}
        >
          Clear
        </button>
      </div>

      {/* Popular Tags */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Popular filters:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              className="badge badge-outline cursor-pointer hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600"
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
          <div className="col-span-full text-center py-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : results.length > 0 ? (
          results.map((user) => (
            <Link
              to={`/profile/${user._id}`}
              key={user._id}
              className="card bg-base-100 shadow-lg border dark:border-gray-700 dark:bg-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex gap-4 p-4 items-center">
                <img
                  src={user.photoUrl}
                  className="w-16 h-16 rounded-full border object-cover"
                  alt="User"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {user.firstName} {user.lastName}
                  </h2>
                  {user.location && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      📍 {user.location}
                    </p>
                  )}
                  {user.skills?.length > 0 && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      🛠️ {user.skills.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="bg-base-300 p-8 rounded-lg shadow-md inline-block">
              <p className="text-lg font-semibold text-gray-400 mb-2">
                No developers found
              </p>
              <p className="text-gray-500 text-sm">
                Try adjusting your filters or search terms
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-3">
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            ⬅ Prev
          </button>
          <span className="px-3 font-medium">
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
