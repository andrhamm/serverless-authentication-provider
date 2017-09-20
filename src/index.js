'use strict';

import { Profile, Provider } from 'serverless-authentication';

/**
 * Profile mapping function
 * @param response
 */

function mapProfile(response) {
  const overwrites = {
    email: null,
    picture: null,
    provider: 'reddit'
  };

  return new Profile(Object.assign(response, overwrites));
}

class RedditProvider extends Provider {

  /**
   * Signin function
   * @param scope
   * @param state
   * @param callback, returns url that will be used for redirecting to oauth provider signin page
   */
  signinHandler({ scope = 'profile', duration = 'temporary', state }, callback) {
    const options = Object.assign(
      { scope, state },
      { signin_uri: 'https://www.reddit.com/api/v1/authorize', response_type: 'code', duration: duration }
    );

    super.signin(options, callback);
  }

  /**
   * Callback function
   * @param event
   * @param callback, returns user profile
   */
  callbackHandler(event, callback) {
    const options = {
      authorization_uri: 'https://www.reddit.com/api/v1/access_token',
      profile_uri: 'https://oauth.reddit.com/api/v1/me',
      profileMap: mapProfile,
      authorizationMethod: 'GET'
    };

    super.callback(
      event,
      options,
      { authorization: { grant_type: 'authorization_code' } },
      callback
    );
  }
}

const signinHandler = (config, options, callback) =>
  (new RedditProvider(config)).signinHandler(options, callback);

const callbackHandler = (event, config, callback) =>
  (new RedditProvider(config)).callbackHandler(event, callback);

exports.signinHandler = signinHandler;
exports.signin = signinHandler; // old syntax, remove later
exports.callbackHandler = callbackHandler;
exports.callback = callbackHandler; // old syntax, remove later
