describe('template spec', () => {
  it('passes', () => {
    let salt = + Date.now()
    cy.login('test@test.com', 'test');
    cy.get('#Tusers').click();
    cy.get('#TaddUser').click();
    cy.get('#first-name-new').type('roro'+salt);
    cy.get('#last-name-new').type('toto'+salt);
    cy.get('#email-new').type('roro'+salt+'@toto.fr');
    cy.get('#identifiant-new').type('T'+ salt);
    cy.get('#portable-new').type('0697069505');
    cy.get('#password-new').type('test'+ salt);
    cy.get('.shadow > .space-x-2 > .text-white').click();
  })
})
