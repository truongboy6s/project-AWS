
# project-AWS

Dự án này gồm 2 phần chính:

- Frontend: ReactJS
- Backend: Node.js + Express + MongoDB

---

## Cấu trúc thư mục

```
project-AWS/
├── frontend/      # React app
├── backend/       # Node.js backend
```
---

## Hướng dẫn chạy dự án

### 1. Chạy Backend

- Vào thư mục backend:
```bash
cd backend
```

- Cài đặt dependencies:
```bash
npm install
```

- Tạo file `.env` trong thư mục backend với nội dung:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```
Thay `your_mongodb_connection_string` bằng URI của bạn (có thể dùng MongoDB Atlas hoặc local).

- Chạy server:
```bash
node app.js
```
Hoặc nếu có dùng `nodemon`:
```bash
npx nodemon app.js
```

---

### 2. Chạy Frontend

- Vào thư mục frontend:
```bash
cd frontend
```

- Cài đặt dependencies:
```bash
npm install
```

- Chạy app React:
```bash
npm start
```

---

## Mở trình duyệt

- Frontend mặc định chạy trên: [http://localhost:3000](http://localhost:3000)
- Backend mặc định chạy trên: [http://localhost:3000/api](http://localhost:3000/api) (hoặc port bạn cấu hình)

---

## Ghi chú

- Bạn cần chắc chắn backend và frontend không bị trùng port (thường React chạy 3000, backend có thể đổi sang 5000 hoặc port khác trong `.env`).
- Cấu hình proxy trong frontend nếu muốn gọi API backend không bị lỗi CORS.

---

## Cấu hình proxy cho React (nếu backend chạy port khác 3000)

Thêm vào `frontend/package.json`:

```json
"proxy": "http://localhost:5000"
```

---

Nếu cần hỗ trợ thêm, bạn cứ hỏi nhé!
