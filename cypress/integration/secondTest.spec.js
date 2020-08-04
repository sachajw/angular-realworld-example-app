/// <reference types="cypress"/>

describe('Test log out', () => {
  cy.loginToApplication()

})

it('verify user can logout successfully', () => {
  cy.contains('Settings').click()
  cy.contains('Or click here to logout').click()
  cy.get('navbar-nav').should('contain', 'Sign up')
})
