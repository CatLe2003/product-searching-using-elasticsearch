const express = require("express");
const { Client } = require("@elastic/elasticsearch");

const cors = require("cors");

const app = express();
app.use(cors()); 

const esClient = new Client({ node: "http://localhost:9200" });

app.get("/", async (req, res) => {
  try {
    const health = await esClient.cluster.health();
    res.send({ message: "Elasticsearch đã kết nối!", health });
  } catch (error) {
    res.status(500).send({ message: "Không kết nối được Elasticsearch!", error: error.message });
  }
});

app.post("/add", async (req, res) => {
    const { id, name, description, price } = req.body;
    try {
      await esClient.index({
        index: "products",
        id,
        body: { name, description, price }
      });
      res.send({ message: "Thêm sản phẩm thành công!" });
    } catch (error) {
      res.status(500).send(error);
    }
});
  

app.get("/search", async (req, res) => {
    const { query } = req.query;
    try {
      const result = await esClient.search({
        index: "products",
        body: {
          query: {
            multi_match: {
                query: query,
                fields: ["title", "description", "category", "tags"]
            }
          }
        }
      });
      res.send(result.hits.hits);
    } catch (error) {
      res.status(500).send(error);
    }
});

app.listen(5000, () => console.log("Server chạy trên cổng 5000"));
