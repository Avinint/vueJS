describe('template spec', () => {
  it('passes', () => {
    cy.viewport(1920, 1080)
    let salt = Date.now()
    cy.login('test@test.com', 'test');
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
    cy.get("[test='TconfirmModal']").click();
    cy.get('#TsearchClientName').type('T'+salt);
    cy.get("[test='TeditClient']").last().click()
    cy.get('#TclientName').clear();
    cy.get('#TclientName').type('T'+(salt+1));
    cy.get('#TclientAdresse').clear().type('15 rue camille rochetaille');
    cy.wait(2000)
    cy.get('#TclientSelectAdresse').select(0)
    cy.get("[test='TconfirmModal']").click();
    cy.get('#TsearchClientName').clear().type('T'+(salt+1));
    cy.get("[test='TdeleteClient']").first().click();
  })
})