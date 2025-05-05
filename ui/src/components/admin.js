import React, { useEffect, useState } from 'react'
import Loader from './loader';
import Alert from './alert';

export default function Admin(props) {
    const { contract } = props;
    const [showForm, setShowForm] = React.useState(false)
    const [intervals, setIntervals] = React.useState(0)
    const [oldTime, setOldTime] = React.useState(0)
    const [oldRate, setOldRate] = React.useState(0)
    const [miningRate, setMiningRate] = React.useState(0)
    const [loading, setLoading] = useState(false);


    const ChangeInterval = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const time = await contract.ChangeInterval(intervals)
            await time.wait()
            setShowForm(false)
            console.log("change time to", time)
            Alert(`Time change to ${intervals}H successfully!`, "success")

        } catch (error) {
            console.log(error)
            Alert(`Time change failed!`, "error")
        }
        finally {
            setLoading(false)
        }
    }
    const ChangeRate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const rate = await contract.ChangeRate(miningRate)
            await rate.wait()
            setShowForm(false)
            Alert(`Rate change to ${miningRate}RC successfully!`, "success")

        } catch (error) {
            console.log(error)
            Alert(`Rate change failed!`, "error")
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!contract) return;
            const oldtime = await contract.interval()
            const oldrate = await contract.mineRate()

            setOldRate(Number(oldrate.toString()))
            setOldTime(Number(oldtime.toString()) / 60)
        }
        fetchData();
    }, [contract, intervals])

    return (
        <>
            {loading && <Loader />}
            <div className="admin-container">
                {/* <!-- From Uiverse.io by andrew-demchenk0 --> */}
                <button className="button" onClick={() => setShowForm(!showForm ? true : false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20" fill="none" className="svg-icon"><g strokeWidth="1.5" strokeLinecap="round" stroke="#5d41de"><circle r="2.5" cy="10" cx="10"></circle><path fillRule="evenodd" d="m8.39079 2.80235c.53842-1.51424 2.67991-1.51424 3.21831-.00001.3392.95358 1.4284 1.40477 2.3425.97027 1.4514-.68995 2.9657.82427 2.2758 2.27575-.4345.91407.0166 2.00334.9702 2.34248 1.5143.53842 1.5143 2.67996 0 3.21836-.9536.3391-1.4047 1.4284-.9702 2.3425.6899 1.4514-.8244 2.9656-2.2758 2.2757-.9141-.4345-2.0033.0167-2.3425.9703-.5384 1.5142-2.67989 1.5142-3.21831 0-.33914-.9536-1.4284-1.4048-2.34247-.9703-1.45148.6899-2.96571-.8243-2.27575-2.2757.43449-.9141-.01669-2.0034-.97028-2.3425-1.51422-.5384-1.51422-2.67994.00001-3.21836.95358-.33914 1.40476-1.42841.97027-2.34248-.68996-1.45148.82427-2.9657 2.27575-2.27575.91407.4345 2.00333-.01669 2.34247-.97026z" clipRule="evenodd"></path></g></svg>
                    <span className="lable">Settings</span>
                </button>

            </div>

            {showForm && <div className="form-container">
                {/* <!-- First Form --> */}
                <div className="form-card">
                    <div className="form-header">
                        <h2 className="form-title">Configure your interval time.</h2>
                        <p className="form-description">Adjust your interval time between 2 sessions.</p>
                    </div>

                    <form onSubmit={ChangeInterval}>
                        <div className="input-group">
                            <label htmlFor="wallet-address" className="input-label">Enter new interval time (Minutes).</label>
                            <input
                                required
                                type="text"
                                id="wallet-address"
                                className="input-field"
                                step='1'
                                min='1'
                                placeholder={`Current Time: ${oldTime}Min`}
                                onChange={(e) => setIntervals(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="submit-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Save Changes
                        </button>
                    </form>
                    <div className="form-divider">
                        {/* <span className="divider-text">OR</span> */}
                    </div>

                    <div className="form-header">
                        <h2 className="form-title">Mining Rate Configuration</h2>
                        <p className="form-description">Adjust your mining rate for a session.</p>
                    </div>

                    <form onSubmit={ChangeRate}>
                        <div className="input-group">
                            <label htmlFor="wallet-address" className="input-label">Enter new interval time (Hour).</label>
                            <input
                                required
                                type="text"
                                id="wallet-address"
                                className="input-field"
                                placeholder={`Current Rate: ${oldRate}RC`}
                                onChange={(e) => setMiningRate(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="submit-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Apply Settings
                        </button>
                    </form>
                </div>
            </div>}

        </>
    )
}
