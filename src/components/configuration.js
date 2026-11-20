import React, { useState } from 'react';

const ConfigurationPopup = ({ config, setConfig, operation, setOperation }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => setIsOpen(prev => !prev);

  const handleCheckboxChange = (index) => {
    if (!Array.isArray(config)) return;

    const newConfig = [...config];
    newConfig[index] = !newConfig[index];
    setConfig(newConfig); // this will update localStorage automatically
  };

  return (
    <div>
      <button onClick={togglePopup}>Configuration</button>

      {isOpen && (
        <div style={popupStyle}>
          <div style={popupContentStyle}>
            <h3>Configuration</h3>
            <fieldset>
              <legend>Exercises</legend>
              {[
                ['multiplication', 'Multiplication'],
                ['division', 'Division'],
                ['both', 'Both (mixed)'],
              ].map(([value, label]) => (
                <label key={value} style={{ display: 'block' }}>
                  <input
                    type="radio"
                    name="operation"
                    value={value}
                    checked={operation === value}
                    onChange={() => setOperation(value)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            {config?.map((checked, index) => (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  {index + 1}
                </label>
              </div>
            ))}
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple inline styles
const popupStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const popupContentStyle = {
  color: '#000',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  minWidth: '200px'
};

export default ConfigurationPopup;
