Cypress.Commands.add('loginSite', () => {
    const username = Cypress.env('username');
    const password = Cypress.env('password'); 

    cy.visit('https://www.saucedemo.com/');  // A URL do seu site de login
    cy.get('#user-name').type(username);  // Seletores de campos de input
    cy.get('#password').type(password);  // Digita a senha
    cy.get('#login-button').click();  // Clica no botão de login
  });