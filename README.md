# Grocery Bud (Django REST + React)

A simple Grocery List CRUD API built with Django REST Framework, plus a React (Vite) frontend.

## Repo structure

- `backend/` Django project (API)
- `frontend/` React (Vite) app

## Local dev (quickstart)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_grocery  # load sample data
python manage.py runserver
```

API runs at `http://127.0.0.1:8000/api/grocery/`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

# Djnagorest
