import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import './App.css';


function App() {
  return (
    <div className="app">
      <h1>Escrow FE</h1>
      <div className="app-container">
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
          <h1>Alice's Data</h1>
          <div class="text-field">
            <p>Throwaway private key (as byte array from sollet.io, without the '[]')</p>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>
          <div class="text-field">
            <p>Program id</p>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>
          <div class="text-field">
            <p>Alice's X token account pubkey</p>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>
          <div class="text-field">
            <p>Amount of X tokens to send to escrow</p>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>
          <div class="text-field">
            <p>Alice's Y token account pubkey</p>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>
          <div class="text-field">
            <p>Amount of Y tokens Alice wants</p>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>
          <div className="button-container">
            <Button size="large"  variant="contained">Init Escrow</Button>
            <Button size="large"  variant="contained" color="error">Reset Alice's Data</Button>
          </div>
        </Box>
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
        <h1>Bob's Data:</h1>
          <div class="text-field">
            <p>Throwaway private key (as byte array from sollet.io, without the '[]')</p>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>
          <div class="text-field">
            <p>Program id</p>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>
          <div class="text-field">
            <p>Bobs's X token account pubkey</p>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>
          <div class="text-field">
            <p>Bob's Y token account pubkey</p>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>
          <div class="text-field">
            <p>Escrow account pubkey</p>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>
          <div class="text-field">
            <p>Amount X tokens Bob wants</p>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>
          <div className="button-container">
            <Button size="large" variant="contained">Take Trade</Button>
            <Button size="large"  variant="contained" color="error">Reset Bob's Data</Button>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default App;
