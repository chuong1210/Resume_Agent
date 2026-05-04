# Hướng Dẫn Chạy CV Builder Chi Tiết

## Tổng Quan Dự Án

CV Builder là ứng dụng xây dựng CV thông minh sử dụng AI. Dự án gồm 5 services:

| Service | Công nghệ | Port | Mô tả |
|---------|-----------|------|-------|
| frontend | Next.js 14 + React 18 + TypeScript | 3000 | Giao diện người dùng |
| backend | .NET 8 Web API | 8080 | Xử lý business logic, auth |
| ai-service | Python FastAPI + LangChain | 8000 | AI parsing, chat, tailor CV |
| postgres | PostgreSQL 16 | 5432 | Cơ sở dữ liệu chính |
| redis | Redis 7 | 6379 | Cache / session |
| ollama | Ollama (tùy chọn) | 11434 | Chạy LLM local (Llama3.1, etc.) |

---

## Yêu Cầu Hệ Thống

Cài đặt trước các phần mềm sau:

- **Docker** và **Docker Compose** (bắt buộc nếu chạy bằng Docker)
- **Node.js 22+** và **npm** (nếu muốn chạy frontend riêng, không qua Docker)
- **Python 3.11+** và **pip** (nếu muốn chạy ai-service riêng)
- **.NET 8 SDK** (nếu muốn chạy backend riêng)
- **PostgreSQL 16** và **Redis 7** (nếu chạy từng service riêng lẻ)

---

## Cách 1: Chạy Toàn Bộ Bằng Docker Compose (Khuyến Nghị)

Đây là cách đơn giản nhất, chạy tất cả services cùng lúc.

### Bước 1: Tạo File Môi Trường (.env)

Tạo file `.env` tại thư mục gốc `cv-builder/` (cùng cấp với `docker-compose.yml`):

```bash
# Vào thư mục cv-builder
cd cv-builder

# Tạo file .env từ template
cp ai-service/.env.template .env
```

Mở file `.env` và điền API Key cho ít nhất một LLM provider. **Bắt buộc phải có ít nhất 1 key**:

```env
# Chọn provider mặc định (claude / openai / gemini / grok / deepseek / ollama)
DEFAULT_LLM_PROVIDER=claude

# Điền API key — tối thiểu 1 key cho provider bạn chọn
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
OPENAI_API_KEY=sk-your-key-here
GOOGLE_API_KEY=your-key-here
GROK_API_KEY=your-key-here
DEEPSEEK_API_KEY=sk-your-key-here

# JWT secret cho backend (tùy chọn, đã có default)
JWT_SECRET=your-secret-key-at-least-32-characters-long!!!
```

> Nếu không có API key của bất kỳ provider nào, bạn có thể dùng Ollama (xem Cách 3).

### Bước 2: Khởi Động Tất Cả Services

```bash
# Tại thư mục cv-builder/
docker compose up -d
```

Lần đầu chạy sẽ mất vài phút để build images. Các lần sau sẽ nhanh hơn.

### Bước 3: Kiểm Tra

```bash
# Kiểm tra trạng thái các containers
docker compose ps

# Kiểm tra health check
curl http://localhost:8000/health
curl http://localhost:8080/health
```

Mở trình duyệt truy cập: **http://localhost:3000**

### Bước 4: Dừng Services

```bash
# Dừng tất cả
docker compose down

# Dừng và xóa cả volumes (xóa database)
docker compose down -v
```

---

## Cách 2: Chạy Riêng Từng Service (Development)

Dành cho developer muốn sửa code và hot-reload.

### 2.1 Chạy PostgreSQL & Redis (Docker)

```bash
# Chỉ chạy database và redis
docker compose up -d postgres redis
```

### 2.2 Chạy Backend (.NET 8)

```bash
# Mở terminal mới, vào thư mục backend
cd cv-builder/backend

# Restore packages
dotnet restore

# Chạy
dotnet run --project CVBuilder.API/CVBuilder.API.csproj
# Backend chạy tại http://localhost:8080
```

### 2.3 Chạy AI Service (Python FastAPI)

```bash
# Mở terminal mới, vào thư mục ai-service
cd cv-builder/ai-service

# Tạo virtual environment (chỉ lần đầu)
python -m venv venv

# Kích hoạt venv
# Trên Windows (Git Bash / CMD):
source venv/Scripts/activate
# Trên Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Trên macOS/Linux:
source venv/bin/activate

# Cài dependencies
pip install -r requirements.txt

# Tạo file .env từ template
cp .env.template .env
# Sửa .env, điền API key của bạn

# Chạy service
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# AI Service chạy tại http://localhost:8000
# API docs: http://localhost:8000/docs
```

### 2.4 Chạy Frontend (Next.js)

```bash
# Mở terminal mới, vào thư mục frontend
cd cv-builder/frontend

# Cài dependencies (chỉ lần đầu)
npm install

# Chạy dev server
npm run dev
# Frontend chạy tại http://localhost:3000
```

