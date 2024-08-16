// cypress/component/Header.cy.jsx

import React from 'react';
import App from '../../src/App'; // 确保路径正确
import '../../src/App.css'

describe('<App />', () => {
  it('renders', () => {
    cy.mount(<App />)
    cy.viewport(1920, 1080); // 设置视口尺寸
    cy.contains('Welcome');
  });
});
