describe('Account activation', () => {
  beforeEach(() => {
    cy.intercept('GET', '/constraints*', {
      statusCode: 200,
      fixture: 'constraints_response.json',
    }).as('constraints');
    cy.intercept('GET', '/user*', {
      statusCode: 401,
    }).as('user');
    cy.intercept('GET', '/refresh-token', {
      statusCode: 401,
    }).as('refreshToken');
    cy.intercept('GET', '/logout*', {
      statusCode: 200,
    }).as('logout');
  });

  it('Should redirect to /activate/success after a successful account activation.', () => {
    const token = 'activation_token';

    cy.intercept('POST', `/activate/${token}*`, {
      statusCode: 200,
      body: {},
    }).as('activate');

    cy.visit(`/activate/${token}?type=invitation`);
    cy.wait(['@constraints', '@user', '@activate']);

    cy.location('pathname').should('equal', '/activate/success');
    cy.location('search').should('equal', '?type=invitation');
  });

  it('Should redirect to /activate/error after a failed account activation.', () => {
    const token = 'not_existing_token';

    cy.intercept('POST', `/activate/${token}*`, {
      statusCode: 404,
      body: {},
    }).as('activate');

    cy.visit(`/activate/${token}?type=invitation`);
    cy.wait(['@constraints', '@user', '@activate']);

    cy.location('pathname').should('equal', '/activate/error');
    cy.location('search').should('equal', '?type=invitation');
  });
});
