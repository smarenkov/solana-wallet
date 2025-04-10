import { Buffer } from 'buffer';

import { initializeSubscribers } from './utils/subscribers'
import { appKit } from './config/reown'

import * as walletService from './services/wallet';

const init = () => {
  console.log( "Initializing..." );
  window.wallet = window.wallet || {};

  initializeSubscribers()
  
  function openConnectModal() {
    appKit.open({ view: "Connect", namespace: "solana" });
  };
  window.wallet.connect = openConnectModal;


  function getIsConnectedState() {
    return appKit.getIsConnectedState();
  };
  window.wallet.isConnected = getIsConnectedState;

  async function sendTransaction( toAddress, token, amount ) {
    const tokenAddress = walletService.getTokenAddressByType( token );
    const tokenDecimal = walletService.getTokenDecimalByType( token );
    const rawAmount = walletService.convertAmountToRawAmount( amount, tokenDecimal );

    return await walletService.sendTransaction(toAddress, tokenAddress, rawAmount);
  };
  window.wallet.sendTransaction = sendTransaction;
};

window.onload = () => {
  window.Buffer = Buffer; 
  init();
};