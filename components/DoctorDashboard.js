import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert
} from '@mui/material';
import {
  CloudUpload,
  Analytics,
  Schedule,
  People,
  TrendingUp,
  Assessment,
  History,
  Settings
} from '@mui/icons-material';
import authService from '../services/authService';
import predictionService from '../services/predictionService';
import historyService from '../services/historyService';
import patientService from '../services/patientService';

const DoctorDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionError, setPredictionError] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();
  


  useEffect(() => {
    const fetchUserData = async () => {
      const user = authService.getCurrentUser();
      if (!user) {
        navigate('/');
        return;
      }
      
      try {
        const profile = await authService.getUserProfile();
        setUserDetails(profile || user);
        
        // Fetch recent analyses for stats
        try {
          const history = await historyService.getPredictionHistory();
          setRecentAnalyses(history);
        } catch (historyError) {
          console.error('Failed to load analysis history:', historyError);
          setRecentAnalyses([]);
        }
        
        // Fetch analytics data
        try {
          const analyticsData = await patientService.getAnalytics();
          setAnalytics(analyticsData);
        } catch (analyticsError) {
          console.error('Failed to load analytics:', analyticsError);
          setAnalytics(null);
        }
      } catch (error) {
        setUserDetails(user);
        setRecentAnalyses([]);
        setAnalytics(null);
      }
    };
    
    fetchUserData();
  }, [navigate]);



  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setPredictionResult(null);
      setPredictionError('');
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    setIsPredicting(true);
    setPredictionError('');

    try {
      const result = await predictionService.predictImage(selectedImage);
      setPredictionResult(result);
      
      // Refresh recent analyses
      try {
        const history = await historyService.getPredictionHistory();
        setRecentAnalyses(history);
        
        // Refresh analytics
        const analyticsData = await patientService.getAnalytics();
        setAnalytics(analyticsData);
      } catch (refreshError) {
        console.error('Failed to refresh data:', refreshError);
      }
    } catch (error) {
      setPredictionError(error.response?.data?.detail || 'Failed to analyze image');
    } finally {
      setIsPredicting(false);
    }
  };

  const stats = [
    { title: 'Total Analyses', value: analytics?.total_analyses?.toString() || recentAnalyses.length.toString(), color: '#2E7D32', icon: <Analytics />, trend: '+12%' },
    { title: 'This Month', value: analytics?.this_month?.toString() || recentAnalyses.filter(a => new Date(a.created_at).getMonth() === new Date().getMonth()).length.toString(), color: '#1976D2', icon: <TrendingUp />, trend: '+8%' },
    { title: 'Accuracy Rate', value: `${analytics?.accuracy_rate || 94.2}%`, color: '#ED6C02', icon: <Assessment />, trend: '+2.1%' },
    { title: 'Patients Consulted', value: analytics?.unique_patients?.toString() || '0', color: '#9C27B0', icon: <People />, trend: '+5' }
  ];

  const quickActions = [
    { title: 'My Schedule', icon: <Schedule />, color: '#2E7D32', action: () => navigate('/schedule') },
    { title: 'Patient Records', icon: <People />, color: '#1976D2', action: () => navigate('/patient-records') },
    { title: 'Analysis History', icon: <History />, color: '#ED6C02', action: () => navigate('/analysis-history') },
    { title: 'Settings', icon: <Settings />, color: '#9C27B0', action: () => navigate('/settings') }
  ];

  const recentActivities = recentAnalyses.slice(0, 3).map(analysis => ({
    type: 'Analysis',
    patient: analysis.patient_id || 'Anonymous Patient',
    time: new Date(analysis.created_at).toLocaleString(),
    status: 'completed',
    color: '#2E7D32',
    result: analysis.class_prediction
  }));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', p: 4, maxWidth: '1400px', mx: 'auto' }}>
        {/* Welcome Banner */}
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3, 
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Good Morning, Dr. {userDetails?.full_name?.split(' ')[0] || 'Doctor'}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Ready to analyze ultrasound images and help your patients
            </Typography>
          </Box>
          <Box sx={{ 
            position: 'absolute', 
            right: -50, 
            top: -50, 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            bgcolor: 'rgba(255,255,255,0.1)' 
          }} />
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)' 
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: `${stat.color}15`,
                      color: stat.color 
                    }}>
                      {stat.icon}
                    </Box>
                    <Chip 
                      label={stat.trend} 
                      size="small" 
                      sx={{ 
                        bgcolor: '#dcfce7', 
                        color: '#166534',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }} 
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* Image Analysis Section */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: 3, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  bgcolor: '#2E7D3215',
                  color: '#2E7D32',
                  mr: 2
                }}>
                  <Analytics sx={{ fontSize: '1.5rem' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    AFI Image Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload and analyze ultrasound images
                  </Typography>
                </Box>
              </Box>

              {/* Upload Area */}
              <Box
                sx={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: 3,
                  p: 6,
                  textAlign: 'center',
                  mb: 3,
                  bgcolor: imagePreview ? 'transparent' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    borderColor: '#2E7D32', 
                    bgcolor: '#f0fdf4' 
                  }
                }}
                onClick={() => document.getElementById('image-upload').click()}
              >
                {imagePreview ? (
                  <Box>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Typography variant="body1" sx={{ mt: 2, color: '#64748b', fontWeight: 500 }}>
                      Click to change image
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUpload sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                      Upload Ultrasound Image
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Drag and drop or click to select your ultrasound image
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#94a3b8' }}>
                      Supports JPG, PNG, DICOM formats
                    </Typography>
                  </Box>
                )}
              </Box>

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />

              {selectedImage && (
                <Button
                  variant="contained"
                  onClick={handleAnalyzeImage}
                  disabled={isPredicting}
                  fullWidth
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: '#2E7D32',
                    '&:hover': { bgcolor: '#1B5E20' },
                    mb: 3,
                    textTransform: 'none'
                  }}
                >
                  {isPredicting ? 'Analyzing Image...' : 'Analyze Image'}
                </Button>
              )}

              {predictionError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {predictionError}
                </Alert>
              )}

              {predictionResult && (
                <Paper sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                    Analysis Results
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                    <Chip
                      label={`${predictionResult.prediction || predictionResult.class}`}
                      sx={{ 
                        bgcolor: '#dcfce7', 
                        color: '#166534',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    />
                    <Chip
                      label={`${(predictionResult.confidence || 0).toFixed(1)}% Confidence`}
                      sx={{ 
                        bgcolor: '#dbeafe', 
                        color: '#1e40af',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    />
                  </Box>
                  {predictionResult.probabilities && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Detailed Probabilities:
                      </Typography>
                      {Object.entries(predictionResult.probabilities).map(([key, value]) => (
                        <Typography key={key} variant="body2" sx={{ mb: 0.5 }}>
                          {key}: {(value * 100).toFixed(1)}%
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Paper>
              )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Quick Actions */}
            <Paper sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 3, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} key={index}>
                    <Button
                      variant="outlined"
                      onClick={action.action}
                      sx={{
                        width: '100%',
                        p: 2,
                        borderRadius: 2,
                        borderColor: '#e2e8f0',
                        color: action.color,
                        flexDirection: 'column',
                        gap: 1,
                        textTransform: 'none',
                        '&:hover': { 
                          borderColor: action.color,
                          bgcolor: `${action.color}08`
                        }
                      }}
                    >
                      {action.icon}
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {action.title}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Recent Activity */}
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivities.map((activity, index) => (
                  <Box key={index} sx={{ 
                    p: 2, 
                    bgcolor: '#f8fafc', 
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'translateX(4px)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {activity.type}
                      </Typography>
                      <Chip 
                        label={activity.status} 
                        size="small" 
                        sx={{ 
                          bgcolor: `${activity.color}15`,
                          color: activity.color,
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Patient: {activity.patient}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
    </Box>
  );
};

export default DoctorDashboard;