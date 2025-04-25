import { PublicKey, Transaction, SystemProgram, Connection, clusterApiUrl, getAssociatedTokenAddress } from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import { store } from '../store/store'

export const TokenType = {
  "USDT": "USDT",
  "TON": "TON",
  "SOL": "SOL",
};

export function getTokenAddressByType( tokenType ) { 
  if ( tokenType === TokenType.USDT ) {
    return "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
  }
  if ( tokenType === TokenType.TON ) { 
    throw Error('TON token is not supported yet');
  }

  console.log("Unsupported token type while getting token address:", tokenType);
  throw Error( 'Unsupported token type' );
}

export function getTokenDecimalByType ( tokenType ) { 
  //TODO(Simon) check if web3 lib has a function to get decimals
  if ( tokenType === TokenType.USDT ) {
    return 6
  }
  if ( tokenType === TokenType.SOL ) {
    return 9
  }
  if ( tokenType === TokenType.TON ) { 
    throw Error('TON token is not supported yet');
  }

  console.log("Unsupported token type while getting token decimal:", tokenType);
  throw Error( 'Unsupported token type' );
}

export function convertAmountToRawAmount ( amount, decimals = 6 ) {
  const value = Number(amount);
  if (isNaN(value)) {
    throw new Error('Invalid amount');
  }

  return Math.floor(value * Math.pow(10, decimals));
}

export async function sendSolTransaction ( toAddress, amount ) {
  const connection = store.solanaConnection;
  if (!connection) throw Error('User is disconnected');

  const wallet = window.solana;
  if (!wallet || !wallet.isPhantom) {
    throw Error('Wallet provider is not available');
  }

  const toPublicKey = new PublicKey(toAddress);

  const instructions = [];

  const transferIx = SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: toPublicKey,
    lamports: amount,
  });
  instructions.push(transferIx);

  const transaction = new Transaction();
  transaction.add( ...instructions );

  const recentBlockhash = await connection.getLatestBlockhash();
  transaction.recentBlockhash = recentBlockhash.blockhash;

  transaction.feePayer = wallet.publicKey;

  await window.solana.signAndSendTransaction(transaction, connection)
}

  
export async function sendTransaction ( toAddress, tokenAddress, amount ) {
  console.log("sendTransaction", toAddress, tokenAddress, amount);
  if (!toAddress || !tokenAddress || !amount) {
    throw Error('Invalid parameters', toAddress, tokenAddress, amount);
  }

  const connection = store.solanaConnection;
  if (!connection) throw Error('User is disconnected');

  const wallet = window.solana;
  if (!wallet || !wallet.isPhantom) {
    throw Error('Wallet provider is not available');
  }

  const tokenPublicKey = new PublicKey(tokenAddress);
  const toPublicKey = new PublicKey(toAddress);

  const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    tokenPublicKey,
    wallet.publicKey
  );

  const toTokenAccountAddress = await splToken.getAssociatedTokenAddress(
    tokenPublicKey,
    toPublicKey
  );
  
  const isToAccountExist = await checkIfAssociatedTokenAccountExists(
    connection,
    mintPubkey,
    toPubkey
  );
  
  const instructions = [];
  
  if ( !isToAccountExist ) {
    console.log("Creating associated token account for recipient");
    const createAssociatedTokenAccountIx = splToken.createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      toTokenAccountAddress,
      toPublicKey,
      tokenPublicKey,
    );
    instructions.push(createAssociatedTokenAccountIx);
  }

  const transferIx = splToken.createTransferInstruction(
    fromTokenAccount.address,
    toTokenAccountAddress,
    wallet.publicKey,
    amount,
    [],
    splToken.TOKEN_PROGRAM_ID
  );
  instructions.push(transferIx);

  const transaction = new Transaction();
  transaction.add( ...instructions );

  const recentBlockhash = await connection.getLatestBlockhash();
  transaction.recentBlockhash = recentBlockhash.blockhash;

  transaction.feePayer = wallet.publicKey;

  await window.solana.signAndSendTransaction(transaction);
}