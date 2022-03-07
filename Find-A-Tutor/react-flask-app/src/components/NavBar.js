import * as React from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const theme = createTheme({
    palette: {
        secondary: {
            main: '#FFFFFF'
        }
    }
});
export default function NavBar(props) {
    const [value, setValue] = useState(props.value);
    function handleChange(newValue) {
        setValue(newValue);
    };
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar postion="flex" color="primary" elevation={0} sx={{borderTheme: (theme) => `1px solid ${theme.palette.divider}`, p: 1.5}}>
                <Tabs centered value={value} onChange={() => handleChange(value)} textColor="secondary" indicatorColor='secondary' aria-label='secondary tabs example'>
                    <Button href="./myProfile" color="inherit" variant="outlined" style={{position: "flex-start"}} sx={{my: 1, mx: 1}}>Become A Tutor</Button>
                    <Button href="./" color="inherit" variant="outlined" style={{position: "flex-start"}} sx={{my: 1, mx: 1}}>Logout</Button>
                    <Tab value="Calendar" label="Calendar" component={Link} to={"/Calendar"} onClick={() => handleChange("Calendar")}/>
                    <Tab value="ClassInfo" label="Class Info" component={Link} to={"/TutoringHistory"} />
                    <Tab value="OfficeHours" label="Office Hours" />
                    <Tab value="GroupTutoring" label="Group Tutoring" />
                    <Tab value="TutoringHistory" label="Tutoring History" component={Link} to={"/TutoringHistory"} onClick={() => handleChange("TutoringHistory")} />
                    <Link to={"/myProfile"}><AccountBoxOutlinedIcon sx={{fontSize: 75}} color='secondary' /></Link>
                </Tabs>
            </AppBar>
        </ThemeProvider>
    );
}