"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Fade,
  Grow,
  Avatar,
  InputAdornment,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { firestore } from "@/firebase";
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc, query } from "firebase/firestore";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import SearchIcon from '@mui/icons-material/Search';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#03dac6',
    },
    background: {
      default: '#121212',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 300,
    },
    body1: {
      fontWeight: 300,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const decreaseQuantity = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection='column'
        justifyContent="center"
        alignItems="center"
        gap={4}
        bgcolor="background.default"
        sx={{ transition: 'background-color 0.3s ease' }}
      >
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
        >
          <Fade in={open}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: 'background.paper',
                p: 4,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Add New Item</Typography>
                <IconButton onClick={handleClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
              <Stack width="100%" direction="row" spacing={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Item name"
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(itemName);
                    setItemName("");
                    handleClose();
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Fade>
        </Modal>
        
        <Fade in={true}>
          <Box 
            width="90%" 
            maxWidth="600px"
            height="80vh"  // Set a fixed height for the entire container
            display="flex"
            flexDirection="column"
            bgcolor="background.paper"
            borderRadius={2}
            overflow="hidden"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
            sx={{ backdropFilter: 'blur(10px)' }}
          >
            <Box 
              py={3} 
              px={4} 
              borderBottom={1}
              borderColor="divider"
            >
              <Typography variant='h4' color='text.primary'>
                Inventory Manager
              </Typography>
            </Box>
            <Box p={4} display="flex" flexDirection="column" height="100%">
              <Button 
                variant='outlined' 
                onClick={handleOpen}
                startIcon={<AddIcon />}
                sx={{ mb: 3 }}
              >
                Add New Item 
              </Button>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Box flexGrow={1} overflow="auto">  
                <Stack spacing={2}>
                  {filteredInventory.map(({name, quantity}, index) => (
                    <Grow in={true} key={name} timeout={(index + 1) * 200}>
                      <Box 
                        display='flex' 
                        alignItems='center'
                        justifyContent='space-between'
                        p={2}
                        borderRadius={1}
                        sx={{
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                          },
                        }}
                      >
                        <Box display='flex' alignItems='center'>
                          <IconButton 
                            color="primary"
                            onClick={() => removeItem(name)}
                            size="small"
                            sx={{ mr: 2 }}
                          >
                            <CheckBoxOutlineBlankIcon />
                          </IconButton>
                          <Typography 
                            variant="body1" 
                            color="text.primary"
                          >
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                          </Typography>
                        </Box>
                        <Box display='flex' alignItems='center' gap={1}>
                          <Typography variant="body1" color="text.secondary">
                            {quantity}
                          </Typography>
                          <IconButton 
                            color="success"
                            onClick={() => addItem(name)}
                            size="small"
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="error"
                            onClick={() => decreaseQuantity(name)}
                            size="small"
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grow>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}