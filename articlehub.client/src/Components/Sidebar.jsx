import React from 'react';
import {
    Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    IconButton, Divider, Toolbar, Typography, Box
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    NoteAdd as NoteAddIcon,
    History as HistoryIcon,
    GTranslate as GTranslateIcon,
    Article as ArticleIcon,
    Language as LanguageIcon,
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
        { label: 'My Articles', icon: <DashboardIcon />, path: '/author' },
        { label: 'Submit New Article', icon: <NoteAddIcon />, path: '/author/new-article' },
        { label: 'Version History', icon: <HistoryIcon />, path: '/author/versions' },
        { label: 'Multilingual Support', icon: <GTranslateIcon />, path: '/author/languages' }
    ];

    const editorItems = [
        { label: 'Review Submissions', icon: <DashboardIcon />, path: '/editor' },
        { label: 'All Articles', icon: <ArticleIcon />, path: '/editor/articles' },
        { label: 'Version History', icon: <HistoryIcon />, path: '/editor/versions' },
        { label: 'Languages', icon: <LanguageIcon />, path: '/editor/languages' }
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