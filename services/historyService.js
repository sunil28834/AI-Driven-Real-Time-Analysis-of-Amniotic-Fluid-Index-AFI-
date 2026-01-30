import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8000/api/history/';

const getPredictionHistory = async () => {
  try {
    const user = authService.getCurrentUser();
    const response = await axios.get(API_URL + 'predictions', {
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch prediction history:', error);
    return [];
  }
};

const getPredictionDetails = async (predictionId) => {
  try {
    const user = authService.getCurrentUser();
    const response = await axios.get(API_URL + `predictions/${predictionId}`, {
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch prediction details:', error);
    throw error;
  }
};

const historyService = {
  getPredictionHistory,
  getPredictionDetails,
};

export default historyService;