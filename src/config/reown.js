import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { createAppKit } from "@reown/appkit";
import { solana } from "@reown/appkit/networks";

const projectId = process.env.PROJECT_ID;
if (!projectId) {
  throw new Error('Missing PROJECT_ID in environment variables');
}

const metadata = {
  name: process.env.APP_NAME,
  description: process.env.APP_DESCRIPTION,
  url: process.env.APP_URL,
  icons: [process.env.APP_ICON_URL]
};

const solanaAdapter = new SolanaAdapter();

export const appKit = createAppKit( {
  projectId,
  adapters: [ solanaAdapter ],
  networks: [ solana ],
  metadata: metadata,
  allWallets: "HIDE",
  features: {
    email: false,
    socials: false,
    emailShowWallets: false,
    analytics: true
  },
  enableWalletConnect: false,
  enableNetworkSwitch: false,
  enableWalletGuide: false,
  includeWalletIds: [ // https://docs.reown.com/cloud/wallets/wallet-list
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393', // phantom
  ],
} );
