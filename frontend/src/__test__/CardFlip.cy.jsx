// cypress/component/Header.cy.jsx

import React from 'react';
import CardFlip from '../../src/components/CardFlip'; // 确保路径正确
import '../../src/App.css'

describe('<CardFlip />', () => {
  it('renders', () => {
    cy.mount(<CardFlip />)
    cy.viewport(1920, 1080); // 设置视口尺寸
    cy.contains('The most comprehensive course materials at UNSW');
    cy.contains('The most project information at UNSW');
    cy.contains('The widest range of group members at UNSW');
  });
});
