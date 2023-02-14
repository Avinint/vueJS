describe('template spec', () => {
  it('passes', () => {
    let salt = + Date.now()
    cy.visit('http://localhost:5173')
    cy.get('#email').type('test@test.com');
    cy.get('#password').type('test');
    cy.get('.text-white').click();
    cy.wait(1000);
    cy.get('.text-white').click();
    cy.get(':nth-child(1) > .rounded-lg > .flex > .flex-1').click();
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
