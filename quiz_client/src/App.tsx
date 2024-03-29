import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import Lessons from './component/Lessons';
import Lesson from './component/Lesson';
import Score from './component/Score';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" Component={Login}/>
        <Route path="/login" Component={Login}/>
        <Route path="/lessons" Component={Lessons}/>
        <Route path="/lesson" Component={Lesson}/>
        <Route path="/score" Component={Score}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
