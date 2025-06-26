import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Select,
    MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from 'react-i18next';

const Navbar = ({ toggleSidebar }) => {
    const { logout } = useAuth();
    const { i18n, t } = useTranslation();

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
        document.documentElement.dir = e.target.value === 'ur' ? 'rtl' : 'ltr';
    };
    return (
        <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {t('articleHub')}
                </Typography>
              
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Select
                        value={i18n.language}
                        onChange={handleLanguageChange}
                        size="small"
                        sx={{ color: 'white', borderColor: 'white' }}
                        variant="standard"
                    >
                        <MenuItem value="en">EN</MenuItem>
                        <MenuItem value="ur"> UR</MenuItem>
                    </Select>

                    <Typography
                        variant="body1"
                        sx={{ cursor: 'pointer' }}
                        onClick={logout}
                    >
                        {t('logout')}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;