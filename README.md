# MOYO Product Management Portal

A cloud-deployed product-management portal supporting a **Capturer/Manager workflow**, secure **OAuth2 / OIDC authentication**, and a **Data Lake** for quick retrieval of approved products.

---

## Features

- **Auth0-powered OAuth2 / OIDC** login
- **Role-based Access Control**:
  - **Capturer:** Create, Read, Update products
  - **Manager:** Approve, Reject, Soft-Delete products
- **Product Workflow:**
  - Capturer submits → Manager approves/rejects
  - Approved products exported to **Data Lake JSON**
- **Real-time sync** between SQLite DB and Data Lake
- **Public Cloud PaaS** deployment on Render

---

## Tech Stack

| Layer         | Technology                  |
|---------------|----------------------------|
| Frontend      | React                       |
| Backend       | ASP.NET Core 8 (C#)         |
| Database      | Entity Framework + SQLite   |
| Auth          | Auth0 (OAuth2 / OIDC)       |
| Deployment    | Docker + Render (PaaS)      |
| Data Lake     | JSON file for quick reads   |

---

## Project Structure
```bash
ProductManagement/                # Root folder
│
├── Controllers/
│   └── ProductController.cs      # REST API for Products
│
├── Data/
│   ├── AppDbContext.cs           # EF Core DB Context
│   └── DataLakeService.cs        # Sync DB <-> Data Lake
│
├── Models/
│   └── Product.cs                # Product Entity
│
├── client/                       # React Frontend (SPA)
│   ├── src/                      # React Components & Pages
│   └── package.json
│
├── data_lake.json                # Quick-access Data Lake (Approved Products)
│
├── appsettings.json              # Config for API, Auth0, DB
├── Dockerfile                    # Multi-stage build (API + React)
└── Program.cs / Startup.cs       # API entrypoint
```

## User Roles & Permissions

| Role            | Permissions                                   |
|-----------------|-----------------------------------------------|
| **Capturer**    | Create, Read, Update products                 |
| **Manager**     | Approve, Reject, Soft-Delete products         |

---

## API Endpoints

| Method | Endpoint                     | Role       | Description                           |
|--------|------------------------------|------------|---------------------------------------|
| GET    | `/api/product`                | All Auth   | List all products                     |
| GET    | `/api/product/{id}`           | All Auth   | Get product by ID                     |
| POST   | `/api/product`                | Capturer   | Create product (auto → Pending)       |
| PUT    | `/api/product/{id}`           | Capturer   | Update product (reverts → Pending)    |
| POST   | `/api/product/{id}/approve`   | Manager    | Approve a product                     |
| POST   | `/api/product/{id}/reject`    | Manager    | Reject a product                      |
| DELETE | `/api/product/{id}`           | Manager    | Soft-delete a product                 |

---

## Data Lake Integration
- **`data_lake.json`** stores only **Approved** products for **fast retrieval**.
- Synchronized automatically on:
  - Approve / Reject
  - Add / Update / Delete
- Located at: `ProductManagement/data_lake.json`

---

## Deployment
1. Codebase pushed to GitHub
2. Connected to **Render → New Web Service**
3. Built from `Dockerfile` (multi-stage build)
4. App served on live URL (React + API)
5. **Callback URLs** configured in **Auth0** to include Render domain:
    https://<your-app>.onrender.com
    https://<your-app>.onrender.com/login/callback

---

## How to Run Locally (Dev Mode)
```bash
# Clone repo
git clone https://github.com/3Po1nt/MOYO_ProductManagement
cd MOYO_ProductManagement

# Start frontend
cd ProductManagement/client
npm install
npm start

# Start backend
cd ..
dotnet run
