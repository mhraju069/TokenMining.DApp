import React, { useEffect, useState } from 'react';
import { formatUnits } from 'ethers';

export default function Stats(props) {
    const { contract, wallet } = props;
    const [accuracy, setAccuracy] = useState(0);
    const [balance, setBalance] = useState(0);
    const [session, setSession] = useState(0);
    const [miningRate, setMiningRate] = useState(0);
    const [history, setHistory] = useState([]);

    // Fetching data from the contract
    useEffect(() => {
        async function fetchData() {
            if (!contract || !wallet) return;

            const mineCount = await contract.mineCount(wallet);
            const totalMined = await contract.totalMined(wallet);
            const rate = await contract.mineRate();

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
            const elapsedTime = currentDate - Number(joinDate.toString());
            const elapsedTimeInDays = elapsedTime / 86400;

            setAccuracy(((Number(mineCount.toString()) / elapsedTimeInDays) * 100).toFixed(2));
        }
        calculatePerformance();
    }, [contract, wallet]);

    useEffect(() => {
        async function History() {
            if (!contract || !wallet) return;

            const history = await contract.queryFilter(contract.filters.minelog(wallet));
            setHistory(history);

        }
        History();
    }, [contract, wallet])


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
                        <div className="stat-label">Token Balance</div>
                        <div className="stat-value">{balance} RC</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Session Complited</div>
                        <div className="stat-value">{session}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Accuracy</div>
                        <div className="stat-value">{accuracy}%</div>
                    </div>
                </div>
            </div>

            <div className="history-card">
                <div className="history-header">
                    <div className="history-title">{history.length === 0? "No History" : "Recent History"} </div>
                </div>
                <div className="history-grid">
                    {history.map((item, index) => {
                        return (
                            <div key={index} className="history-item">
                                <div>
                                    <div className="history-amount"> {formatUnits(item.args?.token, 18)} RC</div>
                                    <div className="history-date">{new Date(Number(item.args?.time) * 1000).toLocaleString()}</div>
                                </div>
                                <div className={`history-status ${session===index?"status-incompleted": "status-completed"}`} > {session===index?"Pending": "Completed"} </div>
                            </div>
                        );
                    })}

                </div>
            </div>  
        </div>
    );
}
