import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
import { DropzoneArea } from 'material-ui-dropzone';
import Clear from '@material-ui/icons/Clear';
import axios from "axios";
import future from "./future.jpg";

const ColorButton = withStyles((theme) => ({
  root: {
    color: '#f8f8f8',
    backgroundColor: '#2d2d2d',
    borderRadius: '15px',
    padding: '6px 12px', // Reduced size for the button
    fontWeight: 600,
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#5a5a5a',
      transform: 'translateY(-1px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
    },
    fontSize: '12px', // Smaller font for the button
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "auto",
    borderRadius: "10px",
    padding: "8px 16px", // Smaller button padding
    fontSize: "14px", // Reduced font size
    fontWeight: 600,
    color: '#fff',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      boxShadow: '0 12px 25px rgba(0, 255, 255, 0.2)',
    },
  },
  root: {
    maxWidth: 320, // Back to normal card size
    margin: 'auto',
    borderRadius: '15px',
    backdropFilter: 'blur(15px)',
    background: 'rgba(255, 255, 255, 0.05)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
  },
  media: {
    height: 220, // Adjusted preview image height
    borderRadius: '15px',
  },
  mainContainer: {
    backgroundImage: `url(${future})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: "100vh",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 0, // Remove excess padding
    margin: 0, // Ensures no white space on the right side
    overflowX: 'hidden',
  },
  detail: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontFamily: "'Orbitron', Palatino", // Added stylish futuristic font
    fontWeight: 700,
    fontSize: '50px', // Slightly larger font for title
    color: 'black',
    textAlign: 'center',
    textShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
    letterSpacing: '2px',
    position: 'absolute',
    top: '3%', // Positioned near the top
    animation: `$shine 2s infinite`,
  },
  "@keyframes shine": {
    "0%": {
      textShadow: "0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 30px #00ffcc, 0 0 40px #00ffcc",
    },
    "50%": {
      textShadow: "0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff, 0 0 50px #00ffff",
    },
    "100%": {
      textShadow: "0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 30px #00ffcc, 0 0 40px #00ffcc",
    },
  },
  loader: {
    color: '#f8f8f8 !important',
  },
  tableContainer: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  table: {
    backgroundColor: 'transparent',
    color: '#f8f8f8',
  },
  tableHead: {
    backgroundColor: 'transparent',
  },
  tableRow: {
    backgroundColor: 'transparent',
  },
  tableCell: {
    fontSize: '14px', // Reduced font size
    color: '#f8f8f8 !important',
    fontWeight: 'bold',
    padding: '6px',
  },
  tableCell1: {
    fontSize: '12px', // Smaller font size for headers
    color: '#f8f8f8 !important',
    fontWeight: 'normal',
  },
  buttonGrid: {
    marginTop: "15px", // Slightly adjusted margin
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await axios({
        method: "post",
        url: "http://localhost:8000/predict",
        data: formData,
      });
      if (res.status === 200) {
        setData(res.data);
      }
      setIsloading(false);
    }
  }

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <Container maxWidth={false} className={classes.mainContainer}>
        <Typography className={classes.title}>
          Deep Fake Detector
        </Typography>
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <Card className={classes.root}>
              {image && (
                <CardActionArea>
                  <CardMedia className={classes.media} image={preview} component="img" title="Uploaded Image" />
                </CardActionArea>
              )}
              {!image && (
                <CardContent>
                  <DropzoneArea
                    acceptedFiles={['image/*']}
                    dropzoneText={"Drag and drop an image to detect deepfake"}
                    onChange={onSelectFile}
                  />
                </CardContent>
              )}
              {data && (
                <CardContent className={classes.detail}>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table}>
                      <TableHead className={classes.tableHead}>
                        <TableRow className={classes.tableRow}>
                          <TableCell className={classes.tableCell1}>Label</TableCell>
                          <TableCell align="right" className={classes.tableCell1}>Confidence</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow className={classes.tableRow}>
                          <TableCell component="th" scope="row" className={classes.tableCell}>
                            {data.class}
                          </TableCell>
                          <TableCell align="right" className={classes.tableCell}>
                            {confidence}%
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}
              {isLoading && (
                <CardContent className={classes.detail}>
                  <CircularProgress className={classes.loader} />
                  <Typography variant="h6" className={classes.title}>
                    Processing...
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>
          {data && (
            <Grid item xs={12} className={classes.buttonGrid}>
              <ColorButton variant="contained" className={classes.clearButton} onClick={clearData} startIcon={<Clear fontSize="large" />}>
                Clear
              </ColorButton>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
