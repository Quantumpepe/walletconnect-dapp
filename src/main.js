import { EthereumProvider } from "https://cdn.skypack.dev/@walletconnect/ethereum-provider";

let provider;

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

  alert(`Wallet verbunden:\nAdresse: ${accounts[0]}\nChain-ID: ${chain}`);
}

document.getElementById("connectButton").addEventListener("click", () => {
  const chainId = document.getElementById("chainSelect").value;
  connectWallet(chainId);
});


window.addEventListener('load', () => {
  const autoTrigger = new URLSearchParams(window.location.search).get("autoconnect");
  if (autoTrigger === "true") {
    const chainId = document.getElementById("chainSelect")?.value || "1";
    connectWallet(chainId);
  }
});


