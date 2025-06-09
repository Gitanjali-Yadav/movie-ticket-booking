import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  LocationOn,
  AccountCircle,
  Movie,
  EventSeat,
  Receipt,
  Logout,
  Notifications
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Movies', icon: <Movie />, path: '/' },
    { text: 'My Bookings', icon: <EventSeat />, path: '/bookings' },
    { text: 'Receipts', icon: <Receipt />, path: '/receipts' }
  ];

  const renderMobileMenu = (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Movie Booking
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileMenuOpen(false);
            }}
            sx={{
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      {user ? (
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: theme.palette.error.main }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem button onClick={() => {
            navigate('/login');
            setMobileMenuOpen(false);
          }}>
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        </List>
      )}
    </Drawer>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            color: 'primary.main',
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => navigate('/')}
        >
          Movie Booking
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<LocationOn />}
              color="inherit"
              sx={{ color: 'text.primary' }}
            >
              Mumbai
            </Button>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                startIcon={item.icon}
                color="inherit"
                sx={{ color: 'text.primary' }}
                onClick={() => navigate(item.path)}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <IconButton color="inherit" sx={{ color: 'text.primary' }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          {user ? (
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                {user.displayName?.[0] || user.email?.[0] || 'U'}
              </Avatar>
            </IconButton>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          navigate('/profile');
        }}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          navigate('/bookings');
        }}>
          <ListItemIcon>
            <EventSeat fontSize="small" />
          </ListItemIcon>
          My Bookings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {renderMobileMenu}
    </AppBar>
  );
};

export default Navbar; 