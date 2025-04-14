import { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState("match");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState(""); 
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  
const handleSearch = async () => {
  if (!query && !["agg", "bool", "range"].includes(queryType)) return;
  setLoading(true);
  try {
    const response = await axios.get("http://localhost:5000/search", {
      params: {
        query,
        gender,
        type: queryType,
        minPrice,
        maxPrice
      },
    });
    setResults(response.data);
  } catch (error) {
    console.error("Lỗi tìm kiếm:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="App">
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center p-6 w-full">

        <h1 className="text-2xl font-bold mb-4">Tìm kiếm sản phẩm</h1>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            className="p-2 border rounded w-64"
            placeholder="Nhập từ khóa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={queryType === "agg" || queryType === "range"}
          />
          <select
            className="p-2 border rounded"
            value={queryType}
            onChange={(e) => {
              setQueryType(e.target.value);
              setGender("");
              setQuery("");
              setResults([]);
            }}
          >
            <option value="match">Match Query</option>
            <option value="term">Term Query</option>
            <option value="bool">Bool Query</option>
            <option value="range">Range Query</option>
            <option value="agg">Aggregation Query</option>
          </select>
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
        </div>
        {queryType === "range" && (
          <div className="mt-4 w-full max-w-lg">
            <label className="block font-medium mb-1">
              Khoảng giá đơn hàng (Giá sau thuế): {minPrice} - {maxPrice} $
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
            </div>
            {minPrice > maxPrice && (
              <p className="text-red-500 text-sm mt-1">
                Giá tối thiểu không được lớn hơn giá tối đa!
              </p>
            )}
          </div>
        )}

        {queryType === "bool" && (
          <div className="mt-4 flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={() => setGender("male")}
              />
              <span>Nam</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={() => setGender("female")}
              />
              <span>Nữ</span>
            </label>
          </div>
        )}

        <div className="mt-6 w-full max-w-2xl">
          {loading && <p className="text-gray-500">Đang tìm kiếm...</p>}
          {!loading && results.length === 0 && queryType !== "agg" && (
            <p className="text-gray-500">Không có kết quả nào</p>
          )}

          {queryType !== "agg" &&
            results.map((item, index) => (
              <div key={index} className="p-4 bg-white shadow rounded mb-2">
                <h2 className="text-lg font-semibold">
                  Khách Hàng:{" "}
                  {item._source?.customer_full_name ||
                    item._source?.name ||
                    "Khách hàng ẩn danh"}
                </h2>
                <p className="text-gray-600">
                  Email: {item._source?.email || "Không có email"}
                </p>
                {item._source?.order_date && (
                  <p className="text-green-600 font-bold">
                    Ngày đặt hàng:{" "}
                    {new Date(item._source.order_date).toLocaleDateString()}
                  </p>
                )}
                {item._source?.order_date && (
                  <p className="text-gray-600">
                    Giá trước thuế : {item._source.taxless_total_price} $
                  </p>
                )}
                {item._source?.order_date && (
                  <p className="text-gray-600">
                    Giá sau thuế : {item._source.taxful_total_price} $
                  </p>
                )}
                {item._source?.products && item._source.products[0] && (
                  <div>
                    <h3 className="font-semibold mt-2">Sản phẩm trong đơn:</h3>
                    <p>{item._source.products[0].product_name}</p>
                  </div>
                )}
              </div>
            ))}

          {queryType === "agg" && (
            <div className="bg-white p-4 shadow rounded">
              <h2 className="font-bold mb-2">Kết quả thống kê theo danh mục:</h2>
              <ul className="list-disc pl-5">
                {results.by_category?.buckets.map((bucket, index) => (
                  <li key={index}>
                    {bucket.key} - {bucket.doc_count} sản phẩm
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
