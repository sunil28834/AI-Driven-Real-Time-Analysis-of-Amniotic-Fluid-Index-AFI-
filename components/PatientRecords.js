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
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search, Person, Visibility, Assessment } from '@mui/icons-material';
import historyService from '../services/historyService';
import patientService from '../services/patientService';

const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // Try to get patient records first, fallback to history
        const patientRecords = await patientService.getPatientRecords();
        if (patientRecords && patientRecords.length > 0) {
          setRecords(patientRecords);
        } else {
          const history = await historyService.getPredictionHistory();
          setRecords(history);
        }
      } catch (err) {
        setError('Failed to load patient records');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const filteredRecords = records.filter(record =>
    record.image_filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.class_prediction?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (prediction) => {
    switch (prediction?.toLowerCase()) {
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
    <Box sx={{ p: 4, maxWidth: '1400px', mx: 'auto' }}>
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: '#1976D2', color: 'white' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Patient Records
        </Typography>
        <Typography variant="h6">
          Manage and review patient analysis records
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <TextField
          fullWidth
          placeholder="Search patient records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper sx={{ borderRadius: 3 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Analysis Records ({filteredRecords.length})
          </Typography>
        </Box>

        {filteredRecords.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Person sx={{ fontSize: '4rem', color: '#94a3b8', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No Patient Records Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search criteria' : 'No analysis records available yet'}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Patient ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Analysis Result</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Confidence</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {new Date(record.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(record.created_at).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {record.patient_id || 'Anonymous'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {record.image_filename || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.class_prediction}
                        color={getStatusColor(record.class_prediction)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {(record.confidence * 100).toFixed(1)}%
                      </Typography>
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
                          startIcon={<Assessment />}
                          sx={{ color: '#2E7D32' }}
                        >
                          Details
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

      <Paper sx={{ p: 3, mt: 3, borderRadius: 3, bgcolor: '#f8fafc' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Quick Statistics
        </Typography>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2E7D32' }}>
              {records.filter(r => r.class_prediction?.toLowerCase() === 'normal').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Normal Results
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#ED6C02' }}>
              {records.filter(r => r.class_prediction?.toLowerCase() === 'low').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Low AFI Cases
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f' }}>
              {records.filter(r => r.class_prediction?.toLowerCase() === 'high').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High AFI Cases
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PatientRecords;