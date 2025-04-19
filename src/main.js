import './style.css';

import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";



let provider;
let cachedPriceUSD = null;

const contractAddresses = {
  1: "0x7E20f6A0306537280BD41B0e5a49c2A021DC8798",     // Ethereum
  137: "0x57f5e0DDa1ddfdbBa469bCD6b6f90db5dE4ce69A",     // ✅ korrektes Checksum!
  56: "0x7E0A6F03060357828DD41B0e5a49c2A201DC8798"      // BNB
};




  
    // ABI des Smart Contracts (wie bereitgestellt)
    const contractABI = [
      {
        "inputs": [
          { "internalType": "address", "name": "spender", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [
          { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "account", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "burnFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "burnReservedTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "buyTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "claimRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "endPresaleManually",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "manageReservedTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "manualActivatePresale",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "contract IUniswapV2Router02", "name": "router", "type": "address" },
          { "internalType": "uint256", "name": "tokenAmount", "type": "uint256" },
          { "internalType": "uint256", "name": "nativeAmount", "type": "uint256" }
        ],
        "name": "manualAddLiquidityCustom",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "ownerDisableClaim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "ownerEnableClaim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "ownerEndStaking",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "ownerStartStaking",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "pair", "type": "address" },
          { "internalType": "bool", "name": "value", "type": "bool" }
        ],
        "name": "setAutomatedMarketMakerPair",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "stakeTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [
          { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "from", "type": "address" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [
          { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "newOwner", "type": "address" }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          { "internalType": "address", "name": "_teamWallet", "type": "address" },
          { "internalType": "address", "name": "_uniswapRouter", "type": "address" },
          { "internalType": "address", "name": "_pancakeswapRouter", "type": "address" },
          { "internalType": "address", "name": "_quickswapRouter", "type": "address" },
          { "internalType": "address", "name": "_priceFeedAddress", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "totalCollected",
        "outputs": [
          { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
async function connectWallet(chainId = "1") {
  provider = await EthereumProvider.init({
    projectId: "67c4292e272ac36fdbc049335adf6b67", // ← deine WalletConnect projectId
    chains: [parseInt(chainId)],
    optionalChains: [1, 56, 137],
    showQrModal: true,
    methods: ["eth_sendTransaction", "eth_sign", "personal_sign", "eth_signTypedData"],
    events: ["chainChanged", "accountsChanged"]
  });

  await provider.connect();

  const accounts = await provider.request({ method: 'eth_accounts' });
  const chain = await provider.request({ method: 'eth_chainId' });
  window.connectedChainId = Number(chain);

  alert(`Wallet verbunden:\nAdresse: ${accounts[0]}\nChain-ID: ${chain}`);
  updateQpepeAmount();

}

document.getElementById("connectButton").addEventListener("click", () => {
  const chainId = document.getElementById("chainSelect").value;
  connectWallet(chainId);
});


window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const autoTrigger = urlParams.get("autoconnect");

  if (autoTrigger === "true") {
    const chainId = document.getElementById("chainSelect")?.value || "1";
    connectWallet(chainId); // ruft die Verbindung direkt auf
  }
});

// --- Live Preis von CoinGecko holen
async function getLiveCryptoPrice(chainId) {
  let vsCurrency = "";

  if (chainId === 1) vsCurrency = "ethereum";
else if (chainId === 137 || chainId === 311) vsCurrency = "matic-network";
else if (chainId === 56) vsCurrency = "binancecoin";
else return null;



  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${vsCurrency}&vs_currencies=usd`);
    const data = await res.json();
    return data[vsCurrency]?.usd;
  } catch (err) {
    console.error("Fehler beim Preisabruf:", err);
    return null;
  }
}


async function updateQpepeAmount() {
  const input = document.getElementById("cryptoAmount");
  const output = document.getElementById("qpepeResult");

  const amount = parseFloat(input.value);
  const pricePerTokenUSD = 0.0001;

  if (!window.connectedChainId) {
    output.innerText = "Please connect your wallet first.";
    return;
  }

  if (!amount || amount <= 0) {
    output.innerText = "";
    return;
  }

  cachedPriceUSD = await getLiveCryptoPrice(window.connectedChainId);
  const cryptoPriceUSD = cachedPriceUSD;

  console.log("Aktueller Preis:", cryptoPriceUSD); // ← diese Zeile neu einfügen
  if (!cryptoPriceUSD) {
      alert("Price fetch failed.");
      return;
}


  const totalUSD = amount * cryptoPriceUSD;
  const tokenAmount = totalUSD / pricePerTokenUSD;

  output.innerText = `You will receive approximately ${Math.floor(tokenAmount).toLocaleString()} QPEPE Tokens`;
}

// Event beim Eingeben starten
document.getElementById("cryptoAmount").addEventListener("input", updateQpepeAmount);

async function buyToken() {
  const amountInput = document.getElementById("cryptoAmount");
  const amount = parseFloat(amountInput.value);

  if (!window.connectedChainId) {
    alert("Please connect your wallet first.");
    return;
  }

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  const cryptoPriceUSD = cachedPriceUSD;

  if (!cryptoPriceUSD) {
    alert("Price fetch failed.");
    return;
  }

  const pricePerTokenUSD = 0.0001;
  const totalUSD = amount * cryptoPriceUSD;
  const tokensToBuy = totalUSD / pricePerTokenUSD;

  // Verbindung zum Vertrag vorbereiten
  const signer = new ethers.BrowserProvider(provider).getSigner();

// Logging zur Fehlersuche:
  console.log("Chain ID:", window.connectedChainId);
  console.log("Vertrag:", contractAddresses[window.connectedChainId]);

  const contractAddress = contractAddresses[window.connectedChainId];
  const contract = new ethers.Contract(contractAddress, contractABI, await signer);


  try {
    const tx = await contract.buyTokens({ value: ethers.parseEther(amount.toString()) });

    await tx.wait();
    alert(`Transaction sent! Hash: ${tx.hash}`);
  } catch (err) {
    console.error("Kauf fehlgeschlagen:", err);
    alert("Transaction failed.");
  }
}

window.buyToken = buyToken;

