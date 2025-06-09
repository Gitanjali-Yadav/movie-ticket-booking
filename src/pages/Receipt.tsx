import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Print as PrintIcon,
  Movie as MovieIcon,
  EventSeat as SeatIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Seat {
  id: string;
  row: string;
  number: number;
  price: number;
  status: 'available' | 'booked' | 'selected';
}

const mockMovieDetails = {
  title: 'Jawan',
  language: 'Hindi',
  duration: '2h 49m',
  rating: 4.5,
  releaseDate: '2023-09-07',
  genre: 'Action/Thriller',
  director: 'Atlee',
  cast: 'Shah Rukh Khan, Nayanthara, Vijay Sethupathi',
  theatre: 'PVR Cinemas',
  location: 'Phoenix Marketcity, Kurla',
  showTime: '8:00 PM',
  screen: 'Screen 5',
  format: '2D'
};

const Receipt = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const storedSeats = localStorage.getItem('selectedSeats');
    const storedAmount = localStorage.getItem('totalAmount');
    const storedBookingId = localStorage.getItem('bookingId');

    if (!storedSeats || !storedAmount || !storedBookingId || storedBookingId !== bookingId) {
      toast.error('Invalid booking');
      navigate('/');
      return;
    }

    setSelectedSeats(JSON.parse(storedSeats));
    setTotalAmount(parseInt(storedAmount));
  }, [bookingId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleNewBooking = () => {
    // Clear booking data from localStorage
    localStorage.removeItem('selectedSeats');
    localStorage.removeItem('totalAmount');
    localStorage.removeItem('bookingId');
    navigate('/');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Booking Confirmation Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Booking Confirmed!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Your booking ID: {bookingId}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Booking Details */}
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Booking Details
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <MovieIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Movie
                      </Typography>
                      <Typography variant="body1">
                        {mockMovieDetails.title}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Date & Time
                      </Typography>
                      <Typography variant="body1">
                        {mockMovieDetails.showTime}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Venue
                      </Typography>
                      <Typography variant="body1">
                        {mockMovieDetails.theatre}, {mockMovieDetails.location}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <SeatIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Seats
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedSeats.map(seat => (
                          <Chip
                            key={seat.id}
                            label={`${seat.row}${seat.number}`}
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Customer Information */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {user?.displayName || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {user?.email || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Payment Information */}
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3, position: isMobile ? 'fixed' : 'sticky', bottom: isMobile ? 0 : 'auto', left: 0, right: 0, zIndex: 1000 }}>
              <Typography variant="h6" gutterBottom>
                Payment Information
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Seats
                  </Typography>
                  <Typography>₹{totalAmount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Convenience Fee
                  </Typography>
                  <Typography>₹{Math.floor(totalAmount * 0.1)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">
                    Total Amount
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    ₹{totalAmount + Math.floor(totalAmount * 0.1)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                  fullWidth
                >
                  Print
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNewBooking}
                  fullWidth
                >
                  Book Another Show
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Receipt; 