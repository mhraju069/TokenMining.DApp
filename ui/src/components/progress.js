import React, { useState, useEffect, useRef, use } from 'react';

export default function Progress(props) {
    const { contract, wallet } = props;
    const [mining, setMining] = useState(false);
    const [startAt, setStartAt] = useState(0);
    const [progress, setProgress] = useState(0);
    const [interval, setInterval] = useState(0);
    const [uptime, setUptime] = useState(0);

    // Mine function
    async function Mine() {
        if (!contract || !wallet) {
            alert("Please connect your wallet first.");
            return;
        }
        const mine = await contract.Mine();
        await mine.wait();
        const timestamp = await contract.lastMined(wallet);
        const duration = await contract.mineRate();
        setStartAt(Number(timestamp));
        setMining(true);
        setInterval(Number(duration.toString()));  // Convert BigInt properly
    }

    // Claim function
    async function Claim() {
        const claim = await contract.Claim();
        await claim.wait();
        setMining(false);
        setProgress(0);
        setStartAt(0);
        alert("Claimed successfully!");
    }

    // Fetch mining state and details
    useEffect(() => {
        async function fetchData() {
            if (!contract || !wallet) return;

            const ismine = await contract.isMining(wallet);
            if (!ismine) return;

            const duration = await contract.interval();
            setInterval(Number(duration.toString()));  // Convert BigInt properly

            const timestamp = await contract.lastMined(wallet);
            setStartAt(Number(timestamp));
            setMining(true);
        }
        fetchData();
    }, [contract, wallet]);

    // Progress update function
    useEffect(() => {
        const updateProgress = () => {
            const now = Math.floor(Date.now() / 1000);
            const elapsed = now - startAt;
            const newProgress = Math.min((elapsed / (interval)) * 100, 100);
            setProgress(newProgress);
            console.log(`Progress: ${newProgress}%`); // Debugging log
            if (newProgress < 100 && mining) {
                requestAnimationFrame(updateProgress);
            }
        };

        if (mining && startAt !== 0 && interval !== 0) {
            updateProgress(); // Start progress updates
        }
    }, [mining, startAt, interval]);  // Add interval and startAt as dependencies


    useEffect(() => {
        const dataParticlesContainer = document.getElementById('data-particles');
        const particleCount = 80;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'data-particle';

            // Random starting position near the center
            const startX = (Math.random() * 40 - 20);
            const startY = (Math.random() * 40 - 20);

            // Random target position
            const targetX = (Math.random() * 200 - 100);
            const targetY = (Math.random() * 200 - 100);

            particle.style.setProperty('--tx', `${targetX}px`);
            particle.style.setProperty('--ty', `${targetY}px`);
            particle.style.left = `calc(50% + ${startX}px)`;
            particle.style.top = `calc(50% + ${startY}px)`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${5 + Math.random() * 10}s`;

            dataParticlesContainer.appendChild(particle);
        }
    }, [progress]);

    return (
        <div className="mining-card">
            <div className="card-header">
                <div className="card-title">Mining Status</div>
                <div className="card-badge">In Progress</div>
            </div>
            <div className="card-value">3.87 NXM</div>
            <div className="progress-container">
                {/* Use React state to control progress bar width */}
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="mining-status">
                <div className="status-indicator"></div>
                <div className="status-text">Mining in progress</div>
            </div>

            <div className="mining-circle-container">
                <div className="mining-circle">
                    <div className="circle-glow"></div>
                    <div className="circle-ring"></div>
                    <div className="circle-ring"></div>
                    <div className="circle-ring"></div>
                    <span onClick={ mining? null: Mine} className="circle-core">
                        {mining ? `${progress.toFixed(1)}%` : "Start"}
                    </span>
                    <div className="data-particles" id="data-particles"></div>
                </div>
            </div>

            <button className="action-btn primary-btn" onClick={progress >= 100 ? Claim : Mine}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 7H11V11H7V13H11V17H13V13H17V11H13V7Z" fill="currentColor" />
                </svg>
                {progress >= 100 ? "Claim Token" : !mining? "Start Mining" : "Mining..."}
            </button>
        </div>
    );
}
