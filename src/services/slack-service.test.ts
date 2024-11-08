import type { WebClientOptions } from '@slack/web-api';
import { App } from '@slack/bolt';
import { setupTeamJoinHandler } from './slack-service';
import { handleNewTeamMember } from './mailchimp-service';
import { createLogger } from '../utils/logger';
import { FakeReceiver } from '../test/receiver';
import {
  createDummyTeamJoinEventMiddlewareArgs,
  noopVoid,
} from '../test/helpers';



jest.mock('./mailchimp-service', () => ({
  handleNewTeamMember: jest.fn(),
}));

jest.mock('../utils/logger', () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  })),
}));


jest.mock('@slack/web-api', () => {
    const hasMockResponse = false;
    const  mockResponse= '';
    return {
        addAppMetadata: jest.fn(),
        WebClient: hasMockResponse ? class {
            public token?: string;
    
            public constructor(token?: string, _options?: WebClientOptions) {
              this.token = token;
            }
    
            public auth = {
              test: jest.fn().mockResolvedValue(mockResponse), // Changed to Jest mock
            };
          }
        : class {
            public token?: string;
    
            public constructor(token?: string, _options?: WebClientOptions) {
              this.token = token;
            }
            public auth = {
                test: jest.fn().mockResolvedValue({}), // Changed to Jest mock
              };
          }
      }
    }
);

describe.skip('Slack Service - Team Join Handler', () => {
  let app: App;
  let fakeReceiver: FakeReceiver;
  const mockMailchimpListId = 'test-list-id';
  const logger = createLogger('SlackService');

  beforeEach(() => {
    fakeReceiver = new FakeReceiver(); // Initialize the FakeReceiver
    app = new App({
      signingSecret: '123',
      token: 'xob-123',
      receiver: fakeReceiver,
    });
    fakeReceiver.init(app); // Initial// Create a new instance of the Slack app
    setupTeamJoinHandler(app, mockMailchimpListId);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should handle team_join event and call handleNewTeamMember with user info', async () => {
    const mockUser = {
      id: 'U123456',
      profile: {
        email: 'test@example.com',
        real_name: 'Test User',
        first_name: 'Test',
        last_name: 'User',
      },
    };

    const mockClient = {
      users: {
        info: jest.fn().mockResolvedValue({
          ok: true,
          user: mockUser,
        }),
      },
    };

    // Simulate the event using the FakeReceiver
    await fakeReceiver.sendEvent({
      ...createDummyTeamJoinEventMiddlewareArgs(),
      ack: noopVoid,
    });

    expect(mockClient.users.info).toHaveBeenCalledWith({ user: mockUser.id });
    expect(handleNewTeamMember).toHaveBeenCalledWith(
      mockMailchimpListId,
      mockUser
    );
  });

  it('should log a warning when no email is found', async () => {

    // Simulate the event using the FakeReceiver
    await fakeReceiver.sendEvent({
      ...createDummyTeamJoinEventMiddlewareArgs(),
      ack: noopVoid
    });

    expect(logger.warn).toHaveBeenCalledWith(
      'No email found for user Test User. Not adding to Mailchimp.'
    );
  });

  it('should log an error when there is an error fetching user info', async () => {

    await fakeReceiver.sendEvent({
      ...createDummyTeamJoinEventMiddlewareArgs(),
      ack: noopVoid,
    });

    expect(logger.error).toHaveBeenCalledWith(
      'Error handling team_join event:',
      expect.any(Error)
    );
  });
});
