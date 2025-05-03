import React, { useState, useEffect } from 'react';
import Loader from './loader';
import Alert from './alert';
export default function Progress(props) {
    const { contract, wallet, } = props;
    const [mining, setMining] = useState(false);
    const [startAt, setStartAt] = useState(0);
    const [progress, setProgress] = useState(0);
    const [interval, setInterval] = useState(0);
    const [loading, setLoading] = useState(false);

    // Mine function
    async function Mine() {
        if (!contract || !wallet) {
            alert("Please connect your wallet first.");
            return;
        }
        setLoading(true);
        const mine = await contract.Mine();
        await mine.wait();
        const timestamp = await contract.lastMined(wallet);
        const duration = await contract.mineRate();
        setStartAt(Number(timestamp));
        setMining(true);
        setInterval(Number(duration.toString()));
        setLoading(false);
        Alert('Start mining successfully!', 'success')
    }

    // Claim function
    async function Claim() {
        setLoading(true);
        const claim = await contract.Claim();
        await claim.wait();
        setMining(false);
        setProgress(0);
        setStartAt(0);
        setLoading(false);
        Alert('Claimed Token successfully!', 'success')
    }

    // Fetch mining state and details
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            if (!contract || !wallet) return;
            const ismine = await contract.isMining(wallet);
            if (!ismine) return;

            const duration = await contract.interval();
            setInterval(Number(duration.toString()));  // Convert BigInt properly

            const timestamp = await contract.lastMined(wallet);
            setStartAt(Number(timestamp));
            setMining(true);
            setLoading(false);
        }
        fetchData();
    }, [contract, wallet]);

    // Progress update function
    useEffect(() => {
        const updateProgress = () => {
            setLoading(true);
            const now = Math.floor(Date.now() / 1000);
            const elapsed = now - startAt;
            const newProgress = Math.min((elapsed / (interval)) * 100, 100);
            setProgress(newProgress);
            console.log(`Progress: ${newProgress}%`); // Debugging log
            if (newProgress < 100 && mining) {
                requestAnimationFrame(updateProgress);
            }
            setLoading(false);
        };

        if (mining && startAt !== 0 && interval !== 0) {
            updateProgress(); // Start progress updates
        }
    }, [mining, startAt, interval]);  // Add interval and startAt as dependencies



    return ( <>
        {loading && <Loader />}
        <div className="mining-card">
            <div className="card-header">
                <div className="card-title">Mining Status</div>
                <div className='status-container'>
                    
                <div className={`status-indicator ${!mining?"pause":""}`} ></div>
                <div className="card-badge"> {!mining? "Pause" : "In Progress"} </div>
                </div>
            </div>
            {/* <div className="card-value"> {mining ? `${progress.toFixed(1)}%` : ""}</div> */}

            <div className="mining-circle-container">
                <div className="mining-circle">
                    <div className="circle-glow"></div>
                    <div className="circle-ring"></div>
                    <div className="circle-ring"></div>
                    <div className="circle-ring"></div>
                    <span onClick={ mining? null: Mine} className="circle-core" style={{ display: mining ? 'none' : 'flex' }}>
                        {mining ? `${progress.toFixed(1)}%` : "Start"}
                    </span>
                    <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDU5ZDV3cGdvYTlubXRjZzJldzRndGx4aHVyaDEwNzZ0OXBwZ2w4dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XTfFf1qHwmqsVDqbTe/giphy.gif" alt=""/>
                    <div className="data-particles" id="data-particles"></div>
                </div>
            </div>
            <span onClick={progress >= 100 ? Claim :wallet && !mining? Mine: null} className="progress-container primary-btn">
                <div className="card-value"> {mining ? `${progress.toFixed(1)}%` : wallet && !mining? "Start Mining" : progress >= 100 ? "Claim Token" : ""}</div>
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </span>
        </div></>
    );
}
