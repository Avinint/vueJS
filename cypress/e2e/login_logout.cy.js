describe('template spec', () => {
  it('passes', () => {
    let salt = + Date.now()
    cy.login('test@test.com', 'test')
    cy.get("[test='Tlogout']").click()
    cy.get("#password").should('be.visible')
  })
})
