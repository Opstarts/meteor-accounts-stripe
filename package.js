/* global Package */

Package.describe({
  summary: 'Login service for Stripe accounts',
  version: '0.1.5',
  name: 'billyvg:accounts-stripe',
  git: 'https://github.com/Opstarts/meteor-accounts-stripe.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');

  api.use('underscore', 'server');
  api.use('ecmascript', 'server');
  api.use('accounts-base', ['client', 'server']);
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.use('service-configuration', ['client', 'server']);
  api.use('billyvg:stripe-oauth@0.1.5', ['client', 'server']);

  api.use('http', ['server']);

  api.addFiles('stripe.js');
  api.addFiles('stripe_common.js', ['client', 'server']);
});
