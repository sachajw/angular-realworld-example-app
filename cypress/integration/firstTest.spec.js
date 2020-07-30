/// <reference types="cypress"/>

describe('Test with backend', () => {

  beforeEach('login to the app', () => {
    cy.loginToApplication()
  })

  it('should log in', () => {
    cy.log('Yeeeey we logged in!')
  })

  it('verify correct request and respons', () => {

    cy.server()
    //listens on all api calls and alias is postArticles
    cy.route('POST','**/articles').as('postArticles')

    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is a title')
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('This is the body of the article')
    cy.contains('Publish Article').click()

    //waiting on the response from the object
    //you must use @
    cy.wait('@postArticles')
    cy.get('@postArticles').then(xhr => {
      console.log(xhr)
    })

  })

})
