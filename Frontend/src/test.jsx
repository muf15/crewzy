import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const SimpleTest = () => {
  return (
    <div>
      <h1>Simple Test Component</h1>
      <p>Testing React Router DOM</p>
    </div>
  );
};

const TestApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimpleTest />} />
      </Routes>
    </Router>
  );
};

export default TestApp;
