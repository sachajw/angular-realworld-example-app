/// <reference types="cypress"/>

describe('Test with backend', () => {

  beforeEach('login to the app', () => {
    cy.server()
    //adding fixtures
    cy.route('GET', '**/tags','fixture:tags.json')
    cy.loginToApplication()
  })

//  it('should log in', () => {
//    cy.log('Yeeeey we logged in!')
//  })

  it('verify correct request and respons', () => {

    cy.server()
    //listens on all api calls and alias is postArticles
    cy.route('POST','**/articles').as('postArticles')

    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is a title')
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('This is the body of the Article')
    cy.contains('Publish Article').click()

    //waiting on the response from the object
    //you must use @
    cy.wait('@postArticles')
    cy.get('@postArticles').then(xhr => {
      console.log(xhr)
      expect(xhr.status).to.equal(200)
      expect(xhr.request.body.article.body).to.equal('This is the body of the Article')
      expect(xhr.response.body.article.description).to.equal('This is a description')
    })

  })

  it('should give the tags with the routing object', () => {
    cy.get('.tag-list')
    .should('contain','cypress')
    .and('contain','automation')
    .and('contain','testing')
  })

  it('verify global feed likes count', () => {

    cy.route('GET', '**/articles/feed*','{"articles":[],"articlesCount":0}')
    cy.route('GET', '**/articles*','fixture:articles2.json')

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then(listOfbuttons => {
      expect(listOfbuttons[0]).to.contain('1')
      expect(listOfbuttons[0]).to.contain('5')

    })

    cy.fixture('articles').then(file => {
      const articleLink = file.articles[1].slug
      cy.route('POST','**/articles/'+articleLink+'/favorite', file)
    })

    cy.get('app-article-list button')
    .eq(1)
    .click()
    .should('contain','6')

  })

})
