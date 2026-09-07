# Gen-Z Digital Storefront

## Project Structure

```text
genz-digital-storefront/
│
├── frontend/
│   │
│   ├── public/
│   │   └── assets/
│   │
│   ├── src/
│   │   │
│   │   ├── app/
│   │   │   ├── App.jsx
│   │   │   ├── routes.jsx
│   │   │   └── providers.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── navbar/
│   │   │   ├── footer/
│   │   │   └── ui/
│   │   │
│   │   ├── pages/
│   │   │   └── landing/
│   │   │       ├── LandingPage.jsx
│   │   │       ├── HeroSection.jsx
│   │   │       ├── FeaturedProducts.jsx
│   │   │       ├── CategoriesSection.jsx
│   │   │       ├── AboutSection.jsx
│   │   │       └── ContactSection.jsx
│   │   │
│   │   ├── epics/
│   │   │   │
│   │   │   ├── ep01-product/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── hooks/
│   │   │   │
│   │   │   ├── ep02-order/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── hooks/
│   │   │   │
│   │   │   ├── ep03-delivery-review/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── hooks/
│   │   │   │
│   │   │   └── ep04-administration/
│   │   │       ├── components/
│   │   │       ├── pages/
│   │   │       ├── services/
│   │   │       └── hooks/
│   │   │
│   │   ├── modules/
│   │   │   └── supplier-procurement/
│   │   │       ├── components/
│   │   │       ├── pages/
│   │   │       ├── services/
│   │   │       └── hooks/
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── apiClient.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── assets/
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── variables.css
│   │   │
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── environment.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── rbac.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validation.middleware.js
│   │   │
│   │   ├── shared/
│   │   │   ├── utils/
│   │   │   ├── constants/
│   │   │   ├── validators/
│   │   │   └── errors/
│   │   │
│   │   ├── epics/
│   │   │   │
│   │   │   ├── ep01-product/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── repositories/
│   │   │   │   ├── models/
│   │   │   │   ├── routes/
│   │   │   │   └── validators/
│   │   │   │
│   │   │   ├── ep02-order/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── repositories/
│   │   │   │   ├── models/
│   │   │   │   ├── routes/
│   │   │   │   └── validators/
│   │   │   │
│   │   │   ├── ep03-delivery-review/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── repositories/
│   │   │   │   ├── models/
│   │   │   │   ├── routes/
│   │   │   │   └── validators/
│   │   │   │
│   │   │   └── ep04-administration/
│   │   │       ├── controllers/
│   │   │       ├── services/
│   │   │       ├── repositories/
│   │   │       ├── models/
│   │   │       ├── routes/
│   │   │       └── validators/
│   │   │
│   │   ├── modules/
│   │   │   └── supplier-procurement/
│   │   │       ├── controllers/
│   │   │       ├── services/
│   │   │       ├── repositories/
│   │   │       ├── models/
│   │   │       ├── routes/
│   │   │       └── validators/
│   │   │
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
│
├── docs/
│   ├── architecture/
│   ├── database/
│   ├── api/
│   ├── decisions/
│   └── testing/
│
├── .gitignore
├── README.md
└── package.json
```

---

## Administration Portal & Access Credentials

### Admin Access Key
```text
GENZ-ADMIN-2026
```

### Accessing the Admin Console
- **Direct Login Route**: `http://localhost:5174/admin/login` (or port `5173`)
- **Discreet Brand Entry**: Click the **GEN-Z** logo mark in the public footer 3 times to open the access key prompt.

### Admin Features Available:
1. **Executive Dashboard (`/admin/dashboard`)**: Live KPI metrics, department revenue distribution, real-time recent order dispatch tracking.
2. **Review Moderation (`/admin/reviews`)**: Approve, reject, or delete customer reviews submitted via the storefront.
3. **Supplier Directory (`/admin/suppliers`)**: Vendor profiles, contact particulars, sourcing categories, payment terms, and partner CRUD operations.
