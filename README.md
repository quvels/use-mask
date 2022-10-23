# useMask

## Install

```sh
npm install @quvels/use-mask
```

## Quick start

```typescript
import { ChangeEvent, useState } from 'react';
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
```
**useMask**
```typescript
useMask(regex: string, patterns?: Patterns) => (string) => [string, string]
```
| Props      | Description                                          |
| :----:     | :------------                                        |
| regex      | A string value with a regex pattern used for masking |
| patterns?  | A pattern configuration                              |

***Return***
```typescript
(string) => [string, string]
```
A function that recevies a string and returns a tuple that the first value is the "masked value" and the second is the "real value"

**Tokens**

| Token  | Description                          |
| :----: | :------------                        |
| *      | zero or more                         |
| {n}    | n times                              |
| {l, m} | at least l times and maximum m times |

### Examples

**Phone number**
```typescript
useMask('(###) ###-####', {
    '#': /[0-9]/,
});
```

**Phone number with country code**
```typescript
useMask('+#{1,3} (###) ###-####', {
    '#': /[0-9]/,
});
```

**Card number**
```typescript
useMask('####-####-####-####', {
    '#': /[0-9]/,
});
```

## Development

**Installation**

```sh
npm run install
```

**Running demo**

```sh
npm run demo
```

**Running unit tests**

```sh
npm run test
```
