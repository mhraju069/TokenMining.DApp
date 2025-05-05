import React,{useState} from 'react'
import { BrowserProvider, Contract } from 'ethers'
import RCToken from './RCToken.json'
import Alert from './alert'
const contractAddress = "0x696FeBbBA2ef0d627b109bBee26654b977D4875F"


export function ConnectWallet() {

    const [wallet, setWallet] = React.useState(null)
    const [contract, setContract] = React.useState(null)
    const [provider, setProvider] = React.useState(null)
    const [admin, setAdmin] = useState(false);
    const [loaders, setLoaders] = React.useState(false)
    async function Connect() {

        if (!window.ethereum) {
            alert('Please install MetaMask to use this feature!')
            return
        }
        try {
            setLoaders(true)
            if (wallet) { Alert('Wallet already connected!', 'warning'); return; }
            const provider = new BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const address = await signer.getAddress()
            const contracts = new Contract(contractAddress, RCToken.abi, signer)
            const owner = await contracts.owner()
            setAdmin(owner.toLowerCase()==address.toLowerCase())
            setWallet(address)
            setContract(contracts)
            setProvider(provider)
            Alert('Wallet connected successfully!', 'success')
        } catch (error) {
            Alert('Wallet connection failed!', 'error')
            console.error('Error connecting to wallet:', error)
        } finally {
            setLoaders(false)
        }
    }
    return { Connect, contract, wallet, provider, loaders ,admin}

}