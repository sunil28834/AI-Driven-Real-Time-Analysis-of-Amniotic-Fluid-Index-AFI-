import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { LocalHospital, Download, Visibility } from '@mui/icons-material';
import historyService from '../services/historyService';

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const history = await historyService.getPredictionHistory();
        setRecords(history);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const getResultColor = (result) => {
    switch (result?.toLowerCase()) {
      case 'normal': return 'success';
      case 'low': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: '#9C27B0', color: 'white' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Health Records
        </Typography>
        <Typography variant="h6">
          Your complete medical test results and reports
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2E7D32' }}>
                {records.length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Records
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976D2' }}>
                {records.filter(r => r.class_prediction?.toLowerCase() === 'normal').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Normal Results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ED6C02' }}>
                {records.filter(r => r.class_prediction?.toLowerCase() !== 'normal').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Abnormal Results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 3 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Test Results
          </Typography>
        </Box>
        
        {records.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <LocalHospital sx={{ fontSize: '4rem', color: '#94a3b8', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No health records available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload your first ultrasound image to generate health records
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Test Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Result</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Confidence</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell>
                      {new Date(record.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>AFI Analysis</TableCell>
                    <TableCell>
                      <Chip
                        label={record.class_prediction}
                        color={getResultColor(record.class_prediction)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      {(record.confidence * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          sx={{ color: '#1976D2' }}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Download />}
                          sx={{ color: '#2E7D32' }}
                        >
                          Download
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default HealthRecords;