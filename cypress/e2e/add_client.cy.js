describe('template spec', () => {
  it('passes', () => {
    let salt = Date.now()
    cy.visit('http://localhost:5173')
    cy.get('#email').type('test@test.com');
    cy.get('#password').type('test');
    cy.get('.text-white').click();
    cy.wait(1000);
    cy.get('.text-white').click();
    cy.wait(1000);
    cy.get('#Tclients').click();
    cy.get('#TaddClient').click();
    cy.get('#TclientName').type('T'+salt);
    cy.get('#TclientAdresse').type('15 rue camille rochetaille');
    cy.get('#TclientSelectAdresse').select(0)
    cy.get('#TaddRefExploit').click();
    cy.get('#TrefNom').type('1');
    cy.get('#TrefPrenom').type('2');
    cy.get('#TrefFonction').type('3');
    cy.get('#TrefTelephone').type('4');
    cy.get('#TrefMail').type('mail'+salt+'@test.fr');
    cy.get('#TaddComManager').click();
    cy.get('#TcomNom').type('6');
    cy.get('#TcomPrenom').type('7');
    cy.get('#TcomMail').type('8');
    cy.get('.text-white').click();
  })
})
