import React, { useEffect } from 'react';
import './Panel.css';

const Panel: React.FC = () => {
  useEffect(() => {
    // chrome.runtime.onMessage(console.log);
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log(message);
    });
  }, [])
  return (
    <div className="container">
      <h1>Dev Tools Panel 14</h1>
    </div>
  );
};

export default Panel;
