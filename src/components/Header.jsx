import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Flight Booking
        </Typography>
        <Box>
          {!isLoggedIn ? (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          ) : (
            <Box display="flex" alignItems="center">
              {user && (
                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  Hello, {user.name}
                </Typography>
              )}
              <Button color="inherit" onClick={() => navigate("/my-bookings")}>
                My Bookings
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
