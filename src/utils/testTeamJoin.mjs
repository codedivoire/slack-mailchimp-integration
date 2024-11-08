/* eslint-disable @typescript-eslint/no-unused-vars */
// testTeamJoin.mjs
import { exec } from 'child_process';
import crypto from 'crypto'; // Import crypto for signing

// Get command-line arguments
const args = process.argv.slice(2);
const tokenArg = args.find((arg) => arg.startsWith('--token='));
const urlArg = args.find((arg) => arg.startsWith('--requestUrl='));
const secretArg = args.find((arg) => arg.startsWith('--signingSecret=')); // New parameter for signing secret

if (!tokenArg || !urlArg || !secretArg) {
  console.error(
    'Usage: npm run test -- --token=your-verification-token --requestUrl=https://your-ngrok-url/slack/events --signingSecret=your-signing-secret'
  );
  process.exit(1);
}

const token = tokenArg.split('=')[1];
const requestUrl = urlArg.split('=')[1];
const signingSecret = secretArg.split('=')[1]; // Extract signing secret

// Create a timestamp for the signature
const timestamp = Math.floor(Date.now() / 1000);

// Construct the payload
const payload = {
  token: token,
  team_id: 'T123456',
  api_app_id: 'A123456',
  event: {
    type: 'team_join',
    user: {
      id: 'U123456',
      team_id: 'T123456',
      name: 'newuser',
      real_name: 'New User',
      profile: {
        email: 'newuser@example.com',
      },
    },
  },
  type: 'event_callback',
  event_id: 'Ev123456',
  event_time: 1234567890,
  authed_users: ['U123456'],
};

const fullPayload = {
  type: 'team_join',
  user: {
    id: 'U08012CEX3N',
    team_id: 'T6AGCZRPW',
    name: 'Mams',
    deleted: false,
    color: '235e5b',
    real_name: 'Mams Enok',
    tz: 'America/New_York',
    tz_label: 'Eastern Standard Time',
    tz_offset: -18000,
    profile: {
      title: '',
      phone: '',
      skype: '',
      real_name: 'Mams Enok',
      real_name_normalized: 'Mams Enok',
      display_name: 'Mams Enok',
      display_name_normalized: 'Mams Enok',
      fields: {},
      status_text: '',
      status_emoji: '',
      status_emoji_display_info: [],
      status_expiration: 0,
      avatar_hash: 'g5dd3dfe29e8',
      first_name: 'Mams',
      last_name: 'Enok',
      image_24:
        'https://secure.gravatar.com/avatar/5dd3dfe29e86eb1d97d25e260f46b56c.jpg?s=24&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0010-24.png',
      image_32:
        'https://secure.gravatar.com/avatar/5dd3dfe29e86eb1d97d25e260f46b56c.jpg?s=32&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0010-32.png',
      image_48:
        'https://secure.gravatar.com/avatar/5dd3dfe29e86eb1d97d25e260f46b56c.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0010-48.png',
      image_72:
        'https://secure.gravatar.com/avatar/5dd3dfe29e86eb1d97d25e260f46b56c.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0010-72.png',
      image_192:
        'https://secure.gravatar.com/avatar/5dd3dfe29e86eb1d97d25e260f46b56c.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0010-192.png',
      image_512:
        'https://secure.gravatar.com/avatar/5dd3dfe29e86eb1d97d25e260f46b56c.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0010-512.png',
      status_text_canonical: '',
      team: 'T6AGCMRPW',
    },
    is_admin: false,
    is_owner: false,
    is_primary_owner: false,
    is_restricted: false,
    is_ultra_restricted: false,
    is_bot: false,
    is_app_user: false,
    updated: 1731420690,
    is_email_confirmed: true,
    who_can_share_contact_card: 'EVERYONE',
    presence: 'away',
  },
  cache_ts: 1731020690,
  event_ts: '1731020690.029400',
};

const userInfoResponse = {
  ok: true,
  user: {
    id: 'U085C0XUWJ5',
    team_id: 'T6BGQMRPW',
    name: 'Mams231',
    deleted: false,
    color: '73769d',
    real_name: 'Mams Kode Test',
    tz: 'America/New_York',
    tz_label: 'Eastern Standard Time',
    tz_offset: -18000,
    profile: {
      title: '',
      phone: '',
      skype: '',
      real_name: 'Mams Kode Test',
      real_name_normalized: 'Mams Kode Test',
      display_name: 'Mams Kode Test',
      display_name_normalized: 'Mams Kode Test',
      fields: null,
      status_text: '',
      status_emoji: '',
      status_emoji_display_info: [],
      status_expiration: 0,
      avatar_hash: 'g9d31fb7554f',
      email: 'Mams@1posa.io',
      first_name: 'Mams',
      last_name: 'Kode Test',
      image_24:
        'https://secure.gravatar.com/avatar/9d31fb7554f29ed549c44d4f49cf8ff1.jpg?s=24&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0016-24.png',
      image_32:
        'https://secure.gravatar.com/avatar/9d31fb7554f29ed549c44d4f49cf8ff1.jpg?s=32&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0016-32.png',
      image_48:
        'https://secure.gravatar.com/avatar/9d31fb7554f29ed549c44d4f49cf8ff1.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0016-48.png',
      image_72:
        'https://secure.gravatar.com/avatar/9d31fb7554f29ed549c44d4f49cf8ff1.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0016-72.png',
      image_192:
        'https://secure.gravatar.com/avatar/9d31fb7554f29ed549c44d4f49cf8ff1.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0016-192.png',
      image_512:
        'https://secure.gravatar.com/avatar/9d31fb7554f29ed549c44d4f49cf8ff1.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0016-512.png',
      status_text_canonical: '',
      team: 'T6AGCMRPW',
    },
    is_admin: false,
    is_owner: false,
    is_primary_owner: false,
    is_restricted: false,
    is_ultra_restricted: false,
    is_bot: false,
    is_app_user: false,
    updated: 1739021802,
    is_email_confirmed: true,
    who_can_share_contact_card: 'EVERYONE',
  },
  response_metadata: {
    scopes: ['users:read.email', 'users:read'],
    acceptedScopes: ['users:read'],
  },
};

// Create the signature
const baseString = `v0:${timestamp}:${JSON.stringify(payload)}`;
const signature = `v0=${crypto
  .createHmac('sha256', signingSecret)
  .update(baseString)
  .digest('hex')}`;

// Construct the curl command
const curlCommand = `curl -X POST ${requestUrl} \
-H 'Content-Type: application/json' \
-H 'x-slack-signature: ${signature}' \
-H 'x-slack-request-timestamp: ${timestamp}' \
-d '${JSON.stringify(payload)}'`;

console.log(curlCommand);

// Execute the curl command
exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing curl: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Curl stderr: ${stderr}`);
    return;
  }
  console.log(`Curl response: ${stdout}`);
});