### 2.5 Kiểm Tra

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- AI Service API Docs: http://localhost:8000/docs
- AI Service Health: http://localhost:8000/health

---

## Cách 3: Dùng Ollama (LLM Local, Không Cần API Key)

Nếu bạn không có API key từ các provider đám mây, có thể dùng Ollama chạy model local.

### Bước 1: Khởi động Ollama

```bash
# Chạy Ollama container với GPU (nếu có NVIDIA GPU)
docker compose --profile ollama up -d ollama

# Hoặc không có GPU
docker compose up -d ollama
# (bỏ dòng deploy.resources trong docker-compose.yml nếu bị lỗi)
```

### Bước 2: Tải Model

```bash
# Vào container Ollama và tải model
docker exec -it cv-builder-ollama-1 ollama pull llama3.1:8b

# Hoặc các model khác:
# docker exec -it cv-builder-ollama-1 ollama pull mistral:7b
# docker exec -it cv-builder-ollama-1 ollama pull qwen2.5:7b
```

### Bước 3: Cấu Hình .env

```env
DEFAULT_LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=llama3.1:8b
```

### Bước 4: Chạy

```bash
docker compose up -d
```

---

## Các API Endpoints Chính

### AI Service (port 8000)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Health check |
| POST | `/ai/parse` | Parse CV từ file (PDF/DOCX) |
| POST | `/ai/chat` | Chat với AI để sửa CV (SSE streaming) |
| POST | `/ai/tailor` | Điều chỉnh CV theo JD (SSE streaming) |

### Backend (port 8080)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Health check |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/register` | Đăng ký |
| CRUD | `/cv/*` | Quản lý CV |

---

## Xử Lý Lỗi Thường Gặp

### 1. Port đã bị chiếm dụng

```bash
# Kiểm tra port nào đang dùng
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :8000
netstat -ano | findstr :5432

# Sửa port trong docker-compose.yml hoặc tắt ứng dụng đang chiếm port
```

### 2. Lỗi "invalid API key" từ ai-service

Kiểm tra file `.env` đã có API key đúng chưa. Nếu chạy Docker, rebuild lại:

```bash
docker compose down
docker compose up -d --build ai-service
```

### 3. Frontend không kết nối được backend

Đảm bảo biến môi trường `NEXT_PUBLIC_API_URL` và `NEXT_PUBLIC_AI_URL` đúng:

- Khi chạy Docker: `http://backend:8080` và `http://ai-service:8000`
- Khi chạy riêng: `http://localhost:8080` và `http://localhost:8000`

### 4. Ollama không nhận GPU

Sửa `docker-compose.yml`, xóa block `deploy.resources` trong service `ollama`:

```yaml
ollama:
  image: ollama/ollama
  ports:
    - "11434:11434"
  volumes:
    - ollama_data:/root/.ollama
  # Xóa toàn bộ phần deploy bên dưới
```

### 5. Lỗi "JWT_SECRET too short"

Đảm bảo `JWT_SECRET` trong `.env` có ít nhất 32 ký tự.

---

## Cấu Trúc Thư Mục

```
cv-builder/
├── docker-compose.yml          # Cấu hình Docker Compose
├── .env                        # Biến môi trường (tự tạo)
├── frontend/                   # Next.js 14 frontend
│   ├── app/                    # App Router pages
│   │   ├── (auth)/             # Login, Register
│   │   └── (dashboard)/        # Dashboard, CV editor
│   ├── components/             # React components
│   │   ├── cv/                 # CV preview & sections
│   │   ├── chat/               # AI chat panel
│   │   ├── upload/             # File upload
│   │   └── jd/                 # JD Tailor panel
│   ├── lib/                    # Utilities, hooks, store
│   └── public/templates/       # CV templates (JSON)
├── backend/                    # .NET 8 backend
│   ├── CVBuilder.API/          # Controllers, middleware
│   ├── CVBuilder.Application/  # Business logic
│   ├── CVBuilder.Domain/       # Domain models
│   └── CVBuilder.Infrastructure/ # DB, external services
├── ai-service/                 # Python AI service
│   ├── main.py                 # FastAPI entry point
│   ├── agents/                 # LangGraph agents
│   ├── mcp_tools/              # MCP tool implementations
│   ├── routers/                # API routes
│   ├── schemas/                # Pydantic models
│   ├── config/                 # LLM config
│   └── .env.template           # Template biến môi trường
└── .github/workflows/          # CI/CD pipeline
```

---

## Tóm Tắt Nhanh

```bash
# 1. Vào thư mục dự án
cd cv-builder

# 2. Tạo file .env và điền API key
cp ai-service/.env.template .env
# >>> Mở .env, điền ít nhất 1 API key <<<

# 3. Khởi động
docker compose up -d

# 4. Mở trình duyệt
# http://localhost:3000

# 5. Dừng
docker compose down
```
