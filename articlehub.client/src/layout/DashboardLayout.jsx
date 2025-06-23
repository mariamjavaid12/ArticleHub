import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <Box display="flex">
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
            <Box flexGrow={1} bgcolor="#f4f6f8">
                <Navbar toggleSidebar={toggleSidebar} />
                <Toolbar /> {/* Adds spacing below AppBar */}
                <Box p={3}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;