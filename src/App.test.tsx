import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './app/store';

test('renders learn react link', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  expect(getByText(/learn/i)).toBeInTheDocument();
});
