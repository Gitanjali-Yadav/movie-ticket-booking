import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Rating,
  Chip,
  useTheme,
  useMediaQuery,
  Autocomplete,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon,
  LocationOn,
  Movie as MovieIcon,
  Event as EventIcon,
  Sports as SportsIcon,
  LocalActivity as ActivityIcon,
  Star as StarIcon,
  TheaterComedy as TheaterIcon,
  DirectionsWalk as WalkIcon,
  DirectionsCar as CarIcon,
  AccessTime as TimeIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Movie {
  id: string;
  title: string;
  image: string;
  rating: number;
  language: string;
  duration: string;
  genre: string;
  releaseDate: string;
  director: string;
  cast: string;
  description: string;
  price: {
    standard: number;
    premium: number;
    vip: number;
  };
}

interface Theatre {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  image: string;
  amenities: string[];
  shows: {
    time: string;
    type: string;
    price: number;
  }[];
}

// Mock data for movies
const movies: Movie[] = [
  {
    id: '1',
    title: 'Animal',
    image: 'https://assets-in.bmscdn.com/iedb/movie/2023/animal/animal_2023.jpg',
    rating: 4.5,
    language: 'Hindi',
    duration: '3h 21m',
    genre: 'Action/Drama',
    releaseDate: '2023-12-01',
    director: 'Sandeep Reddy Vanga',
    cast: 'Ranbir Kapoor, Rashmika Mandanna, Bobby Deol',
    description: 'A son undergoes a remarkable transformation as the bond with his father begins to fracture, and he becomes consumed by a quest for vengeance.',
    price: {
      standard: 200,
      premium: 300,
      vip: 500,
    },
  },
  {
    id: '2',
    title: 'Dunki',
    image: 'https://assets-in.bmscdn.com/iedb/movie/2023/dunki/2023.jpg',
    rating: 4.2,
    language: 'Hindi',
    duration: '2h 40m',
    genre: 'Comedy/Drama',
    releaseDate: '2023-12-21',
    director: 'Rajkumar Hirani',
    cast: 'Shah Rukh Khan, Taapsee Pannu',
    description: "A comedy drama that traces the journey of people who do the 'donkey flight' to reach foreign shores.",
    price: {
      standard: 200,
      premium: 300,
      vip: 500,
    },
  },
  {
    id: '3',
    title: 'Salaar',
    image: 'https://assets-in.bmscdn.com/iedb/movie/2023/salaar/2023.jpg',
    rating: 4.3,
    language: 'Telugu',
    duration: '2h 55m',
    genre: 'Action/Thriller',
    releaseDate: '2023-12-22',
    director: 'Prashanth Neel',
    cast: 'Prabhas, Prithviraj Sukumaran',
    description: 'A gang leader makes a promise to a dying friend by taking on other criminal gangs.',
    price: {
      standard: 200,
      premium: 300,
      vip: 500,
    },
  },
  {
    id: '4',
    title: '12th Fail',
    image: 'https://assets-in.bmscdn.com/iedb/movie/2023/12th-fail/2023.jpg',
    rating: 4.7,
    language: 'Hindi',
    duration: '2h 27m',
    genre: 'Drama',
    releaseDate: '2023-10-27',
    director: 'Vidhu Vinod Chopra',
    cast: 'Vikrant Massey, Medha Shankar',
    description: 'Based on a true story, it follows the journey of UPSC aspirants.',
    price: {
      standard: 200,
      premium: 300,
      vip: 500,
    },
  },
];

// Mock data for theatres
const theatres: Theatre[] = [
  {
    id: '1',
    name: 'PVR IMAX',
    location: 'Phoenix Marketcity, Kurla',
    distance: '2.5 km',
    rating: 4.5,
    image: 'https://assets-in.bmscdn.com/promotions/cms/creatives/1703843518676_web.jpg',
    amenities: ['IMAX', 'Dolby Atmos', 'Food Court', 'Parking'],
    shows: [
      { time: '10:00 AM', type: '2D', price: 200 },
      { time: '1:30 PM', type: '2D', price: 250 },
      { time: '4:45 PM', type: 'IMAX', price: 400 },
      { time: '8:00 PM', type: '2D', price: 300 }
    ]
  },
  {
    id: '2',
    name: 'INOX Megaplex',
    location: 'R-City Mall, Ghatkopar',
    distance: '3.8 km',
    rating: 4.3,
    image: 'https://assets-in.bmscdn.com/promotions/cms/creatives/1703843518676_web.jpg',
    amenities: ['Dolby Atmos', 'Food Court', 'Parking'],
    shows: [
      { time: '11:00 AM', type: '2D', price: 180 },
      { time: '2:15 PM', type: '2D', price: 220 },
      { time: '5:30 PM', type: '2D', price: 280 },
      { time: '8:45 PM', type: '2D', price: 320 }
    ]
  },
  {
    id: '3',
    name: 'Cinepolis',
    location: 'Viviana Mall, Thane',
    distance: '5.2 km',
    rating: 4.4,
    image: 'https://assets-in.bmscdn.com/promotions/cms/creatives/1703843518676_web.jpg',
    amenities: ['4DX', 'Food Court', 'Parking'],
    shows: [
      { time: '10:30 AM', type: '2D', price: 190 },
      { time: '1:45 PM', type: '4DX', price: 450 },
      { time: '5:00 PM', type: '2D', price: 260 },
      { time: '8:15 PM', type: '4DX', price: 450 }
    ]
  }
];

