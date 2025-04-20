import { BrowserRouter as Router} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { MainApp } from './AppController';


function App() {
  return (
    <RecoilRoot>
      <Router>
        <MainApp />
      </Router>
    </RecoilRoot>
  );
}

export default App;
