import React from 'react'

export default function Nav(props) {
    const { Connect, wallet,loaders } = props
    const address= wallet?.toString().slice(0, 6) + '....' + wallet?.toString().slice(-5)
    return (
        <header>
            <div className="logo">
                <div className="logo-icon">NM</div>
                <div className="logo-text">Nexus Miner</div>
            </div>
            <button type='button' onClick={Connect} className="wallet-btn">{wallet===null?'Connect Wallet':address}</button>
        </header>
    )
}
