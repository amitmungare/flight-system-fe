import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const formatDateTime = (datetime) =>
    new Date(datetime).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });  

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();
  return (
    <Card
      variant="outlined"
      sx={{ borderRadius: 2, boxShadow: 3, width: 350, maxWidth: 400 }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          {flight.airline} ({flight.airlineCode}-{flight.flightNumber})
        </Typography>

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="body1">
            {flight.origin} → {flight.destination}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          <strong>Duration:</strong> {flight.duration}
          </Typography>
        </Stack>

        <Stack direction="column" justifyContent="space-between">
          <Typography variant="body2">
            <strong>Departure:</strong> {formatDateTime(flight.departure)}
          </Typography>
          <Typography variant="body2">
          <strong>Arrival:</strong> {formatDateTime(flight.arrival)}
          </Typography>
        </Stack>

        <Typography variant="body2" sx={{ mt: 1 }}>
        <strong>Price:</strong> ₹{flight.price}
        </Typography>

        <Typography variant="body2" color="success.main">
        <strong>Seats Available:</strong> {flight.availableSeats}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          variant="contained"
          fullWidth
          onClick={() => navigate(`/book/${flight._id}`)}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default FlightCard;
