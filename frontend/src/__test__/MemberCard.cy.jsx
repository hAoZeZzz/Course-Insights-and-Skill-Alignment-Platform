import React from 'react'
import MemberCard from '../components/MemberCard'

describe('<MemberCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MemberCard />)
    cy.contains('Loading...')
  })
})