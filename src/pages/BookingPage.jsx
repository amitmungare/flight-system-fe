import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardHeader,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../services/axios";

const genders = ["male", "female", "other"];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

const BookingPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState([]);
  const [passengers, setPassengers] = useState([
    { name: "", age: "", gender: "", seat: "" },
  ]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await api.get(`/flights/${flightId}`);
        setFlight(res.data);
      } catch (err) {
        console.error("Failed to fetch flight", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [flightId]);

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleAddPassenger = () => {
    setPassengers([...passengers, { name: "", age: "", gender: "", seat: "" }]);
  };

  const handleSeatChange = (index, value) => {
    const updated = [...seats];
    updated[index] = parseInt(value, 10);
    setSeats(updated);
  };

  const handleBooking = async () => {
    try {
      const res = await api.post("/bookings", {
        flightId,
        passengers
      });

      setSnackbarMessage(`Booking successful! Confirmation: ${res.data.confirmationNumber}`);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      navigate("/my-bookings");
    } catch (err) {
        setSnackbarMessage(err.response?.data?.message || "Booking failed");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
    }
  };

  if (loading) return <CircularProgress />;

  const handleRemovePassenger = (idx) => {
    const updatedPassengers = [...passengers];
    const updatedSeats = [...seats];

    updatedPassengers.splice(idx, 1);
    updatedSeats.splice(idx, 1);

    setPassengers(updatedPassengers);
    setSeats(updatedSeats);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Booking for Flight: {flight.airline} ({flight.airlineCode}-
        {flight.flightNumber})
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Flight Details" />
        <CardContent sx={{ gap: 1 }}>
          <Typography variant="body1">
            <strong>Departure:</strong> {flight.departureAirport} at{" "}
            {formatDate(flight.departure)}
          </Typography>
          <Typography variant="body1">
            <strong>Arrival:</strong> {flight.arrivalAirport} at{" "}
            {formatDate(flight.arrival)}
          </Typography>
          <Typography variant="body1">
            <strong>Flight Number:</strong> {flight.flightNumber}
          </Typography>
          <Typography variant="body1">
            <strong>Available Seats:</strong> {flight.availableSeats}
          </Typography>
          <Typography variant="body1">
            <strong>Origin:</strong> {flight.origin}
          </Typography>
          <Typography variant="body1">
            <strong>Destination:</strong> {flight.destination}
          </Typography>
          <Typography variant="body1">
            <strong>Duration:</strong> {flight.duration}
          </Typography>
        </CardContent>
      </Card>

      {passengers.map((p, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <Typography variant="h6">Passenger {idx + 1}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Name"
                value={p.name}
                fullWidth
                onChange={(e) =>
                  handlePassengerChange(idx, "name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Age"
                type="number"
                value={p.age}
                fullWidth
                onChange={(e) =>
                  handlePassengerChange(idx, "age", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Gender"
                value={p.gender}
                fullWidth
                onChange={(e) =>
                  handlePassengerChange(idx, "gender", e.target.value)
                }
                sx={{ minWidth: 120 }}
              >
                {genders.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Seat Number</InputLabel>
                <Select
                  value={seats[idx] || ""}
                  label="Seat Number"
                  onChange={(e) => {
                    handleSeatChange(idx, e.target.value)
                    handlePassengerChange(idx, "seat", e.target.value)
                  }}
                  sx={{ minWidth: 160 }}
                >
                  {Array.from(
                    { length: flight.availableSeats },
                    (_, i) => i + 1
                  ).map((seatNum) => {
                    // Convert seatNum to string for comparison
                    const isBooked = flight.bookedSeats.includes(
                      seatNum.toString()
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
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemovePassenger(idx)}
                sx={{ mt: 2 }}
              >
                X
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button variant="outlined" onClick={handleAddPassenger}>
        Add Passenger
      </Button>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={handleBooking}>
          Confirm Booking
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default BookingPage;
