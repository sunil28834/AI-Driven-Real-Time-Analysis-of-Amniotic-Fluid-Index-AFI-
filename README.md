# Amniotic Fluid Index (AFI) Classification Web Application

## Description
A full-stack web application for classifying ultrasound images into AFI categories (normal, low, high) using a deep learning model. Built with React frontend and FastAPI backend.

## Tech Stack
- **Frontend**: React, Material-UI (MUI), Axios, React Router
- **Backend**: FastAPI, Uvicorn, Motor (async MongoDB driver)
- **ML**: TensorFlow/Keras, scikit-learn
- **Database**: MongoDB

## Prerequisites
- Python 3.10+ installed
- Node.js 16+ and npm installed
- MongoDB running locally (or MongoDB Atlas connection string)

## Installation & Setup

### 1. Backend Setup

Navigate to the backend directory:
```powershell
cd Application-main\backend
```

Create and activate a virtual environment:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate
```

Upgrade pip and install dependencies:
```powershell
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

Set up environment variables:
1. Copy `.env.example` to `.env`:
   ```powershell
   copy .env.example .env
   ```
2. Edit `.env` and set:
   - `SECRET_KEY`: Generate a secure key using:
     ```powershell
     python -c "import secrets; print(secrets.token_urlsafe(32))"
     ```
   - `MONGO_URL`: Your MongoDB connection string (default: `mongodb://localhost:27017`)

### 2. Train the Model (Optional - if you have training data)

If you have training images organized in folders by class:
```powershell
cd ml
python train_model.py
```

The model will be saved to `backend\ml\model\image_model` as a TensorFlow SavedModel.

### 3. Start Backend Server

From the `backend` directory:
```powershell
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

### 4. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```powershell
cd Application-main\frontend
```

Install dependencies:
```powershell
npm install
```

Start the development server:
```powershell
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

- `GET /` - API welcome message
- `POST /api/auth/register` - User registration
- `POST /api/auth/token` - User login (returns JWT token)
- `GET /api/auth/me` - Get current user info (requires authentication)
- `POST /api/prediction/predict_image` - Predict AFI class from uploaded image (requires authentication)

## Project Structure

```
Application-main/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── routers/             # API route handlers
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   └── prediction.py   # Image prediction endpoint
│   │   ├── models/              # Pydantic models
│   │   └── utils/               # Utilities (auth, database)
│   ├── ml/
│   │   ├── train_model.py       # Model training script
│   │   └── model/               # Saved model directory
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   └── services/            # API service functions
│   └── package.json             # Node.js dependencies
└── README.md
```

## Troubleshooting

### Backend won't start
- Ensure `SECRET_KEY` is set in `.env` file
- Check that MongoDB is running (or `MONGO_URL` is correct)
- Verify all dependencies are installed: `pip install -r requirements.txt`

### Model not found error
- Ensure the model is trained and saved to `backend/ml/model/image_model`
- The model should be a TensorFlow SavedModel format
- Check that `labels.json` exists in the model directory

### Frontend can't connect to backend
- Verify backend is running on port 8000
- Check CORS settings in `backend/app/main.py`
- Ensure the API URL in `frontend/src/services/predictionService.js` matches your backend URL

## Development Notes

- The backend uses async/await with Motor for MongoDB operations
- Authentication uses JWT tokens with 30-minute expiration
- Model predictions return class probabilities and confidence scores
- Frontend uses Material-UI for consistent styling

## License
MIT License

Copyright (c) 2026 Sunil T R

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
