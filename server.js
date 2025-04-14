const express = require("express");
const { Client } = require("@elastic/elasticsearch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const esClient = new Client({ node: "http://localhost:9200" });

app.get("/", async (req, res) => {
  try {
    const health = await esClient.cluster.health();
    res.send({ message: "Elasticsearch đã kết nối!", health });
  } catch (error) {
    res.status(500).send({
      message: "Không kết nối được Elasticsearch!",
      error: error.message,
    });
  }
});

app.get("/search", async (req, res) => {
  const { query, type } = req.query;

  try {
    let esQuery;

    switch (type) {
      case "match":
        esQuery = {
          query: {
            multi_match: {
              query: query, 
              fields: [
                "category", 
                "customer_first_name", 
                "customer_gender", 
                "manufacturer"
              ]
            }
          },
        };
        break;

      case "term":
        esQuery = {
          query: {
            term: {
              customer_gender: query.toUpperCase()
            },
          },
        };
        break;

      case "bool":
        const gender = req.query.gender?.toUpperCase(); 
        esQuery = {
          query: {
            bool: {
              must: [
                { match: { customer_first_name: query } },
                { term: { customer_gender: gender } }
              ],
            },
          },
        };
      break;

      case "range":
        const min = Number(req.query.minPrice || 0);
        const max = Number(req.query.maxPrice || 100);
        esQuery = {
          query: {
            range: {
              taxful_total_price: {
                gte: min,
                lte: max,
              },
            },
          },
        };
      break;

      case "agg":
        esQuery = {
          size: 0,
          aggs: {
            by_category: {
              terms: {
                field: "category.keyword",
                size: 10,
              },
            },
          },
        };
        break;

      default:
        return res.status(400).send({ message: "Loại truy vấn không hợp lệ" });
    }

    const result = await esClient.search({
      index: "kibana_sample_data_ecommerce",
      body: esQuery,
    });

    res.send(type === "agg" ? result.aggregations : result.hits.hits);
    console.log(result.hits.hits);

  } catch (error) {
    console.error("Lỗi truy vấn Elasticsearch:", error);
    res.status(500).send({ message: "Truy vấn lỗi", error: error.message });
  }
});

app.listen(5000, () => console.log("Server chạy trên cổng 5000"));
