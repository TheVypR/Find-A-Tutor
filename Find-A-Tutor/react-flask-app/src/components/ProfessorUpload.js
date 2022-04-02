import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import './adminView.css';
import {AuthContext} from './AuthContext';
import AdminNavBar from './AdminNavBar';

//making styles and themes
const theme = createTheme();

export default function ProfessorUpload() {
    //authentication
	const authContext = useContext(AuthContext);

    const uploadFile = async (e) => {
        const file = e.target.files[0];
        if (file != null) {
          const data = new FormData();
          data.append('file_from_react', file);
  
          let response = await fetch('/fileUpload/',
            {
              method: 'post',
              body: data,
            }
          );
          let res = await response.json();
          if (res.status !== 1){
            alert('Error uploading file');
          }
        }
    };

    return authContext.isLoggedIn && (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminNavBar />
            <Grid container justifyContent="right" sx={{pt: 11, pr: 6, pb: 3}} />
            <Container maxWidth="xl" disableGutters component="main" sx={{px: 6}}>
                <Paper sx={{p: 2, position: 'relative', backgroundColor: 'white', color: '#fff', mb: 4, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Professor CSV Upload
                    </Typography>
                    <Input margin="normal" 
                            id="instructions" 
                            label="Instructions" 
                            readOnly 
                            variant='outlined' 
                            style={{width: 600}} 
                            multiline 
                            value={"Instructions:\nUpload a CSV file containing name, email, and office location of all professors. Any new data entered will overwrite the old data."}
                    />
                    <Grid container justifyContent="center" spacing={1} sx={{py: 4}}>
                        <Grid item>
                            <form>
                                <input type="file" onChange={() => uploadFile} accept=".csv" />
                            </form>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" type='submit' style={{backgroundColor: "#3d8c40"}} >
                                Insert CSV
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}