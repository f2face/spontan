# Spontan
Imagine you are making short-polling requests to an API endpoint, and you want to take action when certain values from the API have changed.

## Installation
### Using pnpm
```bash
pnpm install spontan
```

### Using npm
```bash
npm install spontan
```

## Example
```javascript
import { Spontan } from 'spontan';

// Pre-defined initial data
const initialState = {
    myProperty: 0,
    myOtherProperty: 0,
};

// Create Spontan instance
const spontan = new Spontan(initialState, {
    debug: true, // Enable debugging
});

// Listen to any property
spontan.onAnyChanged((property, oldValue, newValue) => {
    // This will be invoked when any property in `initialState` changes.
    console.log('Property value has changed', { property, oldValue, newValue });
});

// Listen to a specific property
spontan.onChanged('myOtherProperty', (oldValue, newValue) => {
    // This will be invoked only when `myOtherProperty` in `initialState` changes.
    console.log('myOtherProperty value has changed:', { oldValue, newValue });
});

// Run
for (let i = 1; i <= 100; i++) {
    if (i % 2 === 0) {
        spontan.setProperty('myProperty', i);
    } else {
        spontan.setProperty('myOtherProperty', i);
    }

    // Some delay
    await new Promise((resolve) => setTimeout(resolve, 5000));
}
```