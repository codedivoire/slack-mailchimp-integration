import dotenv from 'dotenv'; // Import dotenv
import { createSlackApp, setupTeamJoinHandler } from './services/slack-service';
import { initializeMailchimp } from './services/mailchimp-service';
import { AppConfig } from './types/types';

// Load environment variables from .env file
dotenv.config(); // Load the .env file

// Check if required environment variables are set
if (!process.env.SLACK_SIGNING_SECRET || !process.env.SLACK_BOT_TOKEN) {
  console.error('Error: SLACK_SIGNING_SECRET and SLACK_BOT_TOKEN must be set in the .env file.');
  process.exit(1); // Exit the application if required variables are not set
}

const config: AppConfig = {
  port: 3000,
  env: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  slack: {
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
    botToken: process.env.SLACK_BOT_TOKEN || '',
    appToken: process.env.SLACK_APP_TOKEN || '',
  },
  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY || '',
    listId: process.env.MAILCHIMP_LIST_ID || '',
    serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || '',
  },
};

console.log(`Slack app config ${config}`);
console.dir(config);

// Initialize Mailchimp
initializeMailchimp(config.mailchimp);

// Create and start Slack app
const slackApp = createSlackApp(config.slack.signingSecret, config.slack.botToken);

// Setup event handlers
setupTeamJoinHandler(slackApp, config.mailchimp.listId);

// Start the Slack app
(async () => {
  await slackApp.start(config.port);
  console.log(`Slack app is running on port ${config.port}`);
})();
