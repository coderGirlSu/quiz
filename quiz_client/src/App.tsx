import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import Lessons from './component/Lessons';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/login" Component={Login}/>
        <Route path="/lessons" Component={Lessons}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
