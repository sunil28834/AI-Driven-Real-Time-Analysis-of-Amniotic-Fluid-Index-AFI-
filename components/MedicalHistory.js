import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Search,
  LocalHospital,
  Medication,
  Assessment,
  Emergency,
  Schedule,
  Visibility
} from '@mui/icons-material';

const MedicalHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const historyItems = [
    {
      id: 1,
      date: '2024-01-10',
      type: 'consultation',
      title: 'Routine Prenatal Checkup',
      doctor: 'Dr. Sarah Johnson',
      description: 'Regular prenatal examination. All vitals normal. AFI within normal range.',
      outcome: 'Normal',
      icon: <LocalHospital />
    },
    {
      id: 2,
      date: '2024-01-05',
      type: 'imaging',
      title: 'Ultrasound Examination',
      doctor: 'Dr. Michael Chen',
      description: 'Detailed ultrasound scan. Fetal development on track. No abnormalities detected.',
      outcome: 'Normal',
      icon: <Assessment />
    },
    {
      id: 3,
      date: '2024-01-01',
      type: 'prescription',
      title: 'Medication Prescribed',
      doctor: 'Dr. Sarah Johnson',
      description: 'Prescribed prenatal vitamins and folic acid supplements.',
      outcome: 'Ongoing',
      icon: <Medication />
    },
    {
      id: 4,
      date: '2023-12-20',
      type: 'emergency',
      title: 'Emergency Visit',
      doctor: 'Dr. Emergency Team',
      description: 'Patient presented with severe morning sickness. IV fluids administered.',
      outcome: 'Resolved',
      icon: <Emergency />
    },
    {
      id: 5,
      date: '2023-12-01',
      type: 'consultation',
      title: 'First Prenatal Visit',
      doctor: 'Dr. Sarah Johnson',
      description: 'Initial prenatal consultation. Pregnancy confirmed. Due date established.',
      outcome: 'Normal',
      icon: <LocalHospital />
    }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'consultation': return '#2E7D32';
      case 'imaging': return '#1976D2';
      case 'prescription': return '#9C27B0';
      case 'emergency': return '#d32f2f';
      default: return '#64748b';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch(outcome) {
      case 'Normal': return 'success';
      case 'Resolved': return 'success';
      case 'Ongoing': return 'warning';
      case 'Pending': return 'info';
      default: return 'default';
    }
  };

  const filteredHistory = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ p: 4, maxWidth: '1400px', mx: 'auto' }}>
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)', 
        color: 'white'
      }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Medical History
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Complete timeline of your medical consultations and treatments
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search medical history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filterType}
              label="Filter by Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="consultation">Consultations</MenuItem>
              <MenuItem value="imaging">Imaging</MenuItem>
              <MenuItem value="prescription">Prescriptions</MenuItem>
              <MenuItem value="emergency">Emergency</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <List>
          {filteredHistory.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem sx={{ p: 3, alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ mt: 1 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: '50%', 
                    bgcolor: getTypeColor(item.type), 
                    color: 'white' 
                  }}>
                    {item.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                      <Chip 
                        label={item.outcome} 
                        color={getOutcomeColor(item.outcome)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        {item.date} • {item.doctor} • {item.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<Visibility />}
                        sx={{ 
                          borderColor: getTypeColor(item.type), 
                          color: getTypeColor(item.type) 
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  }
                />
              </ListItem>
              {index < filteredHistory.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {filteredHistory.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary">
            No medical history found matching your search criteria.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MedicalHistory;