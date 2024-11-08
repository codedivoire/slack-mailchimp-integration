# Slack-Mailchimp Integration

Automatically adds new Slack workspace members to a Mailchimp mailing list.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   SLACK_BOT_TOKEN=xoxb-your-token
   SLACK_SIGNING_SECRET=your-signing-secret
   SLACK_APP_TOKEN=xapp-your-token
   MAILCHIMP_API_KEY=your-api-key
   MAILCHIMP_LIST_ID=your-list-id
   MAILCHIMP_SERVER_PREFIX=usX
   PORT=3000
   ```

## Development

Run locally:

```
curl -X POST https://immune-killdeer-enhanced.ngrok-free.app/slack/events \
-H 'Content-Type: application/json' \
-d '{
  "token": "your-verification-token",
  "team_id": "T123456",
  "api_app_id": "A123456",
  "event": {
    "type": "team_join",
    "user": {
      "id": "U123456",
      "team_id": "T123456",
      "name": "newuser",
      "real_name": "New User",
      "profile": {
        "email": "newuser@example.com"
      }
    }
  },
  "type": "event_callback",
  "event_id": "Ev123456",
  "event_time": 1234567890,
  "authed_users": ["U123456"]
}
```
