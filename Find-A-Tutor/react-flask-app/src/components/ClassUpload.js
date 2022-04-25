import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import './adminView.css';
import {AuthContext} from './AuthContext';
import AdminNavBar from './AdminNavBar';

//making styles and themes
const theme = createTheme();

export default function ClassUpload() {
    //authentication
	const authContext = useContext(AuthContext);

	const [isAdmin, setIsAdmin] = useState(false)

    const uploadSyllabi = async (e) => {
        const files = e.target.files;
        console.log(files)
        for (var i = 0; i < files.length; i++) {
            console.log(files[i])
            if (files[i] != null) {
              const data = new FormData();
              data.append('file', files[i]);
              let response = await fetch('/syllabiUpload/',
                {
                  method: 'post',
                  body: data,
                }
              );
              let res = await response.json();
              if (res.status !== 1) {
                alert('Error uploading file');
              }
            }
        }
      };

    const uploadClass = async (e) => {
        const files = e.target.files;
        console.log(files)
        for (var i = 0; i < files.length; i++) {
            console.log(files[i])
            if (files[i] != null) {
              const data = new FormData();
              data.append('file', files[i]);
              let response = await fetch('/classUpload/',
                {
                  method: 'post',
                  body: data,
                }
              );
              let res = await response.json();
              if (res.status !== 1) {
                alert('Error uploading file');
              }
            }
        }
      };

	useEffect(() => { fetch("/isAdmin/?token=" + localStorage.getItem("token"))
        .then(res => res.json())
        .then(result => {
            setIsAdmin(result);
			console.log(isAdmin);
        },
        (error) => {
            console.log(error);
        })
    }, []);

    return authContext.isLoggedIn && isAdmin == true && (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminNavBar />
            <Grid container justifyContent="right" sx={{pt: 6, pr: 6, pb: 3}} />
            <Container maxWidth="xl" sx={{mt: 8, mb: 8}}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <Paper sx={{p: 2, position: 'relative', backgroundColor: 'white', color: '#fff', mb: 4, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Class CSV Upload
                            </Typography>
                            <Input  id="instructions" 
                                    label="Instructions" 
                                    readOnly 
                                    variant='outlined' 
                                    fullWidth
                                    multiline 
                                    disableUnderline
                                    value={"Instructions:\nUpload a CSV file containing class code and the first and last name of the professor that teaches it."}
                            />
                            <Grid justifyContent="center" sx={{py: 4, ml: 12}}>
                                <form>
                                    <input type="file" onChange={(e) => uploadClass(e)} accept=".csv" style={{color: 'black', textAlign: 'center'}} />
                                </form>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{p: 2, position: 'relative', backgroundColor: 'white', color: '#fff', mb: 4, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Syllabi Files Upload
                            </Typography>
                            <Input  id="instructions" 
                                    label="Instructions" 
                                    readOnly 
                                    variant='outlined' 
                                    fullWidth 
                                    multiline 
                                    disableUnderline
                                    value={"Instructions:\nSelect and upload all syllabi documents. Do not enter a folder or zip of syllabi documents."}
                            />
                            <Grid justifyContent="center" sx={{py: 4, ml: 12}}>
                                <form>
                                    <input type="file" multiple onChange={(e) => uploadSyllabi(e)} style={{color: 'black', textAlign: 'center'}} />
                                </form>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}