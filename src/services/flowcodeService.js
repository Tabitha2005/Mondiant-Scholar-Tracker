const axios = require('axios');

// Thin wrapper around the Flowcode Developer API.
// Flowcode uses OAuth2 client-credentials auth: exchange CLIENT_ID +
// CLIENT_SECRET for a short-lived access token, then attach it as a
// Bearer token on every subsequent call.
//
// The exact token endpoint path isn't confirmed yet, so getAccessToken()
// tries several common candidate paths in order and reports which one
// (if any) actually worked. Once you find the right one, set it as
// FLOWCODE_AUTH_URL in .env directly and this list becomes unnecessary —
// but until then, this saves you from manually editing .env and
// restarting the server for every guess.

const BASE = process.env.FLOWCODE_API_BASE_URL || 'https://gateway.flowcode.com';

const CANDIDATE_AUTH_PATHS = [
  process.env.FLOWCODE_AUTH_URL, // whatever is explicitly set in .env, tried first
  `${BASE}/oauth/token`,
  `${BASE}/v1/oauth/token`,
  `${BASE}/oauth2/token`,
  `${BASE}/auth/token`,
  `${BASE}/v1/auth/token`,
  `${BASE}/api/oauth/token`,
].filter(Boolean);

let cachedToken = null;
let tokenExpiresAt = 0;
let workingAuthUrl = null;

async function tryAuthPath(url) {
  // Attempt 1: credentials in the request body (client_secret_post style)
  try {
    const res = await axios.post(url, {
      grant_type: 'client_credentials',
      client_id: process.env.FLOWCODE_CLIENT_ID,
      client_secret: process.env.FLOWCODE_CLIENT_SECRET,
    });
    return { success: true, data: res.data, method: 'body' };
  } catch (err) {
    const status = err.response?.status;
    // Attempt 2: same URL, but Basic Auth header instead (client_secret_basic style)
    if (status === 401 || status === 400) {
      try {
        const res = await axios.post(
          url,
          { grant_type: 'client_credentials' },
          {
            auth: {
              username: process.env.FLOWCODE_CLIENT_ID,
              password: process.env.FLOWCODE_CLIENT_SECRET,
            },
          }
        );
        return { success: true, data: res.data, method: 'basic-auth' };
      } catch (err2) {
        return { success: false, status: err2.response?.status || status, url };
      }
    }
    return { success: false, status, url };
  }
}

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 30000) {
    return cachedToken;
  }

  const attempts = [];

  for (const url of CANDIDATE_AUTH_PATHS) {
    const result = await tryAuthPath(url);
    attempts.push({ url, status: result.success ? 200 : result.status });

    if (result.success) {
      workingAuthUrl = url;
      cachedToken = result.data.access_token;
      tokenExpiresAt = now + (result.data.expires_in || 3600) * 1000;
      console.log(`Flowcode auth succeeded at: ${url} (via ${result.method})`);
      console.log(`>>> Set FLOWCODE_AUTH_URL=${url} in your .env to skip this search next time.`);
      return cachedToken;
    }
  }

  const summary = attempts.map((a) => `  ${a.url} -> ${a.status}`).join('\n');
  throw new Error(
    `Could not authenticate with Flowcode. Tried these paths:\n${summary}\n` +
    `None worked. Check the Developer Portal docs for the exact token endpoint.`
  );
}

async function client() {
  const token = await getAccessToken();
  return axios.create({
    baseURL: BASE,
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Org-Id': process.env.FLOWCODE_ORG_ID,
      'X-Workspace-Id': process.env.FLOWCODE_WORKSPACE_ID,
      'Content-Type': 'application/json',
    },
  });
}

async function createFlowcode({ name, destinationUrl }) {
  const http = await client();
  const response = await http.post('/flowcodes', {
    name,
    destination: destinationUrl,
    type: 'url',
    orgId: process.env.FLOWCODE_ORG_ID,
    workspaceId: process.env.FLOWCODE_WORKSPACE_ID,
  });
  return response.data;
}

async function getFlowcodeAnalytics(flowcodeId) {
  const http = await client();
  const response = await http.get(`/flowcodes/${flowcodeId}/analytics`);
  return response.data;
}

async function listFlowcodes() {
  const http = await client();
  const response = await http.get('/flowcodes', {
    params: {
      orgId: process.env.FLOWCODE_ORG_ID,
      workspaceId: process.env.FLOWCODE_WORKSPACE_ID,
    },
  });
  return response.data;
}

module.exports = { createFlowcode, getFlowcodeAnalytics, listFlowcodes };
