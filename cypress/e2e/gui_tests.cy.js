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

  it('Adicionando mais de um Produto, Confirmando Produtos na listagem do Carrinho', () => {
    cy.loginSite()
    cy.get('.inventory_list .inventory_item')  // Seleciona todos os itens da lista
      .eq(0)  // Pega o primeiro item
      .find('button')  // Encontra o botão dentro do primeiro item
      .click();
    cy.get('.inventory_list .inventory_item')  // Seleciona todos os itens da lista
      .eq(1)  // Pega o segundo item
      .find('button')  // Encontra o botão dentro do primeiro item
      .click();
    cy.get('.inventory_list .inventory_item')  // Seleciona todos os itens da lista
      .eq(2)  // Pega o terceiro item
      .find('button')  // Encontra o botão dentro do primeiro item
      .click();
    cy.get('.shopping_cart_badge')  // Seleciona o badge do carrinho de compras
      .click()
    cy.get('.cart_item')  // Seleciona todos os itens no carrinho
      .should('have.length', 3);  // Verifica se o número de itens é o total de itens selecionados
  });

  it('Confirmando Checkout e Valor Total dos Itens Sem a Taxa de Entrega', () => {
    cy.loginSite();

    // Definir uma variável para armazenar o total
    let totalPrice = 0;

    // Seleciona os 3 primeiros itens e armazena o preço de cada um
    cy.get('.inventory_list .inventory_item')
      .eq(0)  // Pega o primeiro item
      .find('.inventory_item_price')  // Localiza o preço
      .invoke('text')  // Obtém o texto (preço)
      .then((price) => {
        const itemPrice = parseFloat(price.replace('$', '').trim());  // Remove o símbolo de $ e converte para número
        totalPrice += itemPrice;  // Soma ao total
      });

    cy.get('.inventory_list .inventory_item')
      .eq(1)  // Pega o segundo item
      .find('.inventory_item_price')  // Localiza o preço
      .invoke('text')  // Obtém o texto (preço)
      .then((price) => {
        const itemPrice = parseFloat(price.replace('$', '').trim());  // Remove o símbolo de $ e converte para número
        totalPrice += itemPrice;  // Soma ao total
      });

    cy.get('.inventory_list .inventory_item')
      .eq(2)  // Pega o terceiro item
      .find('.inventory_item_price')  // Localiza o preço
      .invoke('text')  // Obtém o texto (preço)
      .then((price) => {
        const itemPrice = parseFloat(price.replace('$', '').trim());  // Remove o símbolo de $ e converte para número
        totalPrice += itemPrice;  // Soma ao total
      });

    // Adiciona os 3 itens ao carrinho
    cy.get('.inventory_list .inventory_item')
      .eq(0)  // Pega o primeiro item
      .find('button')  // Encontra o botão "Add to cart"
      .click();

    cy.get('.inventory_list .inventory_item')
      .eq(1)  // Pega o segundo item
      .find('button')  // Encontra o botão "Add to cart"
      .click();

    cy.get('.inventory_list .inventory_item')
      .eq(2)  // Pega o terceiro item
      .find('button')  // Encontra o botão "Add to cart"
      .click();

    // Verifica se o badge do carrinho tem 3 itens
    cy.get('.shopping_cart_badge')
      .should('have.text', '3');

    // Clica no badge do carrinho para acessar a página do carrinho
    cy.get('.shopping_cart_link').click();

    // Verifica se o carrinho tem 3 itens
    cy.get('.cart_item')
      .should('have.length', 3);

    // Vai para o Checkout
    cy.get('button[id=checkout]').click()
    cy.get('input[id=first-name]').type('Teste')
    cy.get('input[id=last-name]').type('Teste')
    cy.get('input[id=postal-code]').type('99999-999')
    cy.get('input[name=continue]').click()

    // Verifica se o preço total do carrinho é igual ao total calculado
    cy.get('.summary_subtotal_label')  // Localiza o total de preço no carrinho
      .invoke('text')  // Obtém o texto (total)
      .then((totalText) => {
        const cartTotalPrice = parseFloat(totalText.replace(/[^0-9.-]+/g, '').trim());  // Remove tudo que não for número, ponto ou traço
        expect(cartTotalPrice).to.eq(totalPrice);  // Verifica se o total do carrinho é igual ao total calculado
      });
  });

  it('Confirma que o Pedido foi criado e Compra efetivada', () => {
    cy.loginSite()
    // Adiciona os 3 itens ao carrinho
    cy.get('.inventory_list .inventory_item')
      .eq(0)  // Pega o primeiro item
      .find('button')  // Encontra o botão "Add to cart"
      .click();

    cy.get('.inventory_list .inventory_item')
      .eq(1)  // Pega o segundo item
      .find('button')  // Encontra o botão "Add to cart"
      .click();

    cy.get('.inventory_list .inventory_item')
      .eq(2)  // Pega o terceiro item
      .find('button')  // Encontra o botão "Add to cart"
      .click();

    // Verifica se o badge do carrinho tem 3 itens
    cy.get('.shopping_cart_badge')
      .should('have.text', '3');

    // Clica no badge do carrinho para acessar a página do carrinho
    cy.get('.shopping_cart_link').click();

    // Verifica se o carrinho tem 3 itens
    cy.get('.cart_item')
      .should('have.length', 3);

    // Vai para o Checkout
    cy.get('button[id=checkout]').click()
    cy.get('input[id=first-name]').type('Teste')
    cy.get('input[id=last-name]').type('Teste')
    cy.get('input[id=postal-code]').type('99999-999')
    cy.get('input[name=continue]').click()

    //Finaliza a Compra
    cy.get('button[id=finish]').click()
    cy.get('.complete-header')
      .contains('Thank you for your order!')
  });

  it('Classificação de Produtos de A > Z e Z > A', () => {
    cy.loginSite()
    // Primeiro, seleciona a opção 'Name (A to Z)' no dropdown
    cy.get('select.product_sort_container')
      .select('az');
    // Em seguida, captura os nomes dos produtos após a ordenação
    cy.get('.inventory_item_name')
      .then(($products) => {
        // Obtém os nomes dos produtos em um array
        const productNames = $products.toArray().map((el) => el.innerText);

        // Cria uma cópia do array e ordena de A a Z
        const sortedNames = [...productNames].sort();

        // Verifica se os nomes dos produtos estão ordenados de A a Z
        expect(productNames).to.deep.equal(sortedNames);
      });

    // Primeiro, seleciona a opção 'Name (Z to A)' no dropdown
    cy.get('select.product_sort_container')
      .select('za');
    // Em seguida, captura os nomes dos produtos após a ordenação
    cy.get('.inventory_item_name')
      .then(($products) => {
        // Obtém os nomes dos produtos em um array
        const productNames = $products.toArray().map((el) => el.innerText);

        // Cria uma cópia do array e ordena de A a Z
        const sortedNames = [...productNames].sort().reverse();

        // Verifica se os nomes dos produtos estão ordenados de Z a A
        expect(productNames).to.deep.equal(sortedNames);
      });
  });

  it('Classificação de Produtos de low to high e high to low', () => {
    cy.loginSite()
    // Primeiro, seleciona a opção 'Price (low to high)' no dropdown
    cy.get('select.product_sort_container')
      .select('lohi');

    // Em seguida, captura os nomes dos produtos e os preços após a ordenação
    cy.get('.inventory_item')
      .then(($items) => {
        // Obtém os nomes dos produtos e os preços em arrays
        const products = $items.toArray().map((el) => {
          return {
            name: el.querySelector('.inventory_item_name').innerText,
            price: parseFloat(el.querySelector('.inventory_item_price').innerText.replace('$', '').trim())
          };
        });

        // Cria uma cópia dos produtos e ordena de baixo para cima (low to high) pelos preços
        const sortedProducts = [...products].sort((a, b) => a.price - b.price);

        // Verifica se os preços e os produtos estão ordenados de baixo para cima
        const sortedNames = sortedProducts.map(product => product.name);
        const sortedPrices = sortedProducts.map(product => product.price);

        // Obtém os nomes dos produtos e os preços atuais na página
        const currentNames = products.map(product => product.name);
        const currentPrices = products.map(product => product.price);

        // Verifica se os nomes e preços estão na mesma ordem
        expect(currentNames).to.deep.equal(sortedNames);
        expect(currentPrices).to.deep.equal(sortedPrices);
      });

    // Primeiro, seleciona a opção 'Price (high to low)' no dropdown
    cy.get('select.product_sort_container')
      .select('hilo');

    // Em seguida, captura os nomes dos produtos e os preços após a ordenação
    cy.get('.inventory_item')
      .then(($items) => {
        // Obtém os nomes dos produtos e os preços em arrays
        const products = $items.toArray().map((el) => {
          return {
            name: el.querySelector('.inventory_item_name').innerText,
            price: parseFloat(el.querySelector('.inventory_item_price').innerText.replace('$', '').trim())
          };
        });

        // Cria uma cópia dos produtos e ordena de cima para baixo (high to low) pelos preços
        const sortedProducts = [...products].sort((a, b) => b.price - a.price);

        // Verifica se os preços e os produtos estão ordenados de cima para baixo
        const sortedNames = sortedProducts.map(product => product.name);
        const sortedPrices = sortedProducts.map(product => product.price);

        // Obtém os nomes dos produtos e os preços atuais na página
        const currentNames = products.map(product => product.name);
        const currentPrices = products.map(product => product.price);

        // Verifica se os nomes e preços estão na mesma ordem
        expect(currentNames).to.deep.equal(sortedNames);
        expect(currentPrices).to.deep.equal(sortedPrices);
      });

  });

  it('Validando carregamento de imagens de Produtos', () => {
    cy.loginSite()
    cy.get('.inventory_list .inventory_item')  // Seleciona todos os itens da lista
      .first() // Seleciona o primeiro
      .find('[data-test="item-4-title-link"]')
      .click()
    cy.get('[data-test="item-sauce-labs-backpack-img"]')  // Seleciona a imagem com base no data-test
      .should('be.visible'); // Valida se a imagem está visivel
  });


});