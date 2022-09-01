import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";
import { resolve } from "path";
import "tsconfig-paths/register";

dotenvConfig({ path: resolve(__dirname, "./.env") });

// Ensure that we have all the environment variables we need.
const privateKey1: string = process.env.ACCOUNT_PRIVATE_KEY_1 || "";
const privateKey2: string = process.env.ACCOUNT_PRIVATE_KEY_2 || "";
if (!privateKey1 || !privateKey2) {
  throw new Error("Please set your ACCOUNT_PRIVATE_KEY in a .env file");
}

const alchemyApiKey: string | undefined = process.env.ALCHEMY_API_KEY;
if (!alchemyApiKey) {
  throw new Error("Please set your ALCHEMY_API_KEY in a .env file");
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      avalanche: process.env.SNOWTRACE_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISM_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      rinkeby: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${alchemyApiKey}`,
      accounts: [privateKey1, privateKey2],
      chainId: 4,
    },
    // rinkeby: getChainConfig("rinkeby"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.6.6",
      },
      {
        version: "0.5.0",
      },
    ],
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v5",
  },
};

export default config;
