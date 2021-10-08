import {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as escrowinit from './util/initEscrow';
import * as escrowRespond from './util/respondEscrow';
import * as escrowBid from './util/increaseEscrowBid';
import * as escrowCancel from './util/cancelEscrow';
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

  // Respond Step Account Account Info
  let [respondStepAccountInfo, setRespondStepAccountInfo] = useState({});

  // Cancel Step Account Account Info
  let [cancelStepAccountInfo, setCancelStepAccountInfo] = useState({});

  // Bid Step Account Account Info
  let [bidStepAccountInfo, setBidStepAccountInfo] = useState({});

  // Receiver inputs
  let [responderPrivateKey, setResponderPrivateKey] = useState('');
  let [responderTokenAccountPubkey, setResponderTokenAccountPubkey] = useState('');
  let [responderEscrowProgramId, setResponderEscrowProgramId] = useState('');
  let [responderQuestionId, setResponderQuestionId] = useState(0);
  let [responderExpectedTokenAmount, setResponderExpectedTokenAmount] = useState(0);

  // Upbid inputs
  let [bidderPrivateKey, setBidderPrivateKey] = useState('');
  let [bidderTokenAccountPubkey, setBidderTokenAccountPubkey] = useState('');
  let [bidderEscrowProgramId, setBidderEscrowProgramId] = useState('');
  let [bidderQuestionId, setBidderQuestionId] = useState(0);
  let [bidderUpBidTokenAmount, setBidderUpBidTokenAmount] = useState(0);

  // Escrow State
  let [escrowAccountPubkey, setEscrowAccountPubkey] = useState('--');
  let [escrowIsInitialized, setEscrowIsInitialized] = useState('FALSE');
  let [escrowInitializerAccountPubkey, setEscrowInitializerAccountPubkey] = useState('--');
  let [escrowTempTokenAccountPubkey, setEscrowTempTokenAccountPubkey] = useState('--');
  let [escrowQuestionId, setEscrowQuestionId] = useState('--');
  let [escrowQuestionBidAmountTokens, setEscrowQuestionBidAmountTokens] = useState('--');
  let [escrowQuestionDuration, setEscrowQuestionDuration] = useState('--');
  let [escrowInitTime, setEscrowInitTime] = useState('--');

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
      setEscrowInitTime(result.escrowInitTimeStamp);

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
    //setSysAccountClockAddress(SYS_VAR_CLOCK_ADDRESS);
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
    setEscrowInitTime(0);
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

  const handleBid = async () => {
    try {
      const result =await escrowBid.upBid(
        connection,
        bidderPrivateKey,
        bidderTokenAccountPubkey,
        bidderUpBidTokenAmount,
        bidderQuestionId,
        escrowAccountPubkey,
        bidderEscrowProgramId,
      );

      const initializerMainAccountInfo = await getInfoForAccount(connection, escrowInitializerAccountPubkey);
      const initializerTokenAccountInfo = await getInfoForTokenAccount(connection, initializerTempTokenAccountPubkey);
      const bidderTokenAccountInfo = await getInfoForTokenAccount(connection, bidderTokenAccountPubkey);
      const escrowTempTokenAccountInfo = await getInfoForTokenAccount(connection, result.tempTokenAccountPubkey.toString());

      setBidStepAccountInfo({
        initializerMainAccountLamports: initializerMainAccountInfo.lamports,
        initializerTokenAccountBalance: initializerTokenAccountInfo.value.amount.toString(),
        bidderTokenAccountBalance: bidderTokenAccountInfo.value.amount.toString(),
        escrowTempTokenAccountBalance: escrowTempTokenAccountInfo.value.amount.toString()});

      alert("Success! Bidder has successfully up bid with escrow.");
    } catch (err) {
      alert(`Failed to complete escrow responder instruction: ${err.message}`);
    }
  }

  const handleBidderReset = () => {
    setBidderPrivateKey('');
    setBidderTokenAccountPubkey('');
    setBidderEscrowProgramId('');
    setBidderQuestionId(0);
    setBidderUpBidTokenAmount(0);
  }

  const handleCancel = () => {
    escrowCancel.cancelEscrow(
      connection,
      initializerPrivateKey,
      initializerTempTokenAccountPubkey,
      escrowTempTokenAccountPubkey,
      escrowAccountPubkey,
      initializerEscrowProgramId,
      initializerQuestionId,
      initializerQuestionBid
    )
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
              <p className="bold">Initializer Token Account Public Key:</p>
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
              <p className="bold">Escrow Account Public Key:</p>
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
              <p className="bold">Escrow Init Time:</p>
              <p>{escrowInitTime}</p>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Main Account:</p>
              <p>Pub Key: {escrowInitializerAccountPubkey ?? '--'}</p>
              <p>Funds (Lamports): {initializationStepAccountInfo?.initializerMainAccountLamports ?? '--'}</p>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Token account:</p>
              <p>Pub Key: {initializerTempTokenAccountPubkey ?? '--'}</p>
              <p>Funds (X Token): {initializationStepAccountInfo?.initializerTokenAccountBalance ?? '--'}</p>
            </div>
            <div className="text-field">
              <p className="bold">Responder Token Account:</p>
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
            <div className="text-field">
              <p className="bold">Escrow Init Time:</p>
              <p>{escrowInitTime}</p>
            </div>
          </div>
        </div>
        <div className="bidder-container">
          <div className="bidder-inputs">
            <h1>Up Bid:</h1>
            <div className="text-field">
              <p className="bold">Bidder Main Account Private Key (as byte array from sollet.io, without the '[]')</p>
              <TextField variant="outlined" value={bidderPrivateKey} onChange={(evt) => setBidderPrivateKey(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Bidder Sending Token Account Public Key:</p>
              <TextField variant="outlined" value={bidderTokenAccountPubkey} onChange={(evt) => setBidderTokenAccountPubkey(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Bidder Question ID:</p>
              <TextField variant="outlined" value={bidderQuestionId} onChange={(evt) => setBidderQuestionId(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Bidder Up Bid Token Amount:</p>
              <TextField variant="outlined" value={bidderUpBidTokenAmount} onChange={(evt) => setBidderUpBidTokenAmount(evt.target.value)}/>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Program ID:</p>
              <TextField variant="outlined" value={bidderEscrowProgramId} onChange={(evt) => setBidderEscrowProgramId(evt.target.value)}/>
            </div>
            <div className="button-container">
              <Button size="large" variant="contained" onClick={() => handleBid()}>Bid</Button>
              <Button size="large"  variant="contained" color="error" onClick={() => handleBidderReset()}>Reset Bidder's Data</Button>
            </div>
          </div>
          <div className="bidder-data">
            <div className="text-field">
              <p className="bold">Initializer Main Account:</p>
              <p>Pub Key: {escrowInitializerAccountPubkey ?? '--'}</p>
              <p>Funds: {bidStepAccountInfo?.initializerMainAccountLamports ?? '--'}</p>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Temp Token account:</p>
              <p>Pub Key: {initializerTempTokenAccountPubkey ?? '--'}</p>
              <p>Funds: {bidStepAccountInfo?.initializerTokenAccountBalance ?? '--'}</p>
            </div>
            <div className="text-field">
              <p className="bold">Bidder Sending Token Account:</p>
              <p>Pub Key: {bidderTokenAccountPubkey ?? '--'}</p>
              <p>Funds: {bidStepAccountInfo?.bidderTokenAccountBalance ?? '--'}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Temp Token Account:</p>
              <p>Pub Key: {escrowTempTokenAccountPubkey}</p>
              <p>Funds: {bidStepAccountInfo?.escrowTempTokenAccountBalance ?? '--'}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Init Time:</p>
              <p>{escrowInitTime}</p>
            </div>
          </div>
        </div>
        <div className="cancel-container">
          <div className="cancel-inputs">
            <h1>Cancel:</h1>
            <div className="text-field">
              <p className="bold">Initializer Main Account Private Key (as byte array from sollet.io, without the '[]'):</p>
              <p> {initializerPrivateKey}</p>
            </div>
            <div className="text-field">
              <p className="bold">Initializer Token Account Public Key:</p>
              <p> {initializerTempTokenAccountPubkey}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow (PDA) Temp Token Account Public Key:</p>
              <p>{escrowTempTokenAccountPubkey}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Account Public Key:</p>
              <p> {escrowAccountPubkey}</p>
            </div>
            <div className="text-field">
              <p className="bold">Escrow Program ID Public Key:</p>
              <p> {initializerEscrowProgramId}</p>
            </div>
            <div className="button-container">
              <Button size="large" variant="contained" onClick={() => handleCancel()}>Cancel</Button>
            </div>
          </div>
          <div className="cancel-data">
            <div className="text-field">
              <p className="bold">Initializer Token Account:</p>
              <p>Pub Key: {initializerTempTokenAccountPubkey ?? '--'}</p>
              <p>Funds: {cancelStepAccountInfo?.initializerTokenAccountBalance ?? '--'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
