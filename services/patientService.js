import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8000/api/patients/';

const getPatientRecords = async () => {
  try {
    const user = authService.getCurrentUser();
    const response = await axios.get(API_URL + 'records', {
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patient records:', error);
    return [];
  }
};

const getAnalytics = async () => {
  try {
    const user = authService.getCurrentUser();
    const response = await axios.get(API_URL + 'analytics', {
      headers: {
        Authorization: `Bearer ${user.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return {
      total_analyses: 0,
      this_month: 0,
      unique_patients: 0,
      accuracy_rate: 0
    };
  }
};

const patientService = {
  getPatientRecords,
  getAnalytics,
};

export default patientService;