/* @flow */
import ApiRequester from '../utils/api-requester';
import type {
  Tenant,
  Token,
  UUID,
  LogoutResponse,
  ListTenantsResponse,
  RequestError,
  ListUsersResponse,
  ListGroupsResponse,
  ListPoliciesResponse,
  GetTenantResponse,
  GetUserResponse
} from '../domain/types';
import Session from '../domain/Session';
import BadResponse from '../domain/BadResponse';

const DEFAULT_BACKEND_USER = 'wazo_user';
const DETAULT_EXPIRATION = 3600;

/**
 *
 * Authentification
 * @namespace auth
 * @example
 * client.auth.logIn({
 *   username: 'demo',
 *   password: 'demo',
 *   backend: 'wazo_user',
 *   expiration: '3600',
 * });
 * 
 */
export default (client: ApiRequester, baseUrl: string) => ({

/**
 *
 * Check if your token is valid.
 * @memberof auth
 * @param {String} token Wazo's Token.
 * 
 */
  checkToken(token: Token): Promise<Boolean> {
    return client.head(`${baseUrl}/token/${token}`, null, {});
  },

/**
 *
 * Retrieve your token data
 * @memberof auth
 * @param {String} token Wazo's Token.
 *
 */
  authenticate(token: Token): Promise<Session | BadResponse> {
    return client
      .get(`${baseUrl}/token/${token}`, null, {})
      .then(ApiRequester.parseBadResponse(response => Session.parse(response)));
  },

/**
 *
 * @memberof auth
 * @param {Object} options
 * @param {String} options.backend Wazo's backend
 * @param {String} options.expiration Expiration of your token
 * @param {String} options.username Expiration of your token
 * @param {String} options.password Expiration of your token
 *
 */
  logIn(params: Object = {}): Promise<Session | BadResponse> {
    const body = {
      backend: params.backend || DEFAULT_BACKEND_USER,
      expiration: params.expiration || DETAULT_EXPIRATION
    };
    const headers = {
      Authorization: `Basic ${ApiRequester.base64Encode(`${params.username}:${params.password}`)}`,
      'Content-Type': 'application/json'
    };

    return client
      .post(`${baseUrl}/token`, body, headers)
      .then(ApiRequester.parseBadResponse(response => Session.parse(response)));
  },

/**
 *
 * @memberof auth
 * @param {String} token Wazo's token
 *
 */
  logOut(token: Token): Promise<LogoutResponse | BadResponse> {
    return client.delete(`${baseUrl}/token/${token}`, null, {}, ApiRequester.successResponseParser);
  },

/**
 *
 * @memberof auth
 * @param {String} token Wazo's token
 * @param {String} userUuid UUID of user
 * @param {String} oldPassword Old password
 * @param {String} newPassword New password
 *
 */
  updatePassword(token: Token, userUuid: UUID, oldPassword: string, newPassword: string): Promise<Boolean> {
    const body = {
      new_password: newPassword,
      old_password: oldPassword
    };

    return client.put(`${baseUrl}/users/${userUuid}/password`, body, token, ApiRequester.successResponseParser);
  },

/**
 *
 * @memberof auth
 * @param {String} token Wazo's token
 * @param {String} userUuid UUID of user
 *
 */
  sendDeviceToken(token: Token, userUuid: UUID, deviceToken: string) {
    const body = {
      token: deviceToken
    };

    return client.post(`${baseUrl}/users/${userUuid}/external/mobile`, body, token);
  },

/**
 *
 * @memberof auth
 * @param {String} token Wazo's token
 * @param {String} userUuid UUID of user
 *
 */
  removeDeviceToken(token: Token, userUuid: UUID) {
    return client.delete(`${baseUrl}/users/${userUuid}/external/mobile`, null, token);
  },

/**
 *
 * @memberof auth
 * @param {String} token Wazo's token
 * @param {String} userUuid UUID of user
 *
 */
  getUser(token: Token, userUuid: UUID): Promise<GetUserResponse> {
    return client.get(`${baseUrl}/users/${userUuid}`, null, token);
  },

/**
 *
 * @memberof auth
 * @param {String} token Wazo's token
 *
 */
  listTenants(token: Token): Promise<ListTenantsResponse> {
    return client.get(`${baseUrl}/tenants`, null, token);
  },

/**
 *
 * @memberof auth
 * @param {String} token Wazo's token
 * @param {String} tenantUuid UUID of tenant
 *
 */
  getTenant(token: Token, tenantUuid: UUID): Promise<GetTenantResponse> {
    return client.get(`${baseUrl}/tenants/${tenantUuid}`, null, token);
  },

/**
 *
 * @memberof auth
 * @param {String} token Wazo's token
 * @param {String} name Name of tenant
 *
 */
  createTenant(token: Token, name: string): Promise<Tenant | RequestError> {
    return client.post(`${baseUrl}/tenants`, { name }, token);
  },

/**
 *
 * @memberof auth
 * @param {String} token Wazo's token
 * @param {String} uuid UUID of tenant
 *
 */
  deleteTenant(token: Token, uuid: UUID): Promise<Boolean | RequestError> {
    return client.delete(`${baseUrl}/tenants/${uuid}`, null, token);
  },

/**
 *
 * @memberof auth
 * @param {String} token Wazo's token
 *
 */
  listUsers(token: Token): Promise<ListUsersResponse> {
    return client.get(`${baseUrl}/users`, 'get', null, token);
  },

/**
 *
 * @memberof auth
 * @param {String} token Wazo's token
 *
 */
  listGroups(token: Token): Promise<ListGroupsResponse> {
    return client.get(`${baseUrl}/groups`, null, token);
  },

/**
 *
 * @memberof auth
 * @param {String} token Wazo's token
 *
 */
  listPolicies(token: Token): Promise<ListPoliciesResponse> {
    return client.get(`${baseUrl}/policies`, null, token);
  }
});
