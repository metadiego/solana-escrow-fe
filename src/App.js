import {useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as escrowinit from './util/initEscrow';
import * as escrowRespond from './util/respondEscrow';

import './App.css';

function App() {
  // Initializer inputs
  let [initializerPublicKey, setInitializerPublicKey] = useState('');
  let [initializerPrivateKey, setInitializerPrivateKey] = useState('');
  let [initializerQuestionId, setInitializerQuestionId] = useState('');
  let [initializerQuestionBid, setInitializerQuestionBid] = useState(0);
  let [initializerEscrowProgramId, setInitializerEscrowProgramId] = useState('');
  let [initializerResponderPublicKey, setInitializerResponderPublicKey] = useState('');

  // Receiver inputs
  let [responderPublicKey, setResponderPublicKey] = useState('');
  let [responderPrivateKey, setResponderPrivateKey] = useState('');
  let [responderTempTokenAcctPublicKey, setResponderTempTokenAcctPublicKey] = useState('');
  let [responderEscrowProgramId, setResponderEscrowProgramId] = useState('');

  // Escrow State
  let [escrowAccountPubkey, setEscrowAccountPubkey] = useState('--');
  let [escrowIsInitialized, setEscrowIsInitialized] = useState('--');
  let [escrowInitializerAccountPubkey, setEscrowInitializerAccountPubkey] = useState('--');
  let [escrowXTokenTempAccountPubkey, setEscrowXTokenTempAccountPubkey] = useState('--');
  let [escrowInitializerYTokenAccount, setEscrowInitializerYTokenAccount] = useState('--');

  const handleInitEscrow = async () => {
    try {
      // const {
      //   escrowAccountPubkey,
      //   isInitialized,
      //   initializerAccountPubkey
      // } = await escrowinit.initEscrow(
      //   initializerPublicKey,
      //   initializerPrivateKey,
      //   initializerQuestionId,
      //   initializerQuestionBid,
      //   escrowProgramId,
      //   receiverPublicKey
      // );
      // setEscrowAccountPubkey(escrowAccountPubkey);
      // setEscrowIsInitialized(isInitialized);
      // setEscrowInitializerAccountPubkey(initializerAccountPubkey);
    } catch (err) {
      alert(`Failed to initialize escrow: ${err.message}`);
    }
  }

  const handleInitializerReset = () => {
    setInitializerPublicKey('');
    setInitializerPrivateKey('');
    setInitializerQuestionId('');
    setInitializerQuestionBid(0);
    initializerResponderPublicKey('');
    setInitializerEscrowProgramId('');

    // setEscrowAccountPubkey('--');
    // setEscrowIsInitialized('--');
    // setEscrowInitializerAccountPubkey('--');
    // setEscrowXTokenTempAccountPubkey('--');
    // setEscrowInitializerYTokenAccount('--');
    // setEscrowExpectedAmount('--');

  }

  const handleRespond = async () => {
    try {
      // await escrowRespond.respond();
        alert("Success! Alice and Bob have traded their tokens and all temporary accounts have been closed");

    } catch (err) {
      alert(`Failed to take trade: ${err.message}`);
    }
  }

  const handleResponderReset = () => {
    setResponderPublicKey('');
    setResponderPrivateKey('');
    setResponderTempTokenAcctPublicKey('');
    setResponderEscrowProgramId('');
  }

  return (
    <div className="app">
      <h1>Escrow FE</h1>
      <p>For reference: Initializer wants to ask Responder a question. So Initializer creates a
      new escrow where they place the funds that they are is willing to pay Responder if
      they answer the question.</p>
      <div className="app-container">
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
          <h1>Initializer Data:</h1>
          <div className="text-field">
            <p>Public Key of initializer:</p>
            <TextField id="outlined-basic" variant="outlined" value={initializerPublicKey} onChange={(evt) => setInitializerPublicKey(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Private key of initializer (as byte array from sollet.io, without the '[]'):</p>
            <TextField id="outlined-basic" variant="outlined" value={initializerPrivateKey} onChange={(evt) => setInitializerPrivateKey(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Initializer Question ID:</p>
            <TextField id="outlined-basic" variant="outlined" value={initializerQuestionId} onChange={(evt) => setInitializerQuestionId(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Initializer Question Bid:</p>
            <TextField id="outlined-basic" variant="outlined" value={initializerQuestionBid} onChange={(evt) => setInitializerQuestionBid(evt.target.value)}/>
          </div>

          <div className="text-field">
            <p>Responder Public Key:</p>
            <TextField id="outlined-basic" variant="outlined" value={initializerResponderPublicKey} onChange={(evt) => setInitializerResponderPublicKey(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Escrow Program ID:</p>
            <TextField id="outlined-basic" variant="outlined" value={initializerEscrowProgramId} onChange={(evt) => setInitializerEscrowProgramId(evt.target.value)}/>
          </div>

          <div className="button-container">
            <Button size="large"  variant="contained" onClick={() => handleInitEscrow()}>Init Escrow</Button>
            <Button size="large"  variant="contained" color="error" onClick={() => handleInitializerReset()}>Reset Initializers Data</Button>
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
        </Box>
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
        <h1>Responder's Data:</h1>
          <div className="text-field">
            <p>Responders public key:</p>
            <TextField id="outlined-basic" variant="outlined" value={responderPublicKey} onChange={(evt) => setResponderPublicKey(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Responders private key (as byte array from sollet.io, without the '[]')</p>
            <TextField id="outlined-basic" variant="outlined" value={responderPrivateKey} onChange={(evt) => setResponderPrivateKey(evt.target.value)}/>
          </div>

          <div className="text-field">
            <p>Responders temporary token account pubkey:</p>
            <TextField id="outlined-basic" variant="outlined" value={responderTempTokenAcctPublicKey} onChange={(evt) => setResponderTempTokenAcctPublicKey(evt.target.value)}/>
          </div>
          <div className="text-field">
            <p>Escrow Program ID:</p>
            <TextField id="outlined-basic" variant="outlined" value={responderEscrowProgramId} onChange={(evt) => setResponderEscrowProgramId(evt.target.value)}/>
          </div>

          <div className="button-container">
            <Button size="large" variant="contained" onClick={() => handleRespond()}>Respond</Button>
            <Button size="large"  variant="contained" color="error" onClick={() => handleResponderReset()}>Reset Responder's Data</Button>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default App;
