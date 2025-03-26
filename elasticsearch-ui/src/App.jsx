import { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Tìm kiếm sản phẩm</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            className="p-2 border rounded w-64"
            placeholder="Nhập từ khóa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
        </div>
        <div className="mt-6 w-full max-w-2xl">
          {loading && <p className="text-gray-500">Đang tìm kiếm...</p>}
          {results.length === 0 && !loading && <p className="text-gray-500">Không có kết quả nào</p>}
          {results.map((item) => (
            <div key={item._id} className="p-4 bg-white shadow rounded mb-2">
              <h2 className="text-lg font-semibold">{item._source.name}</h2>
              <p className="text-gray-600">{item._source.description}</p>
              <p className="text-green-600 font-bold">${item._source.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
