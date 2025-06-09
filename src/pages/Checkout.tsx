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
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  PhoneAndroid as UpiIcon,
  LocalAtm as WalletIcon,
  AccountBalance as AccountBalanceIcon,
  PhoneAndroid as PhoneAndroidIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon
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

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [phoneNumber, setPhoneNumber] = useState('');

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: <CreditCardIcon /> },
    { id: 'upi', label: 'UPI', icon: <PhoneAndroidIcon /> },
    { id: 'netbanking', label: 'Net Banking', icon: <AccountBalanceIcon /> },
    { id: 'wallet', label: 'Wallets', icon: <AccountBalanceWalletIcon /> }
  ];

  const walletOptions = [
    'Paytm',
    'Amazon Pay',
    'PhonePe',
    'Google Pay',
    'MobiKwik'
  ];

  const bankOptions = [
    'HDFC Bank',
    'ICICI Bank',
    'State Bank of India',
    'Axis Bank',
    'Kotak Mahindra Bank'
  ];

  useEffect(() => {
    const storedSeats = localStorage.getItem('selectedSeats');
    const storedAmount = localStorage.getItem('totalAmount');

    if (!storedSeats || !storedAmount) {
      toast.error('No seats selected');
      navigate('/');
      return;
    }

    setSelectedSeats(JSON.parse(storedSeats));
    setTotalAmount(parseInt(storedAmount));
  }, [navigate]);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    const res = await initializeRazorpay();
    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return;
    }

    const options: RazorpayOptions = {
      key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      name: 'BookMyShow Clone',
      description: 'Movie Ticket Booking',
      order_id: 'order_' + Math.random().toString(36).substr(2, 9),
      handler: function (response: any) {
        // Handle successful payment
        const bookingId = 'booking_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('bookingId', bookingId);
        navigate(`/receipt/${bookingId}`);
      },
      prefill: {
        name: user?.displayName || '',
        email: user?.email || '',
        contact: phoneNumber,
      },
      theme: {
        color: theme.palette.primary.main,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Payment Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <FormLabel component="legend">Select Payment Method</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {paymentMethods.map((method) => (
                  <FormControlLabel
                    key={method.id}
                    value={method.id}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {method.icon}
                        <Typography>{method.label}</Typography>
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </Box>

            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handlePayment}
            >
              Pay ₹{totalAmount + Math.floor(totalAmount * 0.1)}
            </Button>
          </Paper>
        </Grid>

        {/* Booking Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: isMobile ? 'fixed' : 'sticky', bottom: isMobile ? 0 : 'auto', left: 0, right: 0, zIndex: 1000 }}>
            <Typography variant="h6" gutterBottom>
              Booking Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Selected Seats ({selectedSeats.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {selectedSeats.map(seat => (
                  <Chip
                    key={seat.id}
                    label={`${seat.row}${seat.number}`}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Price Details
              </Typography>
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
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout; 