# Hướng dẫn chạy dự án Elasticsearch Demo

## 1. Cài đặt Elasticsearch
1. **Tải Elasticsearch** từ trang chủ [Elasticsearch](https://www.elastic.co/downloads/elasticsearch)
2. **Giải nén** Elasticsearch
3. **Chỉnh sửa cấu hình**: Mở file `config/elasticsearch.yml`, tìm các dòng:
   ```yaml
   xpack.security.enabled: false
   xpack.security.http.ssl.enabled: false
   ```

## 2. Khởi chạy Elasticsearch
1. Mở terminal, điều hướng đến thư mục chứa Elasticsearch
2. Chạy lệnh sau để khởi động Elasticsearch:
   ```sh
   bin/elasticsearch.bat
   ```
3. Mở trình duyệt kiểm tra Elasticsearch đã chạy chưa:
   - Truy cập: [http://localhost:9200](http://localhost:9200)
   - Nếu hiển thị JSON thông tin của Elasticsearch, nghĩa là chạy thành công

## 3. Cài đặt Backend
1. Mở terminal, điều hướng đến thư mục `elasticsearch`
2. Cài đặt các package cần thiết:
   ```sh
   npm install
   ```
3. Chạy file seed dữ liệu vào Elasticsearch:
   ```sh
   node seed.js
   ```
4. Kiểm tra dữ liệu đã có trong Elasticsearch chưa:
   - Truy cập: [http://localhost:9200/products/_search?pretty=true](http://localhost:9200/products/_search?pretty=true)
   - Nếu có dữ liệu trả về là thành công
5. Chạy server backend:
   ```sh
   node server.js
   ```

## 4. Cài đặt Frontend
1. Mở terminal, điều hướng đến thư mục frontend:
   ```sh
   cd elasticsearch-ui
   ```
2. Cài đặt dependencies:
   ```sh
   npm install
   ```
3. Chạy ứng dụng React:
   ```sh
   npm run dev
   ```
4. Mở trình duyệt và truy cập địa chỉ hiển thị trên terminal để sử dụng ứng dụng
