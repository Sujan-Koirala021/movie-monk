import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, Search, Calendar, Star, TrendingUp, X, Info } from "lucide-react";

export default function AskKnowledgeBase() {
  const [formData, setFormData] = useState({
    question: "",
    Vote_Average: "",
    Release_Date_from: "",
    Release_Date_to: "",
    Popularity_from: "",
    Popularity_to: "",
    Vote_Count_from: "",
    Vote_Count_to: "",
    Vote_Average_from: "",
    Vote_Average_to: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterErrors, setFilterErrors] = useState({});
  const resultsRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim()) {
      alert("Please enter your query.");
      return;
    }
    setShowFilters(false)

    // Clean and parse numeric values
    const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => {
        if (
          [
            "Vote_Average",
            "Vote_Average_from",
            "Vote_Average_to",
            "Popularity_from",
            "Popularity_to",
            "Vote_Count_from",
            "Vote_Count_to",
          ].includes(key)
        ) {
          return [key, value ? parseFloat(value) : undefined];
        }
        return [key, value || undefined];
      })
    );

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/ask-kb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();
      setResults(data.results || []);

      // Scroll to results after a short delay to ensure content is rendered
      setTimeout(() => {
        scrollToResults();
      }, 100);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const MovieDetailModal = ({ movie, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800">{movie.id}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {movie.metadata?.Poster_Url && (
              <div className="flex-shrink-0">
                <img
                  src={movie.metadata.Poster_Url}
                  alt={movie.id}
                  className="w-48 rounded-lg shadow-lg mx-auto md:mx-0"
                />
              </div>
            )}

            <div className="flex-1 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Content</h4>
                <p className="text-gray-600">{movie.chunk_content}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">Rating</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {movie.metadata?.Vote_Average || 'N/A'}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Votes</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {movie.metadata?.Vote_Count || 'N/A'}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Release</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {movie.metadata?.Release_Date || 'N/A'}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">Popularity</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {movie.metadata?.Popularity?.toFixed(1) || 'N/A'}
                  </p>
                </div>
              </div>

              {movie.metadata?.Original_Language && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-700">Original Language: </span>
                  <span className="text-gray-800 font-semibold uppercase">
                    {movie.metadata.Original_Language}
                  </span>
                </div>
              )}

              <div className="bg-indigo-50 rounded-lg p-3">
                <span className="text-sm font-medium text-gray-700">Relevance Score: </span>
                <span className="text-indigo-600 font-bold">
                  {(movie.relevance * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const filterGroups = [
    {
      title: "Rating",
      icon: <Star className="w-4 h-4" />,
      color: "from-yellow-400 to-orange-500",
      filters: [
        { label: "Exact Rating", name: "Vote_Average", type: "number", step: "0.1", placeholder: "7.5" },
        { label: "Min Rating", name: "Vote_Average_from", type: "number", step: "0.1", placeholder: "6.0" },
        { label: "Max Rating", name: "Vote_Average_to", type: "number", step: "0.1", placeholder: "9.0" },
        { label: "Min Votes", name: "Vote_Count_from", type: "number", placeholder: "100" },
        { label: "Max Votes", name: "Vote_Count_to", type: "number", placeholder: "5000" },
      ]
    },
    {
      title: "Release Date",
      icon: <Calendar className="w-4 h-4" />,
      color: "from-green-400 to-green-500",
      filters: [
        { label: "From", name: "Release_Date_from", type: "date" },
        { label: "To", name: "Release_Date_to", type: "date" },
      ]
    },
    {
      title: "Popularity",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "from-blue-400 to-blue-500",
      filters: [
        { label: "Min", name: "Popularity_from", type: "number", step: "0.1", placeholder: "100" },
        { label: "Max", name: "Popularity_to", type: "number", step: "0.1", placeholder: "1000" },
      ]
    }
  ];

  const handleFilterChange = (e) => {
    const { name, value, type } = e.target;
  
    let val = value;
  
    // Convert to number if it's a number field
    if (type === "number") {
      val = parseFloat(value);
      if (isNaN(val)) val = "";
    }
  
    // Validation rules
    if (name.includes("Vote_Average")) {
      if (val < 0 || val > 10) {
        setFilterErrors(prev => ({ ...prev, [name]: "Rating must be between 0 and 10" }));
        return;
      } else {
        setFilterErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  
    if ((name === "Vote_Count_from" || name === "Vote_Count_to") && val < 0) {
      setFilterErrors(prev => ({ ...prev, [name]: "Vote count can't be negative" }));
      return; // Votes can't be negative
    }
  
    if ((name === "Popularity_from" || name === "Popularity_to") && val < 0) {
      setFilterErrors(prev => ({ ...prev, [name]: "Popularity can't be negative" }));
      return; // Popularity can't be negative
    }


  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-4 shadow-lg">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
            Movie Explorer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover movies with AI-powered search and advanced filtering
          </p>
        </div>

        <div className="space-y-6">
          {/* Main Query */}
          <div className="bg-white/90 rounded-xl shadow-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Your Query <span className="text-red-500">*</span></h2>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 text-lg rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 placeholder-gray-400"
                placeholder="What would you like to watch? (e.g., Action movies with time travel)"
              />
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search
                  </>
                )}
              </button>
            </div>
            {/* Applied Filters */}
            {Object.entries(formData)
              .filter(([key, value]) => value && key !== "question") // Exclude empty & main question
              .length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {Object.entries(formData)
                    .filter(([key, value]) => value && key !== "question")
                    .map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full"
                      >
                        {key.replace(/_/g, " ")}: <span className="ml-1 font-semibold">{value}</span>
                        <button
                          onClick={() => {
                            const updatedFormData = { ...formData };
                            delete updatedFormData[key];
                            setFormData(updatedFormData);
                          }}
                          className="ml-2 text-red-500 hover:text-red-700 text-2xl"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                </div>
              )}

          </div>

          {/* Compact Filter Sections */}
          <div className="bg-white/90 rounded-xl shadow-lg border p-4">
            <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded"></div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Advanced Filters <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                </h3>
              </div>
              {showFilters ? <ChevronUp className="w-6 h-6 text-gray-600" /> : <ChevronDown className="w-6 h-6  text-gray-600" />}
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filterGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="bg-gray-50 rounded-lg p-3 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-5 h-5 bg-gradient-to-r ${group.color} rounded flex items-center justify-center text-white`}>
                        {group.icon}
                      </div>
                      <h4 className="text-sm font-medium text-gray-700">{group.title}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {group.filters.map(({ label, name, type, step, placeholder }) => (
                        <div key={name}>
                        <label className="block text-xs text-gray-600 mb-1">{label}</label>
                        <input
                          type={type}
                          name={name}
                          step={step}
                          value={formData[name] || ""}
                          onChange={handleFilterChange}
                          placeholder={placeholder}
                          className={`w-full px-2 py-1 text-xs rounded border ${filterErrors[name] ? "border-red-500" : "border-gray-300"} focus:border-blue-400 focus:ring-1 focus:ring-blue-100 bg-white`}
                        />
                        {filterErrors[name] && <p className="text-xs text-red-500 mt-1">{filterErrors[name]}</p>}
                      </div>

                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          {/* <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Movies
                </span>
              )}
            </button>
          </div> */}
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div ref={resultsRef} className="mt-24">
            <div className="bg-white/90 rounded-xl shadow-lg border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Search Results ({results.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer"
                    onClick={() => setSelectedMovie(item)}>
                    {item.metadata?.Poster_Url && (
                      <div className="aspect-[2/3] overflow-hidden">
                        <img
                          src={item.metadata.Poster_Url}
                          alt={item.id}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                        {item.id}
                      </h3>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.chunk_content}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{item.metadata?.Vote_Average || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-blue-500" />
                          <span>{item.metadata?.Release_Date || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {(item.relevance * 100).toFixed(0)}% match
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedMovie(item)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md text-xs font-medium transition-colors"
                        >
                          <Info className="w-3 h-3" />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Movie Detail Modal */}
        {selectedMovie && (
          <MovieDetailModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </div>
    </div>
  );
}