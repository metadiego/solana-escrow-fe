import {useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as escrowinit from './util/initEscrow';
import * as escrowtrade from './util/takeTrade';

import './App.css';


function App() {
  // Alice inputs
  let [alicePrivateKey, setAlicePrivateKey] = useState('');
  let [aliceProgramId, setAliceProgramId] = useState('');
  let [aliceXTokenAcctPubKey, setAliceXTokenAcctPubKey] = useState('');
  let [aliceXTokensToSend, setAliceXTokensToSend] = useState(0);
  let [aliceYTokenAcctPubKey, setAliceYTokenAcctPubKey] = useState('');
  let [aliceYTokensExpected, setAliceYTokensExpected] = useState(0);

  // Bobs inputs
  let [bobPrivateKey, setBobPrivateKey] = useState('');
  let [bobProgramId, setBobProgramId] = useState('');
  let [bobXTokenAcctPubKey, setBobXTokenAcctPubKey] = useState('');
  let [bobYTokenAcctPubKey, setBobYTokenAcctPubKey] = useState('');
  let [bobEscrowAcctPubKey, setBobEscrowAcctPubKey] = useState('');
  let [bobXTokensExpected, setBobXTokensExpected] = useState('');

  // Escrow State
  let [escrowAccountPubkey, setEscrowAccountPubkey] = useState('--');
  let [escrowIsInitialized, setEscrowIsInitialized] = useState('--');
  let [escrowInitializerAccountPubkey, setEscrowInitializerAccountPubkey] = useState('--');
  let [escrowXTokenTempAccountPubkey, setEscrowXTokenTempAccountPubkey] = useState('--');
  let [escrowInitializerYTokenAccount, setEscrowInitializerYTokenAccount] = useState('--');
  let [escrowExpectedAmount, setEscrowExpectedAmount] = useState('--');

  const handleAliceInitEscrow = async () => {
    try {
      const {
        escrowAccountPubkey,
        isInitialized,
        initializerAccountPubkey,
        XTokenTempAccountPubkey,
        initializerYTokenAccount,
        expectedAmount
      } = await escrowinit.initEscrow(
        alicePrivateKey,
        aliceXTokenAcctPubKey,
        aliceXTokensToSend,
        aliceYTokenAcctPubKey,
        aliceYTokensExpected,
        aliceProgramId
      );
      setEscrowAccountPubkey(escrowAccountPubkey);
      setEscrowIsInitialized(isInitialized);
      setEscrowInitializerAccountPubkey(initializerAccountPubkey);
      setEscrowXTokenTempAccountPubkey(XTokenTempAccountPubkey);
      setEscrowInitializerYTokenAccount(initializerYTokenAccount);
      setEscrowExpectedAmount(expectedAmount);
    } catch (err) {
      alert(`Failed to initialize escrow: ${err.message}`);
    }
  }

  const handleAliceReset = () => {
    setAlicePrivateKey('');
    setAliceProgramId('');
    setAliceXTokenAcctPubKey('');
    setAliceXTokensToSend(0);
    setAliceYTokenAcctPubKey('');
    setAliceYTokensExpected(0);
    setEscrowAccountPubkey('--');
    setEscrowIsInitialized('--');
    setEscrowInitializerAccountPubkey('--');
    setEscrowXTokenTempAccountPubkey('--');
    setEscrowInitializerYTokenAccount('--');
    setEscrowExpectedAmount('--');

  }

  const handleBobTakeTrade = async () => {
    try {
      await escrowtrade.takeTrade(
        bobPrivateKey,
        bobEscrowAcctPubKey,
        bobXTokenAcctPubKey,
        bobYTokenAcctPubKey,
        bobXTokensExpected,
        bobProgramId
        );
        alert("Success! Alice and Bob have traded their tokens and all temporary accounts have been closed");

    } catch (err) {
      alert(`Failed to take trade: ${err.message}`);
    }
  }

  const handleBobReset = () => {
    setBobPrivateKey('');
    setBobProgramId('');
    setBobXTokenAcctPubKey('');
    setBobYTokenAcctPubKey('');
    setBobEscrowAcctPubKey('');
    setBobXTokensExpected('');
  }

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
          <div className="text-field">
            <p>Throwaway private key (as byte array from sollet.io, without the '[]')</p>
            <TextField id="outlined-basic" variant="outlined" value={alicePrivateKey} onChange={(evt) => setAlicePrivateKey(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Program id</p>
            <TextField id="outlined-basic" variant="outlined" value={aliceProgramId} onChange={(evt) => setAliceProgramId(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Alice's X token account pubkey</p>
            <TextField id="outlined-basic" variant="outlined" value={aliceXTokenAcctPubKey} onChange={(evt) => setAliceXTokenAcctPubKey(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Amount of X tokens to send to escrow</p>
            <TextField id="outlined-basic" variant="outlined" value={aliceXTokensToSend} onChange={(evt) => setAliceXTokensToSend(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Alice's Y token account pubkey</p>
            <TextField id="outlined-basic" variant="outlined" value={aliceYTokenAcctPubKey} onChange={(evt) => setAliceYTokenAcctPubKey(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Amount of Y tokens Alice wants</p>
            <TextField id="outlined-basic" variant="outlined" value={aliceYTokensExpected} onChange={(evt) => setAliceYTokensExpected(evt.target.value)}/>
          </div>
          <div className="button-container">
            <Button size="large"  variant="contained" onClick={() => handleAliceInitEscrow()}>Init Escrow</Button>
            <Button size="large"  variant="contained" color="error" onClick={() => handleAliceReset()}>Reset Alice's Data</Button>
          </div>
          <div className="text-field">
            <p>Escrow account:</p>
            <p>{escrowAccountPubkey}</p>
          </div>
          <div className="text-field">
            <p>Is initialized:</p>
            <p>{escrowIsInitialized}</p>
          </div>
          <div className="text-field">
            <p>Initializer account:</p>
            <p>{escrowInitializerAccountPubkey}</p>
          </div>
          <div className="text-field">
            <p>X token temp account:</p>
            <p>{escrowXTokenTempAccountPubkey}</p>
          </div>
          <div className="text-field">
            <p>Initializer Y token account:</p>
            <p>{escrowInitializerYTokenAccount}</p>
          </div>
          <div className="text-field">
            <p>Expected Amount:</p>
            <p>{escrowExpectedAmount}</p>
          </div>
        </Box>
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
        <h1>Bob's Data:</h1>
          <div className="text-field">
            <p>Throwaway private key (as byte array from sollet.io, without the '[]')</p>
            <TextField id="outlined-basic" variant="outlined" value={bobPrivateKey} onChange={(evt) => setBobPrivateKey(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Program id</p>
            <TextField id="outlined-basic" variant="outlined" value={bobProgramId} onChange={(evt) => setBobProgramId(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Bobs's X token account pubkey</p>
            <TextField id="outlined-basic" variant="outlined" value={bobXTokenAcctPubKey} onChange={(evt) => setBobXTokenAcctPubKey(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Bob's Y token account pubkey</p>
            <TextField id="outlined-basic" variant="outlined" value={bobYTokenAcctPubKey} onChange={(evt) => setBobYTokenAcctPubKey(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Escrow account pubkey</p>
            <TextField id="outlined-basic" variant="outlined" value={bobEscrowAcctPubKey} onChange={(evt) => setBobEscrowAcctPubKey(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Amount X tokens Bob wants</p>
            <TextField id="outlined-basic" variant="outlined" value={bobXTokensExpected} onChange={(evt) => setBobXTokensExpected(evt.target.value)}/>
          </div>
          <div className="button-container">
            <Button size="large" variant="contained" onClick={() => handleBobTakeTrade()}>Take Trade</Button>
            <Button size="large"  variant="contained" color="error" onClick={() => handleBobReset()}>Reset Bob's Data</Button>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default App;
