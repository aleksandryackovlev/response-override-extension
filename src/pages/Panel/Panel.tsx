import React, { useEffect } from 'react';

const Panel: React.FC = () => {
  useEffect(() => {
    // chrome.runtime.onMessage(console.log);
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log(message);
    });
  }, [])
  return (
    <div className="text-sky-900">
      <h1>Dev Tools Panel 14</h1>
    </div>
  );
};

export default Panel;
