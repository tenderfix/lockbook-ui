describe('User management', () => {
  beforeEach(() => {
    cy.intercept('GET', '/constraints*', {
      statusCode: 200,
      fixture: 'constraints_response.json',
    }).as('constraints');
    cy.intercept('GET', '/user*', {
      statusCode: 200,
      fixture: 'abs_admin_response.json',
    }).as('user');
    cy.intercept('GET', '/has-accepted-latest-legal*', {
      statusCode: 200,
      fixture: 'has_accepted_latest_legal_success_response.json',
    }).as('hasAcceptedLatestLegal');
  });

  it('An admin should be able to deactivate a user.', () => {
    cy.visit('/account');
    cy.wait(['@constraints', '@user', '@hasAcceptedLatestLegal']);

    cy.intercept('GET', '/companies/1/users*', {
      statusCode: 200,
      fixture: 'company_users_response.json',
    }).as('users');

    // Open the side modal to edit a user
    cy.get('#userManagement').click();
    cy.location('pathname').should('equal', '/account/user-management');
    cy.wait('@users');
    cy.get('.companyMemberCard').first().click();

    // Deactivate the user
    cy.intercept('PUT', '/users/2*', {
      statusCode: 200,
      // TODO: This is not optimal and should be outsourced into a fixture.
      body: {
        imageUrl: null,
        id: 2,
        username: 'abs.user',
        email: 'abs.user@email.de',
        roles: ['ROLE_SUPER_ADMIN'],
        enabled: false,
        salutation: null,
        firstName: 'ABS',
        lastName: 'User',
        address1: null,
        address2: null,
        postcode: null,
        city: null,
        country: null,
        phone1: '34567876543',
        phone2: null,
        fax: null,
        signature: null,
        acceptedTermsOfService: true,
        acceptedTermsOfServiceDate: '2020-03-24T16:50:50+01:00',
        acceptedAbsSafetyNewsletter: null,
        acceptedLockBookNewsletter: false,
        receivedStartupInformation: true,
        canUseDraw: true,
        createdAt: '2020-02-27T16:18:55+01:00',
        company: {
          id: 1,
          name: 'ABS Safety GmbH',
          canUseDraw: true,
        },
      },
    }).as('updateUser');
    cy.get('#disableButton').click();

    // Assert feedback and button change
    cy.get('#formSuccess').should('be.visible');
    cy.get('#enableButton').should('be.visible');
  });
});
