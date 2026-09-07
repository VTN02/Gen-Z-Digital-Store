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
