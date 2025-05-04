import './App.css';
import Nav from './components/nav';
import Particles from './components/particles';
import Progress from './components/progress';
import Stats from './components/stats';
import { ConnectWallet } from './components/connect';
import Loader from './components/loader'
import Admin from './components/admin';
import { useState } from 'react';

function App() {
  const { Connect, contract, wallet, loaders, admin } = ConnectWallet();
  const [mining, setMining] = useState(false);




  return (
    <>
      <Particles />
      <div className="container">
        <Nav Connect={Connect} wallet={wallet} loaders={loaders} />
        
        {!wallet ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
            <h1 style={{fontFamily:'cursive'}} >Welcome to RC Token</h1>
            <h2 style={{fontFamily:'cursive'}}>Connect Your Wallet to Start Mining.</h2>
          </div>) 
          :
          (<div className="main-content">
            <Progress contract={contract} wallet={wallet} mining={mining} setMining={setMining} />
            <Stats contract={contract} wallet={wallet} mining={mining}/>
          </div>)}
      </div>
      {admin && < Admin contract={contract} />}
      {loaders && <Loader />}
    </>
  );
}

export default App;
