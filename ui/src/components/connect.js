import React from 'react'
import { BrowserProvider, Contract } from 'ethers'
import RCToken from './RCToken.json'
const contractAddress = "0x9FcEEf40DcE47c4D259e4A5387Fd53b1e37Df628"


export function ConnectWallet() {

    const [wallet, setWallet] = React.useState(null)
    const [contract, setContract] = React.useState(null)
    const [provider, setProvider] = React.useState(null)
    const [loaders, setLoaders] = React.useState(false)
    async function Connect() {

        if (!window.ethereum) {
            alert('Please install MetaMask to use this feature!')
            return
        }
        try {
            const provider = new BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const address = await signer.getAddress()
            const contracts = new Contract(contractAddress, RCToken.abi, signer)
            setWallet(address)
            setContract(contracts)
            setProvider(provider)
        } catch (error) {
            console.error('Error connecting to wallet:', error)
        }
    }
    return { Connect, contract, wallet, provider, loaders }

}