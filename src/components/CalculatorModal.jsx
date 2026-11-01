import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';

export default function CalculatorModal({ isOpen, onClose }) {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState(null);
  const [operation, setOperation] = useState(null);
  const [resetNext, setResetNext] = useState(false);

  if (!isOpen) return null;

  const handleNum = (num) => {
    if (display === '0' || resetNext) {
      setDisplay(String(num));
      setResetNext(false);
    } else {
      if (display.length < 12) {
        setDisplay(display + num);
      }
    }
  };

  const handleDot = () => {
    if (resetNext) {
      setDisplay('0.');
      setResetNext(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOp = (op) => {
    setPrevVal(parseFloat(display));
    setOperation(op);
    setResetNext(true);
  };

  const handleEqual = () => {
    if (operation === null || prevVal === null) return;
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = prevVal + current;
        break;
      case '-':
        result = prevVal - current;
        break;
      case '×':
        result = prevVal * current;
        break;
      case '÷':
        result = current === 0 ? 'Error' : prevVal / current;
        break;
      default:
        return;
    }

    if (typeof result === 'number') {
      result = Math.round(result * 100000) / 100000;
    }
    setDisplay(String(result));
    setPrevVal(null);
    setOperation(null);
    setResetNext(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
    setResetNext(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  return (
    <div className="calc-modal no-print animate-fade-in" id="cbt-floating-calculator">
      <div className="calc-header">
        <span>Standard CBT Calculator</span>
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>

      <div className="calc-screen">{display}</div>

      <div className="calc-pad">
        <button className="calc-btn op" onClick={handleClear}>C</button>
        <button className="calc-btn op" onClick={handleBackspace}><Delete size={15} style={{ display: 'inline' }} /></button>
        <button className="calc-btn op" onClick={() => handleOp('÷')}>÷</button>
        <button className="calc-btn op" onClick={() => handleOp('×')}>×</button>

        <button className="calc-btn" onClick={() => handleNum('7')}>7</button>
        <button className="calc-btn" onClick={() => handleNum('8')}>8</button>
        <button className="calc-btn" onClick={() => handleNum('9')}>9</button>
        <button className="calc-btn op" onClick={() => handleOp('-')}>-</button>

        <button className="calc-btn" onClick={() => handleNum('4')}>4</button>
        <button className="calc-btn" onClick={() => handleNum('5')}>5</button>
        <button className="calc-btn" onClick={() => handleNum('6')}>6</button>
        <button className="calc-btn op" onClick={() => handleOp('+')}>+</button>

        <button className="calc-btn" onClick={() => handleNum('1')}>1</button>
        <button className="calc-btn" onClick={() => handleNum('2')}>2</button>
        <button className="calc-btn" onClick={() => handleNum('3')}>3</button>
        <button className="calc-btn" onClick={handleDot}>.</button>

        <button className="calc-btn" onClick={() => handleNum('0')} style={{ gridColumn: 'span 2' }}>0</button>
        <button className="calc-btn equal" onClick={handleEqual}>=</button>
      </div>
    </div>
  );
}
