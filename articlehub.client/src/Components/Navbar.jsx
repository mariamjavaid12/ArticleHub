import React from 'react';
import {
    AppBar, Toolbar, Typography, IconButton, Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../auth/AuthContext';

const Navbar = ({ toggleSidebar }) => {
    const { logout } = useAuth();

    return (
        <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Article Hub
                </Typography>
                <Box sx={{ cursor: 'pointer' }} onClick={logout}>
                    <Typography variant="body1">Logout</Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;