'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _serverlessAuthentication = require('serverless-authentication');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Profile mapping function
 * @param response
 */

function mapProfile(response) {
  var overwrites = {
    email: null,
    picture: null,
    provider: 'reddit'
  };

  return new _serverlessAuthentication.Profile(Object.assign(response, overwrites));
}

var RedditProvider = function (_Provider) {
  _inherits(RedditProvider, _Provider);

  function RedditProvider() {
    _classCallCheck(this, RedditProvider);

    return _possibleConstructorReturn(this, (RedditProvider.__proto__ || Object.getPrototypeOf(RedditProvider)).apply(this, arguments));
  }

  _createClass(RedditProvider, [{
    key: 'signinHandler',


    /**
     * Signin function
     * @param scope
     * @param state
     * @param callback, returns url that will be used for redirecting to oauth provider signin page
     */
    value: function signinHandler(_ref, callback) {
      var _ref$scope = _ref.scope,
          scope = _ref$scope === undefined ? 'profile' : _ref$scope,
          _ref$duration = _ref.duration,
          duration = _ref$duration === undefined ? 'temporary' : _ref$duration,
          state = _ref.state;

      var options = Object.assign({ scope: scope, state: state }, { signin_uri: 'https://www.reddit.com/api/v1/authorize', response_type: 'code', duration: duration });

      _get(RedditProvider.prototype.__proto__ || Object.getPrototypeOf(RedditProvider.prototype), 'signin', this).call(this, options, callback);
    }

    /**
     * Callback function
     * @param event
     * @param callback, returns user profile
     */

  }, {
    key: 'callbackHandler',
    value: function callbackHandler(event, callback) {
      var options = {
        authorization_uri: 'https://www.reddit.com/api/v1/access_token',
        profile_uri: 'https://oauth.reddit.com/api/v1/me',
        profileMap: mapProfile,
        authorizationMethod: 'GET'
      };

      _get(RedditProvider.prototype.__proto__ || Object.getPrototypeOf(RedditProvider.prototype), 'callback', this).call(this, event, options, { authorization: { grant_type: 'authorization_code' } }, callback);
    }
  }]);

  return RedditProvider;
}(_serverlessAuthentication.Provider);

var signinHandler = function signinHandler(config, options, callback) {
  return new RedditProvider(config).signinHandler(options, callback);
};

var callbackHandler = function callbackHandler(event, config, callback) {
  return new RedditProvider(config).callbackHandler(event, callback);
};

exports.signinHandler = signinHandler;
exports.signin = signinHandler; // old syntax, remove later
exports.callbackHandler = callbackHandler;
exports.callback = callbackHandler; // old syntax, remove later