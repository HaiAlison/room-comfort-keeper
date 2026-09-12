# ThermaGuard — Smart Room Temperature Monitoring

> Hệ thống IoT giám sát nhiệt độ phòng và điều khiển quạt tự động, bảo vệ trẻ em và người cao tuổi.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?logo=nestjs&logoColor=white)

---

## Mục lục

- [Tổng quan](#tổng-quan)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Tính năng](#tính-năng)
- [Tech Stack](#tech-stack)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Biến môi trường](#biến-môi-trường)
- [Các trang chính](#các-trang-chính)
- [Real-time Architecture](#real-time-architecture)
- [API Endpoints](#api-endpoints)
- [Thành viên nhóm](#thành-viên-nhóm)

---

## Tổng quan

**ThermaGuard** là ứng dụng web giám sát nhiệt độ phòng real-time dành cho các phòng có trẻ em và người cao tuổi. Hệ thống:

- 📡 Thu thập dữ liệu nhiệt độ/độ ẩm từ cảm biến IoT qua MQTT
- 🌡️ Hiển thị nhiệt độ real-time trên dashboard
- 🌀 Tự động bật/tắt quạt khi nhiệt độ vượt ngưỡng
- 🔔 Gửi cảnh báo khi phát hiện bất thường
- 📊 Lưu lịch sử và hiển thị biểu đồ xu hướng

---

## Kiến trúc hệ thống

```
┌──────────┐    MQTT     ┌──────────────┐   REST/SSE   ┌──────────────┐
│  Sensor  │────────────▶│   NestJS BE  │◀────────────▶│  React FE    │
│  (ESP32) │             │  (Backend)   │              │  (This repo) │
└──────────┘             └──────┬───────┘              └──────────────┘
                                │
                         ┌──────▼───────┐
                         │  PostgreSQL  │
                         │  (Database)  │
                         └──────────────┘
```

- **Sensor** → publish nhiệt độ/độ ẩm qua **MQTT** tới broker
- **Backend (NestJS)** → subscribe MQTT, lưu DB, expose REST API + SSE streams
- **Frontend (React)** → gọi REST API và nhận real-time data qua **SSE** (Server-Sent Events)

> ⚠️ Frontend **không** kết nối trực tiếp tới MQTT broker. Mọi dữ liệu real-time đều đi qua backend SSE.

---

## Tính năng

### 🔐 Authentication
- Đăng nhập / Đăng xuất
- Protected routes — yêu cầu đăng nhập để truy cập dashboard
- Lưu session (remember me)

### 🌡️ Giám sát nhiệt độ Real-time
- Hiển thị nhiệt độ và độ ẩm hiện tại
- Cập nhật tức thời qua SSE (fallback polling 10s)
- Biểu đồ xu hướng nhiệt độ (24h / 7 ngày / tùy chọn)

### 🎚️ Quản lý ngưỡng nhiệt độ
- Cấu hình nhiệt độ tối thiểu / tối đa
- Quạt tự động bật khi `nhiệt độ ≥ max`, tắt khi `nhiệt độ ≤ min`

### 🌀 Điều khiển thiết bị
- Bật/tắt quạt thủ công
- Chuyển chế độ AUTO / MANUAL
- Hiển thị trạng thái quạt real-time qua SSE

### 🔔 Cảnh báo
- Cảnh báo khi nhiệt độ vượt ngưỡng
- Phân loại mức độ: info / warning / critical
- Nhận cảnh báo real-time qua SSE

### 📜 Lịch sử & Activity Logs
- Bảng lịch sử nhiệt độ với tìm kiếm, lọc, phân trang
- Xuất CSV
- Activity logs: ghi nhận mọi thao tác (login, bật/tắt quạt, cập nhật ngưỡng)

---

## Tech Stack

### Frontend (repo này)

| Công nghệ | Vai trò |
|---|---|
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Vite 8** | Build tool & dev server |
| **TailwindCSS 4** | Styling |
| **shadcn/ui** + Radix UI | Component library |
| **TanStack Router** | File-based routing |
| **TanStack Query** | Server state management |
| **Zustand** | Client state (auth, theme, realtime) |
| **React Hook Form** + Zod | Form validation |
| **Recharts** | Biểu đồ nhiệt độ |
| **Lucide Icons** | Icon system |
| **Axios** | HTTP client |
| **Sonner** | Toast notifications |

### Backend (repo riêng)

| Công nghệ | Vai trò |
|---|---|
| **NestJS** | REST API framework |
| **TypeORM** | ORM |
| **PostgreSQL** | Database |
| **MQTT** | Nhận dữ liệu từ sensor |
| **SSE** | Push real-time data tới frontend |

---

## Cấu trúc thư mục

```
src/
├── auth/                    # Protected route guard
│   └── ProtectedRoute.tsx
├── components/
│   ├── cards/               # TemperatureCard, FanStatusCard, AlertCard, ...
│   ├── charts/              # TemperatureChart (Recharts)
│   ├── common/              # LoadingSkeleton, EmptyState, ErrorState
│   ├── dialogs/             # Confirmation dialogs
│   ├── forms/               # ThresholdForm, ...
│   ├── layout/              # Sidebar, PageShell, Navbar
│   ├── tables/              # HistoryTable, ActivityTable
│   └── ui/                  # shadcn/ui primitives
├── hooks/
│   ├── use-monitoring.ts    # useCurrentTemperature, useTemperatureHistory, useThreshold
│   ├── use-monitoringlive.ts # SSE connection for live temperature
│   ├── use-devices.ts       # useFanState, useDeviceStatus
│   ├── use-alerts-sse.ts    # SSE connection for alerts
│   ├── use-fan-sse.ts       # SSE connection for fan state
│   ├── use-auth.ts          # useLogin, useLogout
│   └── use-events.ts        # useAlerts, useLogs
├── services/
│   ├── api.ts               # Axios instance, API routes, base config
│   ├── monitoring.service.ts
│   ├── device.service.ts
│   ├── alert.service.ts
│   ├── auth.service.ts
│   ├── log.service.ts
│   └── user.service.ts
├── stores/
│   ├── auth.store.ts        # Authentication state (Zustand)
│   ├── theme.store.ts       # Theme, auto-refresh toggle
│   ├── realtime.store.ts    # SSE connection status tracking
│   └── alert.store.ts       # Alert state
├── routes/                  # TanStack file-based routes
│   ├── index.tsx            # Login page
│   ├── _app.tsx             # Layout wrapper (SSE hooks activated here)
│   ├── _app.dashboard.tsx
│   ├── _app.monitoring.tsx
│   ├── _app.history.tsx
│   ├── _app.device-control.tsx
│   ├── _app.threshold.tsx
│   ├── _app.alerts.tsx
│   └── _app.activity-logs.tsx
├── lib/
│   ├── constants.ts         # Query keys, app constants
│   ├── types.ts             # Shared TypeScript types
│   └── format.ts            # Date/number formatters
└── styles.css               # Global styles + Tailwind
```

---

## Cài đặt & Chạy

### Yêu cầu

- **Node.js** ≥ 18 (khuyến nghị dùng [nvm](https://github.com/nvm-sh/nvm))
- **npm** ≥ 9
- Backend NestJS đang chạy (mặc định tại `http://localhost:3001`)

### Cài đặt

```bash
git clone https://github.com/HaiAlison/room-comfort-keeper.git
cd room-comfort-keeper
npm install
```

### Chạy Development

```bash
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`.

### Build Production

```bash
npm run build
npm run preview
```

---

## Biến môi trường

Tạo file `.env` tại thư mục gốc:

```env
VITE_API_BASE_URL=http://localhost:3001
```

| Biến | Mô tả | Mặc định |
|---|---|---|
| `VITE_API_BASE_URL` | URL của NestJS backend | `http://localhost:3001` |
| `VITE_FAN_DEVICE_ID` | (Tùy chọn) ID thiết bị quạt | — |

---

## Các trang chính

| Route | Trang | Mô tả |
|---|---|---|
| `/` | Login | Đăng nhập vào hệ thống |
| `/dashboard` | Dashboard | Tổng quan: nhiệt độ, quạt, thiết bị, cảnh báo |
| `/monitoring` | Monitoring | Giám sát real-time + biểu đồ xu hướng |
| `/history` | History | Bảng lịch sử nhiệt độ |
| `/device-control` | Device Control | Điều khiển quạt (ON/OFF/AUTO) |
| `/threshold` | Threshold | Cấu hình ngưỡng nhiệt độ |
| `/alerts` | Alerts | Danh sách cảnh báo |
| `/activity-logs` | Activity Logs | Nhật ký hoạt động |

---

## Real-time Architecture

Frontend sử dụng **3 SSE streams** song song, được kích hoạt tại layout `_app.tsx`:

```
Backend SSE Endpoints          Frontend Hooks
─────────────────────          ──────────────
GET /monitoring/events    ──▶  useLiveTemperature()    → cập nhật nhiệt độ/độ ẩm
GET /devices/fan/events   ──▶  useFanSSE()             → cập nhật trạng thái quạt
GET /alerts/events        ──▶  useAlertsSSE()          → push cảnh báo mới
```

**Cơ chế fallback:**
- Khi SSE đang kết nối → **tắt polling**, dữ liệu cập nhật qua stream
- Khi SSE mất kết nối → **tự động fallback về polling** (10s cho temperature, 5s cho fan)
- `EventSource` tự reconnect, khi nối lại → polling tắt lại

---

## API Endpoints

Frontend gọi các endpoint sau từ NestJS backend:

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/auth/login` | Đăng nhập |
| `GET` | `/auth/me` | Lấy thông tin user hiện tại |
| `GET` | `/monitoring/current` | Nhiệt độ/độ ẩm hiện tại |
| `GET` | `/monitoring/history` | Lịch sử nhiệt độ |
| `GET` | `/monitoring/events` | **SSE** — stream nhiệt độ real-time |
| `GET` | `/monitoring/threshold` | Lấy ngưỡng hiện tại |
| `PUT` | `/monitoring/threshold` | Cập nhật ngưỡng |
| `GET` | `/devices/status` | Trạng thái thiết bị |
| `GET` | `/devices/fan` | Trạng thái quạt |
| `PUT` | `/devices/fan/mode` | Đổi chế độ quạt (ON/OFF/AUTO) |
| `GET` | `/devices/fan/events` | **SSE** — stream trạng thái quạt |
| `GET` | `/alerts` | Danh sách cảnh báo |
| `GET` | `/alerts/events` | **SSE** — stream cảnh báo mới |
| `GET` | `/activity-logs` | Nhật ký hoạt động |

---

## Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy dev server (Vite) |
| `npm run build` | Build production |
| `npm run preview` | Preview bản build |
| `npm run lint` | Chạy ESLint |
| `npm run format` | Format code với Prettier |

---

## Thành viên nhóm

> _Cập nhật thông tin thành viên tại đây._

| STT | Họ tên | MSSV | Vai trò |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## License

Dự án phục vụ mục đích học tập — Đồ án Chuyên ngành, Trường Đại học Bách Khoa TP.HCM (HCMUT).
