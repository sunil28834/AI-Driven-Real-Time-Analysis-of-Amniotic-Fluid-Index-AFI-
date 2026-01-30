import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Assessment, CalendarToday } from '@mui/icons-material';
import historyService from '../services/historyService';

const AnalysisHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await historyService.getPredictionHistory();
        setPredictions(history);
      } catch (err) {
        setError('Failed to load analysis history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getStatusColor = (prediction) => {
    switch (prediction.toLowerCase()) {
      case 'normal': return { bgcolor: '#dcfce7', color: '#166534' };
      case 'low': return { bgcolor: '#fef3c7', color: '#92400e' };
      case 'high': return { bgcolor: '#fecaca', color: '#dc2626' };
      default: return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Assessment sx={{ fontSize: '2rem', color: '#2E7D32', mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Analysis History
        </Typography>
      </Box>

      {predictions.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Assessment sx={{ fontSize: '4rem', color: '#94a3b8', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No Analysis History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload your first ultrasound image to see analysis results here.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Result</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Confidence</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {predictions.map((prediction) => (
                <TableRow key={prediction.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday sx={{ fontSize: '1rem', color: '#64748b' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {new Date(prediction.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(prediction.created_at).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {prediction.image_filename || 'Unknown'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={prediction.class_prediction}
                      sx={{
                        ...getStatusColor(prediction.class_prediction),
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {(prediction.confidence * 100).toFixed(1)}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {prediction.probabilities && Object.entries(prediction.probabilities).map(([key, value]) => (
                        <Typography key={key} variant="caption" sx={{ display: 'block', color: '#64748b' }}>
                          {key}: {(value * 100).toFixed(1)}%
                        </Typography>
                      ))}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AnalysisHistory;