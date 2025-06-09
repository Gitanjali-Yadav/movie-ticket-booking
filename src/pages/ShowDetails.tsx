import React, { useState } from 'react';
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
  Rating,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccessTime,
  Language,
  CalendarToday,
  LocationOn,
  Star,
  PlayArrow
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface MovieDetails {
  id: string;
  title: string;
  image: string;
  rating: number;
  language: string;
  duration: string;
  genre: string;
  releaseDate: string;
  description: string;
  director: string;
  cast: string;
  synopsis: string;
  trailerUrl: string;
  price: {
    standard: number;
    premium: number;
    vip: number;
  };
  shows: { time: string; type: string }[];
  theatres: {
    name: string;
    location: string;
    shows: { time: string; type: string }[];
  }[];
}

const mockMovieDetails: MovieDetails = {
  id: '1',
  title: 'Jawan',
  language: 'Hindi',
  duration: '2h 49m',
  rating: 4.5,
  image: 'https://assets-in.bmscdn.com/iedb/movie/2023/3/thumb/thumb_1_1920x1080.jpg',
  releaseDate: '2023-09-07',
  genre: 'Action/Thriller',
  director: 'Atlee',
  cast: 'Shah Rukh Khan, Nayanthara, Vijay Sethupathi',
  synopsis: 'A high-octane action thriller that outlines the emotional journey of a man who is set to rectify the wrongs in society.',
  price: {
    standard: 150,
    premium: 250,
    vip: 350
  },
  shows: [
    { time: '10:00 AM', type: '2D' },
    { time: '1:30 PM', type: '2D' },
    { time: '4:45 PM', type: '2D' },
    { time: '8:00 PM', type: '2D' },
    { time: '11:15 PM', type: '2D' }
  ],
  theatres: [
    {
      name: 'PVR Cinemas',
      location: 'Phoenix Marketcity, Kurla',
      shows: [
        { time: '10:00 AM', type: '2D' },
        { time: '1:30 PM', type: '2D' },
        { time: '4:45 PM', type: '2D' },
        { time: '8:00 PM', type: '2D' }
      ]
    },
    {
      name: 'INOX Megaplex',
      location: 'R-City Mall, Ghatkopar',
      shows: [
        { time: '10:30 AM', type: '2D' },
        { time: '2:00 PM', type: '2D' },
        { time: '5:15 PM', type: '2D' },
        { time: '8:30 PM', type: '2D' }
      ]
    },
    {
      name: 'Cinepolis',
      location: 'Viviana Mall, Thane',
      shows: [
        { time: '11:00 AM', type: '2D' },
        { time: '2:30 PM', type: '2D' },
        { time: '5:45 PM', type: '2D' },
        { time: '9:00 PM', type: '2D' }
      ]
    }
  ]
};

const ShowDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedTab, setSelectedTab] = useState(0);
  const { user } = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleBookTickets = () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Movie Header */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              image={mockMovieDetails.image}
              alt={mockMovieDetails.title}
              sx={{ height: '100%', objectFit: 'cover' }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {mockMovieDetails.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Chip icon={<Language />} label={mockMovieDetails.language} />
              <Chip icon={<AccessTime />} label={mockMovieDetails.duration} />
              <Chip icon={<CalendarToday />} label={new Date(mockMovieDetails.releaseDate).toLocaleDateString()} />
              <Chip icon={<Star />} label={`${mockMovieDetails.rating}/5`} />
            </Box>
            <Typography variant="body1" paragraph>
              {mockMovieDetails.description}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              From ₹{mockMovieDetails.price.standard}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleBookTickets}
              startIcon={<PlayArrow />}
            >
              Book Tickets
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Movie Details Tabs */}
      <Paper sx={{ mt: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="About" />
          <Tab label="Cast & Crew" />
          <Tab label="User Reviews" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {selectedTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Synopsis
              </Typography>
              <Typography variant="body1" paragraph>
                {mockMovieDetails.synopsis}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Director
              </Typography>
              <Typography variant="body1" paragraph>
                {mockMovieDetails.director}
              </Typography>
            </Box>
          )}

          {selectedTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Cast
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {mockMovieDetails.cast.map((actor) => (
                  <Chip key={actor} label={actor} />
                ))}
              </Box>
            </Box>
          )}

          {selectedTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                User Reviews
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No reviews yet. Be the first to review!
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ShowDetails; 