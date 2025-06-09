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
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  Chair as ChairIcon,
  ChairOutlined as ChairOutlinedIcon,
  EventSeat as EventSeatIcon,
  Close as CloseIcon,
  Info as InfoIcon
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

const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 10;
  const seats: Seat[] = [];

  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const seatNumber = i;
      const price = rowIndex < 3 ? 300 : rowIndex < 6 ? 250 : 200; // Different prices for different rows
      seats.push({
        id: `${row}${seatNumber}`,
        row,
        number: seatNumber,
        price,
        status: Math.random() < 0.2 ? 'booked' : 'available' // 20% chance of being booked
      });
    }
  });

  return seats;
};

const SeatBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    setSeats(generateSeats());
  }, [user, navigate]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') {
      toast.error('This seat is already booked');
      return;
    }

    const newSeats = seats.map(s => {
      if (s.id === seat.id) {
        return {
          ...s,
          status: s.status === 'selected' ? 'available' : 'selected'
        };
      }
      return s;
    });

    setSeats(newSeats);
    const newSelectedSeats = newSeats.filter(s => s.status === 'selected');
    setSelectedSeats(newSelectedSeats);
    setTotalAmount(newSelectedSeats.reduce((sum, seat) => sum + seat.price, 0));
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    localStorage.setItem('totalAmount', totalAmount.toString());
    navigate('/checkout');
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'booked':
        return theme.palette.error.main;
      case 'selected':
        return theme.palette.primary.main;
      default:
        return theme.palette.grey[400];
    }
  };

  const getSeatIcon = (status: string) => {
    switch (status) {
      case 'booked':
        return <ChairIcon />;
      case 'selected':
        return <EventSeatIcon />;
      default:
        return <ChairOutlinedIcon />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Seat Layout */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom align="center">
              Select Your Seats
            </Typography>
            
            {/* Screen */}
            <Box
              sx={{
                width: '80%',
                height: '40px',
                background: 'linear-gradient(180deg, #E50914 0%, #B81D24 100%)',
                margin: '0 auto 40px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            >
              SCREEN
            </Box>

            {/* Seat Legend */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ChairOutlinedIcon sx={{ color: theme.palette.grey[400] }} />
                <Typography variant="body2">Available</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventSeatIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body2">Selected</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ChairIcon sx={{ color: theme.palette.error.main }} />
                <Typography variant="body2">Booked</Typography>
              </Box>
            </Box>

            {/* Seats Grid */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              {Array.from(new Set(seats.map(seat => seat.row))).map(row => (
                <Box key={row} sx={{ display: 'flex', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      width: '24px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: theme.palette.text.secondary
                    }}
                  >
                    {row}
                  </Typography>
                  {seats
                    .filter(seat => seat.row === row)
                    .map(seat => (
                      <Tooltip
                        key={seat.id}
                        title={`${seat.row}${seat.number} - ₹${seat.price}`}
                        placement="top"
                      >
                        <IconButton
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === 'booked'}
                          sx={{
                            color: getSeatColor(seat.status),
                            '&:hover': {
                              transform: 'scale(1.1)',
                              transition: 'transform 0.2s'
                            }
                          }}
                        >
                          {getSeatIcon(seat.status)}
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              fontSize: '0.7rem',
                              color: seat.status === 'booked' ? 'transparent' : 'inherit'
                            }}
                          >
                            {seat.number}
                          </Typography>
                        </IconButton>
                      </Tooltip>
                    ))}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Booking Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Selected Seats ({selectedSeats.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedSeats.map(seat => (
                  <Chip
                    key={seat.id}
                    label={`${seat.row}${seat.number}`}
                    size="small"
                    color="primary"
                    onDelete={() => handleSeatClick(seat)}
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Price Details
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Seat Price</Typography>
                <Typography variant="body2">₹{totalAmount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Convenience Fee</Typography>
                <Typography variant="body2">₹{Math.round(totalAmount * 0.1)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">Total Amount</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ₹{totalAmount + Math.round(totalAmount * 0.1)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(229, 9, 20, 0.2)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(229, 9, 20, 0.3)',
                  transition: 'all 0.2s'
                }
              }}
            >
              Proceed to Payment
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SeatBooking; 