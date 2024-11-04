import React, { useState } from 'react';
import styled from 'styled-components';

const Drop = ({ id, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find((option) => option.value === value)?.label || placeholder;
  const handleOptionClick = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false); 
  };

  return (
    <StyledWrapper>
      <div className="select" onClick={() => setIsOpen(!isOpen)}>
        <div className="selected">
          {selectedLabel}
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        </div>
        {isOpen && (
          <div className="options">
            {options.map((option) => (
              <div
                key={option.value}
                className="option"
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  color: white;
    width:200px;
    heigth:100px;
  .select {
    cursor: pointer;
    width: fit-content;
    transition: 300ms;
    overflow: hidden;
  }

  .selected {
    background-color: #2a2f3b;
    padding: 5px;
    border-radius: 5px;
    display: flex;
    width:200px;
    heigth:100px;
    align-items: center;
    justify-content: space-between;
  }

  .arrow {
    height: 10px;
    width: 25px;
    fill: white;
    transition: 300ms;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(0deg)' : 'rotate(-90deg)')};
  }

  .options {
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    padding: 5px;
    background-color: #2a2f3b;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
  }
  
  .option {
    padding: 5px;
    cursor: pointer;
    background-color: #2a2f3b;
    border-radius: 5px;
    width: 150px;
  }

  .option:hover {
    background-color: #323741;
  }
`;

export default Drop;
