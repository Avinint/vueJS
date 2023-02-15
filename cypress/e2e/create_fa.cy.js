describe('template spec', () => {
  it('passes', () => {
    cy.viewport(1920, 1080)
    let salt = Date.now()
    cy.login('test@test.com', 'test');
    cy.get("[href='/fitarena'").click()
    cy.get("#TaddFitArena").click()
    cy.get('#TfaSelectCollectivite').select(0)
    cy.get('#TfaNom').type('T'+salt)
    cy.get('#TfaAdresse').type('15 rue camille de rochetaille')
    cy.wait(500)
    cy.get('#TfaSelectAdresse').select(0)
    cy.get('#TfaPostalCode').should('have.value', 42000)
    cy.get('#TfaCity').should('have.value', 'Saint-Étienne')
    cy.get("[test='TconfirmModal']").click()
  })
})
