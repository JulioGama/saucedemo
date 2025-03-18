describe('Site', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
  });
  it('Confirmação de Carregamento do Site', () => {
    cy.title().should('be.equal', 'Swag Labs')
  })

it('Login com Sucesso e Carregamento da HomePage', () => {
    cy.get('#user-name').type('standard_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()
    cy.get('#inventory_container').should('be.visible')
  });

it('Username Inválido', () => {
    cy.get('#user-name').type('incorret_username')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()
    cy.get('.error-message-container h3')
      .invoke('text')
      .then((text) => {
        const trimmedText = text.trim();  // Remove espaços extras no início e no fim
        expect(trimmedText).to.equal('Epic sadface: Username and password do not match any user in this service');
      });
    });
  
it('Password Inválido', () => {
    cy.get('#user-name').type('standard_user')
    cy.get('#password').type('incorret_pass')
    cy.get('#login-button').click()
    cy.get('.error-message-container h3')
      .invoke('text')
      .then((text) => {
        const trimmedText = text.trim();  // Remove espaços extras no início e no fim
        expect(trimmedText).to.equal('Epic sadface: Username and password do not match any user in this service');
      });
});

it('Usuário Bloqueado', () => {
  cy.get('#user-name').type('locked_out_user')
  cy.get('#password').type('secret_sauce')
  cy.get('#login-button').click()
  cy.get('.error-message-container h3')
    .invoke('text')
    .then((text) => {
      const trimmedText = text.trim();  // Remove espaços extras no início e no fim
      expect(trimmedText).to.equal('Epic sadface: Sorry, this user has been locked out.');
    });
});

});