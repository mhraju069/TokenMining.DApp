import React, { useEffect, useState } from 'react';

export default function Stats(props) {
    const { contract, wallet } = props;
    const [accuracy, setAccuracy] = useState(0);
    const [balance, setBalance] = useState(0);
    const [session, setSession] = useState(0);
    const [miningRate, setMiningRate] = useState(0);

    // Fetching data from the contract
    useEffect(() => {
        async function fetchData() {
            if (!contract || !wallet) return;

            // Fetch mineCount, totalMined, and mineRate
            const mineCount = await contract.mineCount(wallet);
            const totalMined = await contract.totalMined(wallet);
            const rate = await contract.mineRate();

            // Ensure BigInt to Number conversion
            setBalance(Number(totalMined.toString()));
            setSession(Number(mineCount.toString()));
            setMiningRate(Number(rate.toString()));
        }
        fetchData();
    }, [contract, wallet]);

    // Calculating performance (accuracy)
    useEffect(() => {
        async function calculatePerformance() {
            if (!contract || !wallet) return;

            const mineCount = await contract.mineCount(wallet);
            const joinDate = await contract.joinDate(wallet);
            const currentDate = Math.floor(Date.now() / 1000);
            const elapsedTime = currentDate - Number(joinDate.toString()); // Convert BigInt to Number
            const elapsedTimeInDays = elapsedTime / 86400;

            // Ensure the calculation is done with proper numbers
            setAccuracy(((Number(mineCount.toString()) / elapsedTimeInDays) * 100).toFixed(2));  // Fix: Adding 100 to percentage
        }
        calculatePerformance();
    }, [contract, wallet]);

    return (
        <div>
            <div className="mining-card">
                <div className="card-header">
                    <div className="card-title">Your Stats</div>
                </div>

                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-label">Mining Rate</div>
                        <div className="stat-value">{miningRate} RC/D</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Balance</div>
                        <div className="stat-value">{balance} RC</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Session Complited</div>
                        <div className="stat-value">{session}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Performance</div>
                        <div className="stat-value">{accuracy}%</div>
                    </div>
                </div>
            </div>

            <div className="history-card">
                <div className="history-header">
                    <div className="history-title">Recent Transactions</div>
                    <div className="view-all">View All</div>
                </div>

                <div className="history-item">
                    <div>
                        <div className="history-amount">+2.87 NXM</div>
                        <div className="history-date">Today, 10:45 AM</div>
                    </div>
                    <div className="history-status status-completed">Completed</div>
                </div>

                <div className="history-item">
                    <div>
                        <div className="history-amount">+2.15 NXM</div>
                        <div className="history-date">Yesterday, 8:30 PM</div>
                    </div>
                    <div className="history-status status-completed">Completed</div>
                </div>

                <div className="history-item">
                    <div>
                        <div className="history-amount">Boost Purchase</div>
                        <div className="history-date">May 12, 3:15 PM</div>
                    </div>
                    <div className="history-status status-completed">Completed</div>
                </div>
            </div>
        </div>
    );
}
