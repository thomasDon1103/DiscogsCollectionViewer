# Vue TypeScript + Flask Example

A full-stack application with a Vue 3 TypeScript frontend and Python Flask backend.

## Project Structure

```
.
├── backend/
│   ├── app.py              # Flask application with REST API endpoints
│   └── requirements.txt    # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── UserForm.vue    # Form component for creating/editing users
    │   │   └── UserList.vue    # Component to display user list
    │   ├── services/
    │   │   └── api.ts          # API service layer with axios
    │   ├── types/
    │   │   └── User.ts         # TypeScript interfaces
    │   ├── App.vue             # Main application component
    │   ├── main.ts             # Application entry point
    │   └── style.css           # Global styles
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

## Backend Setup (Flask)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the Flask server:
   ```bash
   python app.py
   ```

   The backend will run on `http://localhost:5000`

## Frontend Setup (Vue + TypeScript)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

## API Endpoints

The Flask backend provides the following REST API endpoints:

- `GET /api/health` - Health check endpoint
- `GET /api/users` - Get all users
- `GET /api/users/<id>` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/<id>` - Update a user
- `DELETE /api/users/<id>` - Delete a user

## Features

- **Vue 3 Composition API** with TypeScript
- **Type-safe API calls** using axios and TypeScript interfaces
- **CRUD operations** for user management
- **Component-based architecture**
- **Reactive state management**
- **CORS enabled** for cross-origin requests
- **Vite** for fast development and building

## Technologies Used

### Backend
- Python 3.x
- Flask
- Flask-CORS

### Frontend
- Vue 3
- TypeScript
- Vite
- Axios

## Development

Make sure both the backend and frontend servers are running simultaneously:

1. Terminal 1: Run Flask backend on port 5000
2. Terminal 2: Run Vue frontend on port 3000

The frontend is configured to proxy API requests to the backend automatically.