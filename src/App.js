import {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as escrowinit from './util/initEscrow';
import * as escrowRespond from './util/respondEscrow';
import {buildLocalConnection, buildDevConnection, getInfoForAccount, getInfoForTokenAccount} from './util/getAccountInfo';

import './App.css';

function App() {
  let [connection, setConnection] = useState(undefined);

  useEffect(() => {
    if (!connection) {
      try {
        setConnection(buildDevConnection());
        console.log("Established connection to Solana BE.");
      } catch (error) {
        console.log("Could not establish connection to Solana BE.")
      }
    }
  }, [connection]);

  // Initializer inputs
  let [initializerPrivateKey, setInitializerPrivateKey] = useState('');
  let [initializerTempTokenAccountPubkey, setInitializerTempTokenAccountPubkey] = useState('');
  let [initializerResponderTokenAcctPublicKey, setInitializerResponderTokenAcctPublicKey] = useState('');
  let [initializerQuestionId, setInitializerQuestionId] = useState(0);
  let [initializerQuestionBid, setInitializerQuestionBid] = useState(0);
  let [initializerQuestionDurationSeconds, setInitializerQuestionDurationSeconds] = useState(0);
  let [initializerEscrowProgramId, setInitializerEscrowProgramId] = useState('');

  // Initialization Step Account info
  let [initializationStepAccountInfo, setInitializationStepAccountInfo] = useState({});

  // Respond Step Account getAccountInfo
  let [respondStepAccountInfo, setRespondStepAccountInfo] = useState({});

  // Receiver inputs
  let [responderPrivateKey, setResponderPrivateKey] = useState('');
  let [responderTokenAccountPubkey, setResponderTokenAccountPubkey] = useState('');
  let [responderEscrowProgramId, setResponderEscrowProgramId] = useState('');
  let [responderQuestionId, setResponderQuestionId] = useState(0);
  let [responderExpectedTokenAmount, setResponderExpectedTokenAmount] = useState(0);

  // Escrow State
  let [escrowAccountPubkey, setEscrowAccountPubkey] = useState('--');
  let [escrowIsInitialized, setEscrowIsInitialized] = useState('FALSE');
  let [escrowInitializerAccountPubkey, setEscrowInitializerAccountPubkey] = useState('--');
  let [escrowTempTokenAccountPubkey, setEscrowTempTokenAccountPubkey] = useState('--');
  let [escrowQuestionId, setEscrowQuestionId] = useState('--');
  let [escrowQuestionBidAmountTokens, setEscrowQuestionBidAmountTokens] = useState('--');
  let [escrowQuestionDuration, setEscrowQuestionDuration] = useState('--');

  const handleInitEscrow = async () => {
    try {
      const result = await escrowinit.initEscrow(
        connection,
        initializerPrivateKey,
        initializerTempTokenAccountPubkey,
        initializerResponderTokenAcctPublicKey,
        initializerEscrowProgramId,
        initializerQuestionId,
        initializerQuestionBid,
        initializerQuestionDurationSeconds,
      );
      setEscrowAccountPubkey(result.escrowAccountPubkey.toString());
      setEscrowIsInitialized(result.isInitialized ? 'TRUE' : 'FALSE');
      setEscrowInitializerAccountPubkey(result.initializerAccountPubkey.toString());
      setEscrowTempTokenAccountPubkey(result.tempTokenAccountPubkey.toString());
      setEscrowQuestionId(result.questionId);
      setEscrowQuestionBidAmountTokens(result.questionBidAmountXTokens);
      setEscrowQuestionDuration(result.questionDuration);

      const initializerMainAccountInfo = await getInfoForAccount(connection, result.initializerAccountPubkey.toString());
      const initializerTokenAccountInfo = await getInfoForTokenAccount(connection, initializerTempTokenAccountPubkey);
      const responderTokenAccountInfo = await getInfoForTokenAccount(connection, initializerResponderTokenAcctPublicKey.toString());
      const escrowTempTokenAccountInfo = await getInfoForTokenAccount(connection, result.tempTokenAccountPubkey.toString());

      setInitializationStepAccountInfo({
        initializerMainAccountLamports: initializerMainAccountInfo.lamports,
        responderTokenAccountBalance: responderTokenAccountInfo.value.amount.toString(),
        initializerTokenAccountBalance: initializerTokenAccountInfo.value.amount.toString(),
        escrowTempTokenAccountBalance: escrowTempTokenAccountInfo.value.amount.toString()
      });
    } catch (err) {
      alert(`Failed to initialize escrow: ${err.message}`);
    }
  }

  const handleInitializerReset = () => {
    setInitializerPrivateKey('');
    setInitializerTempTokenAccountPubkey('');
    setInitializerResponderTokenAcctPublicKey('');
    setInitializerEscrowProgramId('');
    setInitializerQuestionId(0);
    setInitializerQuestionBid(0);
    setInitializerQuestionDurationSeconds(0);

    setEscrowAccountPubkey('');
    setEscrowIsInitialized('');
    setEscrowInitializerAccountPubkey('');
    setEscrowTempTokenAccountPubkey('');
    setEscrowQuestionId(0);
    setEscrowQuestionBidAmountTokens(0);
    setEscrowQuestionDuration(0);

  }

  const handleRespond = async () => {
    try {
      await escrowRespond.respond(
        connection,
        responderPrivateKey,
        responderTokenAccountPubkey,
        responderExpectedTokenAmount,
        responderQuestionId,
        escrowAccountPubkey,
        responderEscrowProgramId,
      );

      const initializerMainAccountInfo = await getInfoForAccount(connection, escrowInitializerAccountPubkey);
      const initializerTokenAccountInfo = await getInfoForTokenAccount(connection, initializerTempTokenAccountPubkey);
      const responderTokenAccountInfo = await getInfoForTokenAccount(connection, responderTokenAccountPubkey);
      // const escrowTempTokenAccountInfo = await getInfoForTokenAccount(connection, escrowTempTokenAccountPubkey);

      setRespondStepAccountInfo({
        initializerMainAccountLamports: initializerMainAccountInfo.lamports,
        initializerTokenAccountBalance: initializerTokenAccountInfo.value.amount.toString(),
        responderTokenAccountBalance: responderTokenAccountInfo.value.amount.toString()});

      alert("Success! Responder has successfuly transacted with escrow.");
    } catch (err) {
      alert(`Failed to complete escrow responder instruction: ${err.message}`);
    }
  }

  const handleResponderReset = () => {
    setResponderPrivateKey('');
    setResponderTokenAccountPubkey('');
    setResponderEscrowProgramId('');
    setResponderQuestionId(0);
    setResponderExpectedTokenAmount(0);
  }

  return (
    <div className="app">
      <h1>Escrow FE</h1>
      <p>For reference: Initializer wants to ask Responder a question. So Initializer creates a
      new escrow where they place the funds that they are is willing to pay Responder if
      they answer the question.</p>
      <div className="app-container">
        <div className="initializer-container">
          <div className="initializer-inputs">
            <h1>Initialize Escrow:</h1>
            <div className="text-field">
              <p className="bold">Initializer Main Account Private Key (as byte array from sollet.io, without the '[]'):</p>
              <TextField variant="outlined" value={initializerPrivateKey} onChange={(evt) => setInitializerPrivateKey(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Temp Token Account Public Key:</p>
              <TextField variant="outlined" value={initializerTempTokenAccountPubkey} onChange={(evt) => setInitializerTempTokenAccountPubkey(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Responder Token Account Public Key:</p>
              <TextField variant="outlined" value={initializerResponderTokenAcctPublicKey} onChange={(evt) => setInitializerResponderTokenAcctPublicKey(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Question ID:</p>
              <TextField variant="outlined" value={initializerQuestionId} onChange={(evt) => setInitializerQuestionId(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Question Bid:</p>
              <TextField variant="outlined" value={initializerQuestionBid} onChange={(evt) => setInitializerQuestionBid(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Question Duration (seconds):</p>
              <TextField variant="outlined" value={initializerQuestionDurationSeconds} onChange={(evt) => setInitializerQuestionDurationSeconds(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Program ID:</p>
              <TextField variant="outlined" value={initializerEscrowProgramId} onChange={(evt) => setInitializerEscrowProgramId(evt.target.value)}/>
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
              <p>PubKey: {escrowTempTokenAccountPubkey}</p>
              <p>Balance: {initializationStepAccountInfo?.escrowTempTokenAccountBalance ?? '--'}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Question ID:</p>
              <p>{escrowQuestionId}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Question Bid Ammount X Tokens:</p>
              <p>{escrowQuestionBidAmountTokens}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Question Duration:</p>
              <p>{escrowQuestionDuration}</p>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Main Account:</p>
              <p>Pub Key: {escrowInitializerAccountPubkey ?? '--'}</p>
              <p>Funds (Lamports): {initializationStepAccountInfo?.initializerMainAccountLamports ?? '--'}</p>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Temp Token account:</p>
              <p>Pub Key: {initializerTempTokenAccountPubkey ?? '--'}</p>
              <p>Funds (X Token): {initializationStepAccountInfo?.initializerTokenAccountBalance ?? '--'}</p>
            </div>
            <div className="text-field">
              <p className="bold">Responder Main Account:</p>
              <p>Pub Key: {initializerResponderTokenAcctPublicKey ?? '--'}</p>
              <p>Funds (Lamports): {initializationStepAccountInfo?.responderTokenAccountBalance ?? '--'} </p>
            </div>
          </div>
        </div>
        <div className="responder-container">
          <div className="responder-inputs">
            <h1>Respond:</h1>
            <div className="text-field">
              <p className="bold">Responder Main Account Private Key (as byte array from sollet.io, without the '[]')</p>
              <TextField variant="outlined" value={responderPrivateKey} onChange={(evt) => setResponderPrivateKey(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Responder Receiving Token Account Public Key:</p>
              <TextField variant="outlined" value={responderTokenAccountPubkey} onChange={(evt) => setResponderTokenAccountPubkey(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Responder Question ID:</p>
              <TextField variant="outlined" value={responderQuestionId} onChange={(evt) => setResponderQuestionId(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Responder Expected Token Ammount:</p>
              <TextField variant="outlined" value={responderExpectedTokenAmount} onChange={(evt) => setResponderExpectedTokenAmount(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Program ID:</p>
              <TextField variant="outlined" value={responderEscrowProgramId} onChange={(evt) => setResponderEscrowProgramId(evt.target.value)}/>
            </div>
            <div className="button-container">
              <Button size="large" variant="contained" onClick={() => handleRespond()}>Respond</Button>
              <Button size="large"  variant="contained" color="error" onClick={() => handleResponderReset()}>Reset Responder's Data</Button>
            </div>
          </div>
          <div className="responder-data">
            <div className="text-field">
              <p className="bold">Initializer Main Account:</p>
              <p>Pub Key: {escrowInitializerAccountPubkey ?? '--'}</p>
              <p>Funds: {respondStepAccountInfo?.initializerMainAccountLamports ?? '--'}</p>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Temp Token account:</p>
              <p>Pub Key: {initializerTempTokenAccountPubkey ?? '--'}</p>
              <p>Funds: {respondStepAccountInfo?.initializerTokenAccountBalance ?? '--'}</p>
            </div>
            <div className="text-field">
              <p className="bold">Responder Receiving Token Account:</p>
              <p>Pub Key: {responderTokenAccountPubkey ?? '--'}</p>
              <p>Funds: {respondStepAccountInfo?.responderTokenAccountBalance ?? '--'}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Temp Token Account:</p>
              <p>Pub Key: {escrowTempTokenAccountPubkey}</p>
              <p>Funds: {respondStepAccountInfo?.escrowTempTokenAccountBalance ?? '--'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
