Accounts.oauth.registerService('stripe');

if (Meteor.isClient) {
  Meteor.loginWithStripe = function(options, callback) {
    // support a callback without options
    if (! callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    StripeOAuth.requestCredential(options, credentialRequestCompleteCallback);
  };

  // to support package `bozhao:link-accounts`
  Meteor.linkWithStripe = function(options, callback) {
    if (!Meteor.userId()) {
      throw new Meteor.Error(402, 'Please login to an existing account before link.');
    }

    if (!callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.linkCredentialRequestCompleteHandler(callback);
    StripeOAuth.requestCredential(options, credentialRequestCompleteCallback);
  };
} else {
  Accounts.addAutopublishFields({
    forLoggedInUser: ['services.stripe'],
    forOtherUsers: [
      'services.stripe.id',
      'services.stripe.firstName',
      'services.stripe.lastName'
    ]
  });
}
