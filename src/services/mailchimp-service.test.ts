/* eslint-disable @typescript-eslint/no-unused-vars */
import mailchimp from '@mailchimp/mailchimp_marketing';
import { initializeMailchimp, addSubscriber } from './mailchimp-service';


// Mock the mailchimp marketing library
jest.mock('@mailchimp/mailchimp_marketing', () => ({
  setConfig: jest.fn(),
  lists: {
    addListMember: jest.fn()
  }
}));

describe('MailchimpService', () => {
  const mockConfig = {
    apiKey: 'test-api-key',
    serverPrefix: 'us1',
    listId: 'test-list-id'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeMailchimp', () => {
    it('should initialize mailchimp with correct config', () => {
      initializeMailchimp(mockConfig);
      
      expect(mailchimp.setConfig).toHaveBeenCalledWith({
        apiKey: mockConfig.apiKey,
        server: mockConfig.serverPrefix
      });
    });
  });

  describe('addSubscriber', () => {
    const mockEmail = 'test@example.com';

    it('should successfully add a subscriber with merge fields', async () => {
      const mockResponse = {
        id: '123',
        email_address: mockEmail,
        status: 'subscribed',
        merge_fields: {
          FNAME: 'Test',
          LNAME: 'User'
        }
      };


      (mailchimp.lists.addListMember as jest.Mock).mockResolvedValueOnce(mockResponse);

      const mergeFields = {
        FNAME: 'Test',
        LNAME: 'User'
      };

      const result = await addSubscriber(mockConfig.listId, mockEmail, mergeFields);

      expect(result.ok).toBe(true);
      if (result.ok) {
        const {id, ...mockValue} = mockResponse
        expect(result.value).toEqual(mockValue);
      }

      expect(mailchimp.lists.addListMember).toHaveBeenCalledWith(
        mockConfig.listId,
        {
          email_address: mockEmail,
          status: 'subscribed',
          merge_fields: mergeFields
        }
      );
    });

    it('should handle member exists error', async () => {
      const mockError = {
        response: {
          body: {
            title: 'Member Exists'
          }
        }
      };

      (mailchimp.lists.addListMember as jest.Mock).mockRejectedValueOnce(mockError);

      const result = await addSubscriber(mockConfig.listId, mockEmail);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('MEMBER_EXISTS');
      }
    });

    it('should handle generic error', async () => {
      const mockError = new Error('Network error');

      (mailchimp.lists.addListMember as jest.Mock).mockRejectedValueOnce(mockError);

      const result = await addSubscriber(mockConfig.listId, mockEmail);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('MAILCHIMP_ERROR');
      }
    });
  });
});