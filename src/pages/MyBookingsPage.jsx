import React, { useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Button, CircularProgress, Modal, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import api from "../services/axios"; // your axios instance
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// Fetch user bookings
const fetchUserBookings = async () => {
  const response = await api.get("/bookings", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userBookings"],
    queryFn: fetchUserBookings,
  });

  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openEditPopup, setOpenEditPopup] = useState(false);

  const handleOpen = (booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setOpenEditPopup(false);
      queryClient.invalidateQueries(["userBookings"]);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Failed to load your bookings</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Bookings
      </Typography>

      <Grid container spacing={3}>
        {data?.map((booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking._id}>
            <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3, minWidth: 450 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {booking.flight.airline} ({booking.flight.airlineCode} - {booking.flight.flightNumber})
                </Typography>

                <Typography variant="body1" gutterBottom>
                  <strong>Origin:</strong> {booking.flight.origin} <br />
                  <strong>Destination:</strong> {booking.flight.destination} <br />
                  <strong>Departure:</strong> {new Date(booking.flight.departure).toLocaleString()} <br />
                  <strong>Arrival:</strong> {new Date(booking.flight.arrival).toLocaleString()} <br />
                  <strong>Price:</strong> ₹{booking.flight.price} <br />
                  <strong>Seat Numbers:</strong> {booking.seats.join(", ")} <br />
                  <strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleString()} <br />
                </Typography>

                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleOpen(booking)}
                >
                  View Details
                </Button>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Button variant="outlined" onClick={() => navigate(`/bookings/${booking._id}/edit`)}>
                    Edit
                  </Button>
                  <Button variant="outlined" onClick={() => setOpenEditPopup(true)} color="error">
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
            <Dialog open={openEditPopup} onClose={() => setOpenEditPopup(false)}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this booking? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenEditPopup(false)}>Cancel</Button>
                <Button onClick={()=>handleDelete(booking._id)} color="error">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        ))}
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {selectedBooking && (
            <>
              <Typography variant="h6">{selectedBooking?.flight?.airline} Flight {selectedBooking.flight.flightNumber}</Typography>
              <Typography variant="body1">
                <strong>Flight Details:</strong>
                <br />
                <strong>Airline: </strong>{selectedBooking?.flight?.airline}
                <br />
                <strong>Flight Number: </strong>Flight Number: {selectedBooking.flight.flightNumber}
                <br />
                <strong>Departure: </strong>Departure: {new Date(selectedBooking.flight.departure).toLocaleString()}
                <br />
                <strong>Arrival: </strong>Arrival: {new Date(selectedBooking.flight.arrival).toLocaleString()}
                <br />
                <strong>Price:</strong>Price: ₹{selectedBooking.flight.price}
              </Typography>
              <Typography variant="body1">
                <strong>Passengers:</strong>
                <ul>
                  {selectedBooking.passengers.map((passenger, idx) => (
                    <li key={idx}>
                      {passenger.name}, Age: {passenger.age}, Gender: {passenger.gender}, Seat: {passenger.seat}
                    </li>
                  ))}
                </ul>
              </Typography>
              <Typography variant="body1">
                <strong>Seat Numbers:</strong> {selectedBooking.seats.join(", ")}
              </Typography>
              <Typography variant="body1">
                <strong>Booking Date:</strong> {new Date(selectedBooking.bookingDate).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                <strong>Confirmation Number:</strong> {selectedBooking.confirmationNumber}
              </Typography>
              <Button onClick={handleClose} color="primary" sx={{ mt: 2 }}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  maxWidth: 600,
  maxHeight: "80vh",
  overflowY: "auto",
};

export default MyBookingsPage;
