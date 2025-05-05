import React, { useState, useEffect } from 'react';
import Loader from './loader';
import Alert from './alert';

export default function Progress(props) {
    const { contract, wallet, mining, setMining } = props;
    const [startAt, setStartAt] = useState(0);
    const [progress, setProgress] = useState(0);
    const [interval, setInterval] = useState(0);
    const [loading, setLoading] = useState(false);
    const [btnText, setBtnText] = useState(false);

    // Mine function
    async function Mine() {
        if (!contract || !wallet) {
            alert("Please connect your wallet first.");
            return;
        }
        try {
            setLoading(true);
            const mine = await contract.Mine();
            await mine.wait();
            const timestamp = await contract.lastMined(wallet);
            const duration = await contract.interval();
            setStartAt(Number(timestamp));
            setMining(true);
            setInterval(Number(duration.toString()));
            Alert('Start mining successfully!', 'success');
        } catch (error) {
            Alert('Start mining failed!', 'error');
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // Claim function
    async function Claim() {
        try {
            setLoading(true);
            const claim = await contract.Claim();
            await claim.wait();
            setMining(false);
            setProgress(0);
            setStartAt(0);
            Alert('Claimed Token successfully!', 'success');
        } catch (e) {
            Alert('Claim failed!', 'error');
            console.error("claim failed" + e)
        } finally {
            setLoading(false);
        }
    }

    // Fetch mining state and details
    useEffect(() => {
        async function fetchData() {
            if (!contract || !wallet) return;
            const isMine = await contract.isMining(wallet);
            setLoading(true);
            const duration = await contract.interval();
            setInterval(Number(duration.toString()));
            const timestamp = await contract.lastMined(wallet);
            setStartAt(Number(timestamp));
            setMining(isMine);
            setLoading(false);
        }
        fetchData();
    }, [contract, wallet]);

    // Progress update function
    useEffect(() => {
        const updateProgress = () => {
            const now = Math.floor(Date.now() / 1000);
            const elapsed = Math.max(0, now - startAt);
            const newProgress = Math.min((elapsed / (interval)) * 100, 100);
            setProgress(newProgress);
            if (newProgress < 100 && mining) {
                requestAnimationFrame(updateProgress);
            }
        };
        if (mining && startAt !== 0 && interval !== 0) {
            updateProgress();
        }
    }, [mining, startAt, interval]);

    //Change btnText function
    useEffect(() => {
        const fetchText = async () => {
            if (mining && progress == 100) {
                setBtnText("Claim Token");
            }
            else if (mining && progress < 100) {
                setBtnText(`${progress.toFixed(1)}%`);
            }
            else if (!mining) {
                setBtnText("Start Mining");
            }

        };
        fetchText();
    }, [mining, progress])


    return (
        <>
            {loading && <Loader />}
            <div className="mining-card">
                <div className="card-header">
                    <div className="card-title">Mining Status</div>
                    <div className="status-container">
                        <div className={`status-indicator ${!mining ? "pause" : ""}`}></div>
                        <div className="card-badge">{!mining ? "Pause" : "In Progress"}</div>
                    </div>
                </div>

                <div className="mining-circle-container">
                    <div className="mining-circle">
                        <div className="circle-glow"></div>
                        <div className="circle-ring"></div>
                        <div className="circle-ring"></div>
                        <div className="circle-ring"></div>
                        <span onClick={!mining ? Mine : progress >= 100 ? Claim : null} className="circle-core" style={{ display: mining ? 'none' : 'flex' }}>
                            {mining ? `${progress.toFixed(1)}%` : "Start"}
                        </span>
                        {mining && <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDU5ZDV3cGdvYTlubXRjZzJldzRndGx4aHVyaDEwNzZ0OXBwZ2w4dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XTfFf1qHwmqsVDqbTe/giphy.gif" alt="" />
                        }
                    </div>
                </div>
                <span onClick={!mining ? Mine : progress >= 100 ? Claim : null} className="progress-container primary-btn">
                    <div className="card-value">{btnText}</div>
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </span>
            </div>
        </>
    );
}
