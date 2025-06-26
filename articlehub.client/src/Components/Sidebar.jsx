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
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

const Sidebar = ({ open, toggleSidebar }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ur';
    const drawerSide = isRTL ? 'right' : 'left';
    const commonStyles = {
        width: open ? drawerWidth : 60,
        transition: 'width 0.3s',
        overflowX: 'hidden'
    };

    const authorItems = [
        { label: t('home'), icon: <HomeIcon />, path: '/author' },
        { label: t('myArticles'), icon: <DashboardIcon />, path: '/author/articles' },
        { label: t('newArticle'), icon: <NoteAddIcon />, path: '/author/new-article' }
    ];

    const editorItems = [
        { label: t('home'), icon: <HomeIcon />, path: '/editor' },
        { label: t('pendingReviews'), icon: <PendingActionsIcon />, path: '/editor/pending' },
        { label: t('reviewedByMe'), icon: <PendingActionsIcon />, path: '/editor/reviewed-by-me' },
        { label: t('allArticles'), icon: <ArticleIcon />, path: '/editor/articles' }
    ];

    const items = user?.role === 'Editor' ? editorItems : authorItems;

    return (
        <Drawer
            variant="permanent"
            anchor={drawerSide}
            sx={{
                [drawerSide]: 0, // dynamically position left/right
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
                {open && <Typography ml={1} variant="h6">{t('dashboard')}</Typography>}
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
                    {open && <ListItemText primary={t('logout')} />}
                </ListItemButton>
            </List>
        </Drawer>
    );
};

export default Sidebar;