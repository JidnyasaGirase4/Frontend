# Ignite Solar – Frontend (React + Vite)

Public website plus the admin panel (`/admin`, code in `src/admin`). All content is loaded from the Node backend in `../Backend`.

```
npm install
npm run dev      # http://localhost:5173  (proxies /api and /uploads to http://localhost:4000)
npm run build
```

Start MySQL (XAMPP) and the backend first (`cd ../Backend && npm start`). Set `VITE_API_URL` only if the API is hosted elsewhere.
