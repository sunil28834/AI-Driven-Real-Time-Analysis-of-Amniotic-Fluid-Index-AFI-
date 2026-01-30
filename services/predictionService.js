import axios from 'axios';
import authService from './authService';

// Canonical prediction endpoint - uses the main FastAPI router
const PREDICTION_URL = 'http://localhost:8000/api/prediction/predict_image';

const predictImage = async (imageFile) => {
  const user = authService.getCurrentUser();
  const formData = new FormData();
  formData.append('file', imageFile);

  const headers = {
    'Content-Type': 'multipart/form-data',
    ...(user?.access_token ? { Authorization: `Bearer ${user.access_token}` } : {})
  };

  try {
    const res = await axios.post(PREDICTION_URL, formData, { 
      headers, 
      timeout: 30000 
    });
    return res.data;
  } catch (err) {
    // Provide more detailed error information
    const errorMessage = err.response?.data?.detail || err.message || 'Prediction failed';
    throw new Error(`Prediction error: ${errorMessage}`);
  }
};

const predictionService = { predictImage };

export default predictionService;