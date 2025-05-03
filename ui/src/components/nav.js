import React from 'react'

export default function Nav(props) {
    const { Connect, wallet } = props
    const address= wallet?.toString().slice(0, 6) + '....' + wallet?.toString().slice(-5)
    return (
        <header>
            <div className="logo">
                <div className="logo-icon">RC</div>
                <div className="logo-text">Royal Champion</div>
            </div>
            <button type='button' onClick={Connect} className="wallet-btn">{wallet===null?'Connect Wallet':address}</button>
        </header>
    )
}
