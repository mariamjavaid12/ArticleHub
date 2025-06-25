import React from 'react';
import {
    Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    IconButton, Divider, Toolbar, Typography, Box
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    NoteAdd as NoteAddIcon,
    Article as ArticleIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const drawerWidth = 240;

const Sidebar = ({ open, toggleSidebar }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const commonStyles = {
        width: open ? drawerWidth : 60,
        transition: 'width 0.3s',
        overflowX: 'hidden'
    };

    const authorItems = [
        { label: 'Home', icon: <HomeIcon />, path: '/author' },
        { label: 'My Articles', icon: <DashboardIcon />, path: '/author/articles' },
        { label: 'New Article', icon: <NoteAddIcon />, path: '/author/new-article' }
    ];

    const editorItems = [
        { label: 'Home', icon: <HomeIcon />, path: '/editor' },
        { label: 'Pending Reviews', icon: <PendingActionsIcon />, path: '/editor/pending' },
        { label: 'Reviewed Articles', icon: <PendingActionsIcon />, path: '/editor/reviewed-by-me' },
        { label: 'All Articles', icon: <ArticleIcon />, path: '/editor/articles' },
    ];

    const items = user?.role === 'Editor' ? editorItems : authorItems;

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: commonStyles.width,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    ...commonStyles,
                    boxSizing: 'border-box'
                }
            }}
        >
            <Toolbar>
                <IconButton onClick={toggleSidebar}>
                    <MenuIcon />
                </IconButton>
                {open && <Typography ml={1} variant="h6">Dashboard</Typography>}
            </Toolbar>

            <Divider />

            <List>
                {items.map(({ label, icon, path }) => (
                    <ListItemButton key={label} onClick={() => navigate(path)}>
                        <ListItemIcon>{icon}</ListItemIcon>
                        {open && <ListItemText primary={label} />}
                    </ListItemButton>
                ))}

                <ListItemButton onClick={logout}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    {open && <ListItemText primary="Logout" />}
                </ListItemButton>
            </List>
        </Drawer>
    );
};

export default Sidebar;