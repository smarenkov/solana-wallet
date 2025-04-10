import { appKit as modal } from '../config/reown'
import { store, updateStore } from '../store/store'
import { solana  } from '@reown/appkit/networks'
import { Connection } from "@solana/web3.js";

export const initializeSubscribers = () => {
  modal.subscribeProviders(state => {
    updateStore('solanaProvider', state['solana'])
    console.log("state initial:",store['solanaProvider']);
    console.log("Chains:",store['solanaProvider'].requestedChains);
    const url = state['solana'].getActiveChain().rpcUrls.default.http[0];
    const connection = new Connection(url);
    
    updateStore('solanaConnection', connection)
  })

  modal.subscribeAccount(state => {
    updateStore('accountState', state)
  })

  modal.subscribeNetwork(state => {
    updateStore('networkState', state)
    console.log("network:", state.chainId);
    if (store['solanaProvider']) {
      const arrayChain = store['solanaProvider'].requestedChains
      const selectedChain = arrayChain.find(chain => chain.id === state.chainId);
      const url = selectedChain.rpcUrls.default.http[0];
      const connection = new Connection(url);
      updateStore('solanaConnection', connection)
    }
    const switchNetworkBtn = document.getElementById('switch-network')
    if (switchNetworkBtn) {
      switchNetworkBtn.textContent = `Switch to ${
        state?.chainId === solana.id ? 'Solana Devnet' : 'Solana'
      }`
    }
  })

  modal.subscribeState(state => {
    store.appKitState = state
  })
}