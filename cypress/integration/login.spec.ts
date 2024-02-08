describe('Login', () => {
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

  it('Should redirect to /services after a successful login.', () => {
    cy.visit('/login');
    cy.wait(['@constraints', '@user', '@refreshToken', '@logout']);

    cy.get('input[name="username"]').type('abs.user');
    cy.get('input[name="password"]').type('safety!$');

    cy.intercept('POST', '/login*', {
      statusCode: 200,
      fixture: 'login_response.json',
    }).as('login');

    cy.intercept('GET', '/has-accepted-latest-legal*', {
      statusCode: 200,
      fixture: 'has_accepted_latest_legal_success_response.json',
    }).as('hasAcceptedLatestLegal');

    cy.intercept('GET', '/user*', {
      statusCode: 200,
      fixture: 'abs_user_response.json',
    }).as('user');

    cy.get('button[type="submit"]').click().should('be.disabled');
    cy.wait(['@login', '@hasAcceptedLatestLegal', '@user']);
    cy.location('pathname').should('equal', '/services');
  });

  it('Should redirect to /legal after a successful login.', () => {
    cy.visit('/login');

    cy.get('input[name="username"]').type('abs.user');
    cy.get('input[name="password"]').type('safety!$');

    cy.intercept('POST', '/login*', {
      statusCode: 200,
      fixture: 'login_response.json',
    }).as('login');

    cy.intercept('GET', '/has-accepted-latest-legal*', {
      statusCode: 409,
      fixture: 'has_accepted_latest_legal_failure_response.json',
    }).as('hasAcceptedLatestLegal');

    cy.intercept('GET', '/user*', {
      statusCode: 200,
      fixture: 'abs_user_response.json',
    }).as('user');

    cy.get('button[type="submit"]').click().should('be.disabled');
    cy.wait(['@login', '@hasAcceptedLatestLegal', '@user']);
    cy.location('pathname').should('equal', '/legal');
  });
});
