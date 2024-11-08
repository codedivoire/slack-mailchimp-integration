import { App, LogLevel } from '@slack/bolt';

import { createLogger } from '../utils/logger';
import { SlackUser } from '../types/types';
import { handleNewTeamMember } from './mailchimp-service';

const logger = createLogger('SlackService');

export const createSlackApp = (
  signingSecret: string,
  botToken: string
): App => {
  return new App({
    signingSecret,
    token: botToken,
    logLevel: LogLevel.DEBUG,
    customRoutes: [
      {
        path: '/health',
        method: ['GET'],
        handler: (req, res) => {
          res.writeHead(200);
          res.end('OK');
        },
      },
    ],
  });
};

export const setupTeamJoinHandler = (
  app: App,
  mailchimpListId: string
): void => {
  app.event('team_join', async ({ event, client }) => {
    try {
      logger.info(`Handling new team_join event: ${JSON.stringify(event, null, '\t')}`);
      const user = event.user; 

      // Fetch complete user info to get the email
      const userInfoResponse = await client.users.info({ user: user.id });

      if (!userInfoResponse.ok) {
        logger.error('Error fetching user info:', userInfoResponse.error);
        return; // Exit if there's an error fetching user info
      }

      const userInfo = userInfoResponse.user as SlackUser;

      // Check if the email exists
      if (userInfo.profile?.email) {
        logger.debug('User detected:', JSON.stringify(userInfo));
        await handleNewTeamMember(mailchimpListId, userInfo);
      } else {
        logger.warn(`No email found for user ${userInfo.profile?.real_name}. Not adding to Mailchimp.`);
      }
    } catch (error) {
      logger.error('Error handling team_join event:', error);
    }
  });
};
