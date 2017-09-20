'use strict';

const config = require('serverless-authentication').config;
const auth = require('../lib');
const nock = require('nock');
const expect = require('chai').expect;

describe('Reddit authentication', () => {
  describe('Signin', () => {
    it('test signin with default params', () => {
      const providerConfig = config('reddit');
      auth.signinHandler(providerConfig, {}, (err, data) => {
        expect(err).to.be.null;
        expect(data.url).to.equal('https://www.reddit.com/api/v1/authorize?client_id=reddit-mock-id&redirect_uri=https://api-id.execute-api.eu-west-1.amazonaws.com/dev/callback/reddit&response_type=code&scope=identity');
      });
    });

    it('tests signin with scope and state params', () => {
      const providerConfig = config('reddit');
      auth.signinHandler(providerConfig, {scope: 'identity', state: '123456'}, (err, data) => {
        expect(err).to.be.null;
        expect(data.url).to.equal('https://www.reddit.com/api/v1/authorize?client_id=reddit-mock-id&redirect_uri=https://api-id.execute-api.eu-west-1.amazonaws.com/dev/callback/reddit&response_type=code&scope=identity&state=123456');
      });
    });

    it('test old signin with default params', () => {
      const providerConfig = config('reddit');
      auth.signin(providerConfig, {}, (err, data) => {
        expect(err).to.be.null;
        expect(data.url).to.equal('https://www.reddit.com/api/v1/authorize?client_id=reddit-mock-id&redirect_uri=https://api-id.execute-api.eu-west-1.amazonaws.com/dev/callback/reddit&response_type=code&scope=identity');
      });
    });
  });

  describe('Callback', () => {
    before(() => {
      const providerConfig = config('reddit');
      nock('https://www.reddit.com')
        .post('/api/v1/access_token')
        .query({
          client_id: providerConfig.id,
          redirect_uri: providerConfig.redirect_uri,
          client_secret: providerConfig.secret,
          code: 'code'
        })
        .reply(200, {
          access_token: 'access-token-123'
        });

      nock('https://oauth.reddit.com')
        .get('/api/v1/me')
        .query({access_token: 'access-token-123'})
        .reply(200, {
          id: 'user-id-1',
          name: 'Eetu Tuomala'
        });
    });
    it('should return profile', (done) => {
      const providerConfig = config('reddit');
      auth.callbackHandler({code: 'code', state: 'state'}, providerConfig, (err, profile) => {
        expect(profile.id).to.equal('user-id-1');
        expect(profile.name).to.equal('Eetu Tuomala');
        expect(profile.email).to.equal(null);
        expect(profile.picture).to.equal(null);
        expect(profile.provider).to.equal('reddit');
        done(err);
      })
    });
  });

  describe('Old callback', () => {
    before(() => {
      const providerConfig = config('reddit');
      nock('https://www.reddit.com')
      .post('/api/v1/access_token')
        .query({
          client_id: providerConfig.id,
          redirect_uri: providerConfig.redirect_uri,
          client_secret: providerConfig.secret,
          code: 'code'
        })
        .reply(200, {
          access_token: 'access-token-123'
        });

      nock('https://oauth.reddit.com')
        .get('/api/v1/me')
        .query({access_token: 'access-token-123'})
        .reply(200, {
          id: 'user-id-1',
          name: 'Eetu Tuomala'
        });
    });
    it('should return profile', (done) => {
      const providerConfig = config('reddit');
      auth.callback({code: 'code', state: 'state'}, providerConfig, (err, profile) => {
        expect(profile.id).to.equal('user-id-1');
        expect(profile.name).to.equal('Eetu Tuomala');
        expect(profile.email).to.equal(null);
        expect(profile.picture).to.equal(null);
        expect(profile.provider).to.equal('reddit');
        done(err);
      })
    });
  });
});