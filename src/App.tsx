import { ChangeEvent, useState } from 'react';
import './App.css';
import { useMask } from '@quvels/use-mask';

function App() {
  const [maskedValue, setMaskedValue] = useState('');
  const [realValue, setRealValue] = useState('');

  const mask = useMask('(###) ###-####', {
    '#': /[0-9]/,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [maskedValue, realValue] = mask(event.target.value);
    setMaskedValue(maskedValue);
    setRealValue(realValue);
  };

  return (
    <div className='App'>
      <h1>useMask</h1>
      <div className='card'>
        <img src='logo.svg' alt='useMask Logo' title='useMask' />
        <input type='text' onChange={handleChange} value={maskedValue} />
        <div>
          <h2>Masked value:</h2>
          <p>" {maskedValue} "</p>
          <h2>Real value:</h2>
          <p>" {realValue} "</p>
        </div>
      </div>
    </div>
  );
}

export default App;
