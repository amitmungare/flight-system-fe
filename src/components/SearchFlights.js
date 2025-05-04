import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Box, Typography, MenuItem } from '@mui/material';

const SearchFlights = ({ onSearchResults }) => {
  const airports = ["PNQ", "DEL", "BLR", "BOM", "HYD", "MAA", "CCU"];
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    passengers: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const { origin, destination, departureDate, passengers } = formData;

    // Pass the form data to the parent component
    onSearchResults({
      origin,
      destination,
      departureDate,
      passengers,
    });
  };

  return (
    <Container sx={{ mt: 4, mb: 4, backgroundColor: '#f5f5f5', borderRadius: 2, padding: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Search Flights
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
    <TextField
      select
      label="Origin"
      variant="outlined"
      fullWidth
      name="origin"
      value={formData.origin}
      onChange={handleInputChange}
      sx={{minWidth: 160}}
    >
      {airports.map((code) => (
        <MenuItem key={code} value={code}>
          {code}
        </MenuItem>
      ))}
    </TextField>
  </Grid>

  <Grid item xs={12} sm={6} md={3}>
    <TextField
      select
      label="Destination"
      variant="outlined"
      fullWidth
      name="destination"
      value={formData.destination}
      onChange={handleInputChange}
      sx={{minWidth: 160}}
    >
      {airports.map((code) => (
        <MenuItem key={code} value={code}>
          {code}
        </MenuItem>
      ))}
    </TextField>
  </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Departure Date"
              variant="outlined"
              type="date"
              fullWidth
              name="departureDate"
              value={formData.departureDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{minWidth: 160}}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Number of Passengers"
              variant="outlined"
              type="number"
              fullWidth
              name="passengers"
              value={formData.passengers}
              onChange={handleInputChange}
            />
          </Grid>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="contained" onClick={handleSearch}>
            Search Flights
          </Button>
        </Box>
        </Grid>


      </Box>
    </Container>
  );
};

export default SearchFlights;
