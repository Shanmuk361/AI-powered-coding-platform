import { useState } from 'react';

const NameInputComponent = () => {
  const [name, setName] = useState(''); // State to hold the name
  const [displayName, setDisplayName] = useState(''); // State to display the entered name

  // Function to handle the button click
  const handleButtonClick = () => {
    setDisplayName(name); // Update the display name
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Enter Your Name</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)} // Update the name state
        placeholder="Enter your name"
        style={{ padding: '10px', fontSize: '16px', width: '200px' }}
      />
      <button
        onClick={handleButtonClick}
        style={{ padding: '10px 20px', marginLeft: '10px', fontSize: '16px', cursor: 'pointer' }}
      >
        Enter
      </button>

      {displayName && (
        <h3 style={{ marginTop: '20px' }}>Hello, {displayName}!</h3>
      )}
    </div>
  );
};

export default NameInputComponent;