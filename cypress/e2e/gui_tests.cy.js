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
      .should('be.visible')  
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
    .should('be.visible')  
    .invoke('text')
    .then((text) => {
      const trimmedText = text.trim();  // Remove espaços extras no início e no fim
      expect(trimmedText).to.equal('Epic sadface: Sorry, this user has been locked out.');
    });
});

it('Adicionando e Confirmando Produto na listagem do Carrinho', () => {
  cy.loginSite()
  cy.get('.inventory_list .inventory_item')  // Seleciona todos os itens da lista
    .first()  // Pega o primeiro item
    .find('button')  // Encontra o botão dentro do primeiro item
    .click();
  cy.get('.shopping_cart_badge')  // Seleciona o badge do carrinho de compras
    .click()
  cy.get('.cart_item')  // Seleciona todos os itens no carrinho
    .should('have.length', 1);  // Verifica se o número de itens é 1
});

it('Removendo Produto na listagem do Carrinho', () => {
  cy.loginSite()
  cy.get('.inventory_list .inventory_item')  // Seleciona todos os itens da lista
    .first()  // Pega o primeiro item
    .find('button')  // Encontra o botão dentro do primeiro item
    .click();
  cy.get('.shopping_cart_badge')  // Seleciona o badge do carrinho de compras
    .click()
    cy.get('.cart_item')  // Seleciona todos os itens no carrinho
    .first()  // Seleciona o primeiro item
    .find('button.btn_secondary')  // Encontra o botão de remoção (pode ser 'btn_secondary', que é o estilo do botão de remoção)
    .click();  // Clica no botão de remoção
  cy.get('.cart_item')  // Verifica todos os itens no carrinho
    .should('have.length', 0);  // Verifica se o carrinho está vazio
});

});