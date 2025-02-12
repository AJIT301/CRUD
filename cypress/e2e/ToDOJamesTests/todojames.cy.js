//cy.visit()
it('Visit site', () => {
    cy.visit('https://todolist.james.am/#/');



    cy.get('input.new-todo').type('1 uzduotis{enter}')
});
