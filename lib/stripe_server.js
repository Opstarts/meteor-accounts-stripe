Stripe = {};

Oauth.registerService('stripe', 2, null, function(query) {

    var response    = getTokenResponse(query);
    var accessToken = response.accessToken;

    var serviceData = {
        accessToken: accessToken,
        expiresAt: (+new Date) + (1000 * response.expiresIn)
    };

    var whiteListed = ['first_name', 'last_name'];

    var fields = _.pick(identity, whitelisted);
    _.extend(serviceData, fields);

    serviceData.id = serviceData.uid;
    delete serviceData.uid;

    return {
        serviceData: serviceData,
        options: {
            profile: {
                profile: fields
            }
        }
    };
});

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: 'stripe'});
    if (!config) {
        throw new ServiceConfiguration.ConfigError("Service not configured");
    }

    var responseContent;

    try {
        // Request an access token
        responseContent = HTTP.post(
            "https://connect.stripe.com/oauth/token", {
                params: {
                    client_id:     config.appId,
                    client_secret: config.secret,
                    code:          query.code,
                    grant_type: 	'authorization_code',
                    redirect_uri: Meteor.absoluteUrl("_oauth/stripe?close")
                }
            }).content;

    } catch (err) {
        throw _.extend(new Error("Failed to complete OAuth handshake with stripe. " + err.message),
            {response: err.response});
    }
    // Success!  Extract the vkontakte access token and expiration
    // time from the response
    var parsedResponse = JSON.parse(responseContent);

    var fbAccessToken = parsedResponse.access_token;
    var fbExpires = parsedResponse.expires_in;

    if (!fbAccessToken) {
        throw new Error("Failed to complete OAuth handshake with stripe " +
            "-- can't find access token in HTTP response. " + responseContent);
    }
    return {
        accessToken: fbAccessToken,
        expiresIn: fbExpires
    };
};


Stripe.retrieveCredential = function(credentialToken) {
    return Oauth.retrieveCredential(credentialToken);
};