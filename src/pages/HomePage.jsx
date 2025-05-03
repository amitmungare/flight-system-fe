import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FlightCard from "../components/FlightCard"; // renamed from BookingCard
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import api from "../services/axios";
import SearchFlights from "../components/SearchFlights";

const fetchFlights = async (searchParams) => {
  const response = await api.get("/flights/search", {
    params: searchParams,
  });
  return response.data;
};

const HomePage = () => {
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    passengers: "",
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["flights", searchParams],
    queryFn: () => fetchFlights(searchParams),
  });

  const handleSearchResults = (params) => {
    setSearchParams(params); // Update search parameters
    refetch(); // Trigger the API call with new parameters
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Flights System
      </Typography>

      <SearchFlights onSearchResults={handleSearchResults} />
      {isLoading && (
        <CircularProgress
          sx={{ display: "block", margin: "auto", marginTop: "20%" }}
        />
      )}
      {(isError || data?.length === 0) && (
        <Typography color="error" sx={{ mt: 2 }}>
          No flights found for the given criteria.
        </Typography>
      )}
      <Grid container spacing={2} px={4}>
        {data?.map((flight) => (
          <Grid item xs={12} sm={6} md={4} key={flight._id}>
            <FlightCard flight={flight} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
