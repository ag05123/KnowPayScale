import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import SalaryCard from './components/SalaryCard';

console.log("BKL Content Script Loaded!");

// 1. Find the panel on the right side of the LinkedIn profile
const rightPanel = document.querySelector('.scaffold-layout__aside');

if (rightPanel) {
  // 2. Create a new div for our app
  const appContainer = document.createElement('div');
  appContainer.id = 'bkl-root';
  
  // 3. Inject our div at the top of the right panel
  rightPanel.prepend(appContainer);

  // 4. Mount our React App into that div
  const root = createRoot(appContainer);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <SalaryCard />
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("BKL: Could not find LinkedIn right panel to inject into.");
}