import './App.css';
import Nav from './components/nav';
import Particles from './components/particles';
import Progress from './components/progress';
import Stats from './components/stats';
import {ConnectWallet} from './components/connect';

function App() {
  const {Connect, contract, wallet, loaders } = ConnectWallet();

  

  return (
    <>
      <Particles />
      <div className="container">
        <Nav Connect={Connect} wallet={wallet} loaders={loaders} />
        <div className="main-content">
          <Progress contract={contract} wallet={wallet} />
          <Stats  contract={contract} wallet={wallet} />
        </div>
      </div>
    </>
  );
}

export default App;
