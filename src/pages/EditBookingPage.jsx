import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "../services/axios";

const EditBookingPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [flight, setFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [seats, setSeats] = useState([]);
  

  const { data, isLoading, error } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const res = await api.get(`/bookings/${id}`);
      setPassengers(res.data.passengers)
      setFlight(res.data.flight);
      setSeats(res.data.passengers.map((passenger) => passenger.seat));
      return res.data;
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: (updatedPassengers) =>
      api.put(`/bookings/${id}`, { passengers: updatedPassengers }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      navigate("/my-bookings");
    },
    onError: (err) => {
      console.error("Update error:", err.response?.data?.message || err.message);
    },
  });

  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = () => {
    updateBookingMutation.mutate(passengers);
  };

  const handleSeatChange = (index, value) => {
    const updated = [...seats];
    updated[index] = parseInt(value, 10);
    setSeats(updated);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Error loading booking.</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit Booking
      </Typography>

      <Grid container spacing={2} sx={{display:"flex", flexDirection: "column"}}>
        {passengers.map((passenger, idx) => (
        <Grid item sx={{ display: "flex", justifyContent: "row", gap: 2 }} key={idx}>
            {console.log("passenger", passenger)}
          <React.Fragment key={idx}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Name"
                fullWidth
                value={passenger.name}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Age"
                type="number"
                fullWidth
                value={passenger.age}
                onChange={(e) => handleChange(idx, "age", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Seat Number</InputLabel>
                <Select
                  value={passenger.seat || ""}
                  label="Seat Number"
                  onChange={(e) => {
                    handleSeatChange(idx, e.target.value)
                    handleChange(idx, "seat", e.target.value)}
                  }
                  sx={{ minWidth: 160 }}
                >
                  {Array.from(
                    { length: flight.availableSeats },
                    (_, i) => i + 1
                  ).map((seatNum) => {
                    // Convert seatNum to string for comparison
                    const isBooked = flight.bookedSeats.includes(
                      seatNum
                    );
                    const isAlreadySelected =
                        seats.includes(seatNum) && seats[idx] !== seatNum;


                    return (
                      <MenuItem
                        key={seatNum}
                        value={seatNum}
                        disabled={isBooked || isAlreadySelected}
                      >
                        Seat {seatNum}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </React.Fragment>
          </Grid>
        ))}
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={updateBookingMutation.isLoading}
        >
          {updateBookingMutation.isLoading ? "Updating..." : "Update Booking"}
        </Button>
      </Box>
    </Paper>
  );
};

export default EditBookingPage;
