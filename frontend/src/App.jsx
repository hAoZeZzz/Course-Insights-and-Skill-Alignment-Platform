import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PageList from './components/PageList';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatRoom from './components/ChatRoom';
import './App.css';

function App () {
  return (
    <>
      <Router>
        <PageList />
        <ChatRoom />
      </Router>
    </>
  );
}

export default App;
