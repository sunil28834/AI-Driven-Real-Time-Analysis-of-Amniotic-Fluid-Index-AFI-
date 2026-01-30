import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress
} from '@mui/material';
import { Assessment, TrendingUp, PieChart, Download } from '@mui/icons-material';
import historyService from '../services/historyService';

const Reports = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const history = await historyService.getPredictionHistory();
        setPredictions(history);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStats = () => {
    const total = predictions.length;
    const normal = predictions.filter(p => p.class_prediction?.toLowerCase() === 'normal').length;
    const low = predictions.filter(p => p.class_prediction?.toLowerCase() === 'low').length;
    const high = predictions.filter(p => p.class_prediction?.toLowerCase() === 'high').length;
    
    return { total, normal, low, high };
  };

  const stats = getStats();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: '#ED6C02', color: 'white' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Analysis Reports
        </Typography>
        <Typography variant="h6">
          Comprehensive analysis and statistics of your AFI results
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment sx={{ fontSize: '3rem', color: '#2E7D32', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2E7D32' }}>
                {stats.total}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Analyses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: '3rem', color: '#1976D2', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976D2' }}>
                {stats.normal}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Normal Results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <PieChart sx={{ fontSize: '3rem', color: '#ED6C02', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ED6C02' }}>
                {stats.low}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Low AFI
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment sx={{ fontSize: '3rem', color: '#d32f2f', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                {stats.high}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                High AFI
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 3, mb: 3 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Detailed Analysis Report
          </Typography>
          <Button
            variant="contained"
            startIcon={<Download />}
            sx={{ bgcolor: '#2E7D32' }}
          >
            Export Report
          </Button>
        </Box>
        
        {predictions.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Assessment sx={{ fontSize: '4rem', color: '#94a3b8', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No analysis data available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Perform some AFI analyses to generate reports
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Result</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Confidence</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {predictions.map((prediction) => (
                  <TableRow key={prediction.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {new Date(prediction.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(prediction.created_at).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {prediction.image_filename || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {prediction.class_prediction}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {(prediction.confidence * 100).toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={prediction.class_prediction?.toLowerCase() === 'normal' ? 'Normal' : 'Requires Attention'}
                        color={prediction.class_prediction?.toLowerCase() === 'normal' ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Summary Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Normal AFI Rate:</strong> {stats.total > 0 ? ((stats.normal / stats.total) * 100).toFixed(1) : 0}%
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Low AFI Rate:</strong> {stats.total > 0 ? ((stats.low / stats.total) * 100).toFixed(1) : 0}%
            </Typography>
            <Typography variant="body2">
              <strong>High AFI Rate:</strong> {stats.total > 0 ? ((stats.high / stats.total) * 100).toFixed(1) : 0}%
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Average Confidence:</strong> {predictions.length > 0 ? (predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length * 100).toFixed(1) : 0}%
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Most Recent Analysis:</strong> {predictions.length > 0 ? new Date(predictions[0].created_at).toLocaleDateString() : 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Total Analyses This Month:</strong> {predictions.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Reports;