const categories = [
  { id: 'movies', label: 'Movies', icon: <MovieIcon /> },
  { id: 'events', label: 'Events', icon: <EventIcon /> },
  { id: 'plays', label: 'Plays', icon: <TheaterIcon /> },
  { id: 'sports', label: 'Sports', icon: <SportsIcon /> },
  { id: 'activities', label: 'Activities', icon: <ActivityIcon /> }
];

const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad'
];

const languages = [
  'Hindi',
  'English',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Kannada',
  'Bengali',
  'Marathi'
];

const STORAGE_KEY = 'selectedCity';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('movies');
  const [selectedCity, setSelectedCity] = useState(() => {
    // Initialize from localStorage or default to Mumbai
    const savedCity = localStorage.getItem(STORAGE_KEY);
    return savedCity || 'Mumbai';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Save city to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selectedCity);
  }, [selectedCity]);

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const handleCityChange = (event: any) => {
    setSelectedCity(event.target.value);
    // Simulate loading when changing city
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleMovieClick = (movieId: string) => {
    navigate(`/show/${movieId}`);
  };

  const handleTheatreClick = (theatreId: string) => {
    navigate(`/theatre/${theatreId}`);
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         movie.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = !selectedLanguage || movie.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Location and Search Bar */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select City</InputLabel>
          <Select
            value={selectedCity}
            label="Select City"
            onChange={handleCityChange}
            startAdornment={
              <InputAdornment position="start">
                <LocationOn />
              </InputAdornment>
            }
          >
            {cities.map((city) => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          placeholder="Search for Movies, Events, Plays, Sports and Activities"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowFilters(!showFilters)}>
                  <FilterIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Filters */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                options={languages}
                value={selectedLanguage}
                onChange={(event, newValue) => setSelectedLanguage(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Language" fullWidth />
                )}
              />
            </Grid>
            {/* Add more filters as needed */}
          </Grid>
        </Paper>
      )}

      {/* Categories */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              value={category.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {category.icon}
                  <Typography>{category.label}</Typography>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Movies Grid */}
          <Typography variant="h5" gutterBottom>
            Recommended Movies
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {filteredMovies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <MovieCard movie={movie} onClick={() => handleMovieClick(movie.id)} />
              </Grid>
            ))}
          </Grid>

          {/* Nearby Theatres */}
          <Typography variant="h5" gutterBottom>
            Nearby Theatres
          </Typography>
          <Grid container spacing={3}>
            {theatres.map((theatre) => (
              <Grid item xs={12} key={theatre.id}>
                <TheatreCard theatre={theatre} onClick={() => handleTheatreClick(theatre.id)} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

const MovieCard = ({ movie, onClick }: { movie: Movie; onClick: () => void }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          cursor: 'pointer'
        }
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height={isMobile ? 200 : 300}
        image={movie.image}
        alt={movie.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {movie.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={movie.language} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label={movie.duration} 
            size="small" 
            color="secondary" 
            variant="outlined"
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <StarIcon sx={{ color: 'warning.main', fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            {movie.rating}/5
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {movie.genre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          From ₹{movie.price.standard}
        </Typography>
      </CardContent>
    </Card>
  );
};

const TheatreCard = ({ theatre, onClick }: { theatre: Theatre; onClick: () => void }) => {
  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 2,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 4
        }
      }}
      onClick={onClick}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <CardMedia
            component="img"
            height={140}
            image={theatre.image}
            alt={theatre.name}
            sx={{ borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6">{theatre.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ color: 'warning.main', fontSize: 20 }} />
              <Typography>{theatre.rating}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {theatre.location}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
              <WalkIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {theatre.distance}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {theatre.amenities.map((amenity) => (
              <Chip
                key={amenity}
                label={amenity}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {theatre.shows.map((show, index) => (
              <Button
                key={index}
                variant="outlined"
                size="small"
                startIcon={<TimeIcon />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {show.time} - {show.type} (₹{show.price})
              </Button>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Home; 