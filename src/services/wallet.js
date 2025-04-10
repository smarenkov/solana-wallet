import { PublicKey, Transaction } from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import { store } from '../store/store'

export const TokenType = {
  "USDT": "USDT",
};

export function getTokenAddressByType( tokenType ) { 
  if ( tokenType === TokenType.USDT ) {
    return "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
  }

  console.log("Unsupported token type while getting token address:", tokenType);
  throw Error( 'Unsupported token type' );
}

export function getTokenDecimalByType( tokenType ) { 
  if ( tokenType === TokenType.USDT ) {
    return 6
  }

  console.log("Unsupported token type while getting token decimal:", tokenType);
  throw Error( 'Unsupported token type' );
}

export function convertAmountToRawAmount(amount, decimals = 6) {
  const value = Number(amount);
  if (isNaN(value)) {
    throw new Error('Invalid amount');
  }

  return Math.floor(value * Math.pow(10, decimals));
}

  
export async function sendTransaction( toAddress, tokenAddress, amount ) {
  if ( !toAddress || !tokenAddress || !amount ) {
    throw Error( 'Invalid parameters', toAddress, tokenAddress, amount );
  };
  
  const connection = store.solanaConnection
  if ( !connection ) throw Error( 'user is disconnected' );

  const wallet = window.solana;
  if ( !wallet || !wallet.isPhantom ) {
    throw Error( 'wallet provider is not available' );
  };

  const tokenPublicKey = new PublicKey(tokenAddress);  
  const toPublicKey = new PublicKey(toAddress);
  
  const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    tokenPublicKey,
    wallet.publicKey,
  );

  const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    tokenPublicKey,
    toPublicKey
  );
  
  const { TOKEN_PROGRAM_ID } = splToken

  const instruction = splToken.createTransferInstruction(
    fromTokenAccount.address,
    toTokenAccount.address,
    wallet.publicKey,
    amount,
    [],
    TOKEN_PROGRAM_ID
  );

  let transaction = new Transaction().add(instruction);
  transaction.recentBlockhash = ( await connection.getLatestBlockhash() ).blockhash;
  transaction.feePayer = wallet.publicKey;

  await window.solana.signAndSendTransaction(transaction);
}