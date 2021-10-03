import {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as escrowinit from './util/initEscrow';
import * as escrowRespond from './util/respondEscrow';

import './App.css';

function App() {
  // Initializer inputs
  let [initializerPrivateKey, setInitializerPrivateKey] = useState('');
  let [initializerTempTokenAccountPubkey, setInitializerTempTokenAccountPubkey] = useState('');
  let [initializerResponderPublicKey, setInitializerResponderPublicKey] = useState('');
  let [initializerQuestionId, setInitializerQuestionId] = useState(0);
  let [initializerQuestionBid, setInitializerQuestionBid] = useState(0);
  let [initializerQuestionDurationSeconds, setInitializerQuestionDurationSeconds] = useState(0);
  let [initializerEscrowProgramId, setInitializerEscrowProgramId] = useState('');

  // Receiver inputs
  let [responderPrivateKey, setResponderPrivateKey] = useState('');
  let [responderXTokenAccountPubkey, setResponderXTokenAccountPubkey] = useState('');
  let [responderEscrowProgramId, setResponderEscrowProgramId] = useState('');
  let [responderQuestionId, setResponderQuestionId] = useState(0);
  let [responderExpectedXTokenAmount, setResponderExpectedXTokenAmount] = useState(0);

  // Escrow State
  let [escrowAccountPubkey, setEscrowAccountPubkey] = useState('--');
  let [escrowIsInitialized, setEscrowIsInitialized] = useState('--');
  let [escrowInitializerAccountPubkey, setEscrowInitializerAccountPubkey] = useState('--');
  let [escrowXTokenTempAccountPubkey, setEscrowXTokenTempAccountPubkey] = useState('--');
  let [escrowQuestionId, setEscrowQuestionId] = useState('--');
  let [escrowQuestionBidAmountXTokens, setEscrowQuestionBidAmountXTokens] = useState('--');
  let [escrowQuestionDuration, setEscrowQuestionDuration] = useState('--');

  const handleInitEscrow = async () => {
    try {
      const {
        escrowAccountPubkey,
        escrowIsInitialized,
        escrowInitializerAccountPubkey,
        escrowXTokenTempAccountPubkey,
        escrowQuestionId,
        escrowQuestionBidAmountXTokens,
        escrowQuestionDuration,
      } = await escrowinit.initEscrow(
        initializerPrivateKey,
        initializerTempTokenAccountPubkey,
        initializerResponderPublicKey,
        initializerEscrowProgramId,
        initializerQuestionId,
        initializerQuestionBid,
        initializerQuestionDurationSeconds,
      );
      setEscrowAccountPubkey(escrowAccountPubkey);
      setEscrowIsInitialized(escrowIsInitialized);
      setEscrowInitializerAccountPubkey(escrowInitializerAccountPubkey);
      setEscrowXTokenTempAccountPubkey(escrowXTokenTempAccountPubkey);
      setEscrowQuestionId(escrowQuestionId);
      setEscrowQuestionBidAmountXTokens(escrowQuestionBidAmountXTokens);
      setEscrowQuestionDuration(escrowQuestionDuration);
    } catch (err) {
      alert(`Failed to initialize escrow: ${err.message}`);
    }
  }

  const handleInitializerReset = () => {
    setInitializerPrivateKey('');
    setInitializerTempTokenAccountPubkey('');
    setInitializerResponderPublicKey('');
    setInitializerEscrowProgramId('');
    setInitializerQuestionId(0);
    setInitializerQuestionBid(0);
    setInitializerQuestionDurationSeconds(0);

    setEscrowAccountPubkey('');
    setEscrowIsInitialized('');
    setEscrowInitializerAccountPubkey('');
    setEscrowXTokenTempAccountPubkey('');
    setEscrowQuestionId(0);
    setEscrowQuestionBidAmountXTokens(0);
    setEscrowQuestionDuration(0);

  }

  const handleRespond = async () => {
    try {
      await escrowRespond.respond(
        responderPrivateKey,
        responderXTokenAccountPubkey,
        responderExpectedXTokenAmount,
        responderQuestionId,
        escrowAccountPubkey,
        responderEscrowProgramId,
      );
      alert("Success! Responder has successfuly transacted with escrow.");
    } catch (err) {
      alert(`Failed to complete escrow responder instruction: ${err.message}`);
    }
  }

  const handleResponderReset = () => {
    setResponderPrivateKey('');
    setResponderXTokenAccountPubkey('');
    setResponderEscrowProgramId('');
    setResponderQuestionId(0);
    setResponderExpectedXTokenAmount(0);
  }

  return (
    <div className="app">
      <h1>Escrow FE</h1>
      <p>For reference: Initializer wants to ask Responder a question. So Initializer creates a
      new escrow where they place the funds that they are is willing to pay Responder if
      they answer the question.</p>
      <div className="app-container">
        <div class="initializer-container">
          <div className="initializer-inputs">
            <h1>Initialize Escrow:</h1>
            <div className="text-field">
              <p className="bold">Initializer Main Account Private Key (as byte array from sollet.io, without the '[]'):</p>
              <TextField id="outlined-basic" variant="outlined" value={initializerPrivateKey} onChange={(evt) => setInitializerPrivateKey(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Temp Token Account Public Key:</p>
              <TextField id="outlined-basic" variant="outlined" value={initializerTempTokenAccountPubkey} onChange={(evt) => setInitializerTempTokenAccountPubkey(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Responder Main Account Public Key:</p>
              <TextField id="outlined-basic" variant="outlined" value={initializerResponderPublicKey} onChange={(evt) => setInitializerResponderPublicKey(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Question ID:</p>
              <TextField id="outlined-basic" variant="outlined" value={initializerQuestionId} onChange={(evt) => setInitializerQuestionId(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Question Bid:</p>
              <TextField id="outlined-basic" variant="outlined" value={initializerQuestionBid} onChange={(evt) => setInitializerQuestionBid(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Question Duration (seconds):</p>
              <TextField id="outlined-basic" variant="outlined" value={initializerQuestionDurationSeconds} onChange={(evt) => setInitializerQuestionDurationSeconds(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Program ID:</p>
              <TextField id="outlined-basic" variant="outlined" value={initializerEscrowProgramId} onChange={(evt) => setInitializerEscrowProgramId(evt.target.value)}/>
            </div>

            <div className="button-container">
              <Button size="large"  variant="contained" onClick={() => handleInitEscrow()}>Init Escrow</Button>
              <Button size="large"  variant="contained" color="error" onClick={() => handleInitializerReset()}>Reset Data</Button>
            </div>
          </div>
          <div className="initializer-data">
            <div className="text-field">
              <p className="bold">Escrow account:</p>
              <p>{escrowAccountPubkey}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Is initialized:</p>
              <p>{escrowIsInitialized}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow X Token Temp Account:</p>
              <p>PubKey: {escrowXTokenTempAccountPubkey}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Question ID:</p>
              <p>{escrowQuestionId}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Question Bid Ammount X Tokens:</p>
              <p>{escrowQuestionBidAmountXTokens}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Question Duration:</p>
              <p>{escrowQuestionDuration}</p>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Main Account:</p>
              <p>Pub Key: {escrowInitializerAccountPubkey}</p>
              <p>Funds: TODO</p>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Temp Token account:</p>
              <p>Pub Key: {initializerTempTokenAccountPubkey}</p>
              <p>Funds: TODO</p>
            </div>
            <div className="text-field">
              <p className="bold">Responder Main Account:</p>
              <p>Pub Key: TODO</p>
              <p>Funds: TODO</p>
            </div>
          </div>
        </div>
        <div class="responder-container">
          <div className="responder-inputs">
            <h1>Respond:</h1>
            <div className="text-field">
              <p className="bold">Responder Main Account Private Key (as byte array from sollet.io, without the '[]')</p>
              <TextField id="outlined-basic" variant="outlined" value={responderPrivateKey} onChange={(evt) => setResponderPrivateKey(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Responder Receiving Token Account Public Key:</p>
              <TextField id="outlined-basic" variant="outlined" value={responderXTokenAccountPubkey} onChange={(evt) => setResponderXTokenAccountPubkey(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Responder Question ID:</p>
              <TextField id="outlined-basic" variant="outlined" value={responderQuestionId} onChange={(evt) => setResponderQuestionId(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Responder Expected Token Ammount:</p>
              <TextField id="outlined-basic" variant="outlined" value={responderExpectedXTokenAmount} onChange={(evt) => setResponderExpectedXTokenAmount(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Program ID:</p>
              <TextField id="outlined-basic" variant="outlined" value={responderEscrowProgramId} onChange={(evt) => setResponderEscrowProgramId(evt.target.value)}/>
            </div>
            <div className="button-container">
              <Button size="large" variant="contained" onClick={() => handleRespond()}>Respond</Button>
              <Button size="large"  variant="contained" color="error" onClick={() => handleResponderReset()}>Reset Responder's Data</Button>
            </div>
          </div>
          <div className="responder-data">
            <div className="text-field">
              <p className="bold">Initializer Main Account:</p>
              <p>Pub Key: {escrowInitializerAccountPubkey}</p>
              <p>Funds: TODO</p>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Temp Token account:</p>
              <p>Pub Key: {initializerTempTokenAccountPubkey}</p>
              <p>Funds: TODO</p>
            </div>
            <div className="text-field">
              <p className="bold">Responder Main Account:</p>
              <p>Pub Key: TODO</p>
              <p>Funds: TODO</p>
            </div>
            <div className="text-field">
              <p className="bold">Responder Receiving Token Account:</p>
              <p>Pub Key: {responderXTokenAccountPubkey}</p>
              <p>Funds: TODO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
