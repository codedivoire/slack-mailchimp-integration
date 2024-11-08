import { Status } from '@mailchimp/mailchimp_marketing';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { createLogger } from '../utils/logger';
import { Result, MailchimpSubscriber, AppError, SlackUser } from '../types/types';

const logger = createLogger('MailchimpService');

type MailchimpConfig = {
  apiKey: string;
  serverPrefix: string;
  listId: string;
};

// Define the structure of merge fields
type MailchimpMergeFields = {
  FNAME?: string; // First name
  LNAME?: string; // Last name
  [key: string]: string | undefined; // Allow additional fields
};

// Define the expected structure of a successful response
type MailchimpSuccessResponse = {
  email_address: string;
  status: Status;
  merge_fields: MailchimpMergeFields; // Use the defined type for merge_fields
};


export const initializeMailchimp = (config: MailchimpConfig): void => {
  mailchimp.setConfig({
    apiKey: config.apiKey,
    server: config.serverPrefix,
  });
};

export const addSubscriber = async (
  listId: string,
  email: string,
  mergeFields?: { [key: string]: string }
): Promise<Result<MailchimpSubscriber, AppError>> => {
  try {
    logger.info(`Adding subscriber ${email} to list ${listId}`);
    
    const subscriber: MailchimpSubscriber = {
      email_address: email,
      status: 'subscribed',
      merge_fields: mergeFields
    };

    const response = await mailchimp.lists.addListMember(listId, subscriber);

    // Use the type guard to check if response is a MailchimpSuccessResponse
    if (isMailchimpSuccessResponse(response)) {
      const mailchimpSubscriberResponse: MailchimpSubscriber = {
        email_address: response.email_address, // Now safe to access
        status: response.status, // Ensure status is correctly typed
        merge_fields: response.merge_fields ?? {}, // Default to empty object if undefined
      };

      logger.info(`Successfully added subscriber ${email}`);
      return { ok: true, value: mailchimpSubscriberResponse };
    } else {
      // Handle the error response
      return handleMailchimpError(response);
    }
  } catch (error: unknown) {
    logger.error('Error adding subscriber to MailChimp:', error);
    return handleError(error);
  }
};

// Type guard function to check if response is a MailchimpSuccessResponse
function isMailchimpSuccessResponse(response: unknown): response is MailchimpSuccessResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'email_address' in response &&
    'status' in response &&
    'merge_fields' in response // Ensure merge_fields is also checked
  );
}

// Function to handle Mailchimp error responses
function handleMailchimpError(response: unknown): Result<MailchimpSubscriber, AppError> {
  logger.error('Error response from Mailchimp:', response);
  return {
    ok: false,
    error: {
      code: 'MAILCHIMP_ERROR',
      message: 'Failed to add subscriber to MailChimp',
      originalError: response
    }
  };
}

// Function to handle generic errors
function handleError(error: unknown): Result<MailchimpSubscriber, AppError> {
  if (isMailchimpError(error)) {
    // Handle specific MailChimp errors
    if (error.response?.body?.title === 'Member Exists') {
      return {
        ok: false,
        error: {
          code: 'MEMBER_EXISTS',
          message: 'Email is already subscribed to the list',
          originalError: error
        }
      };
    }
  }

  return {
    ok: false,
    error: {
      code: 'MAILCHIMP_ERROR',
      message: 'Failed to add subscriber to MailChimp',
      originalError: error
    }
  };
}

// Type guard function to check if error is a MailchimpError
function isMailchimpError(error: unknown): error is { response?: { body?: { title?: string } } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}

export const handleNewTeamMember = async (
  mailchimpListId: string,
  user: SlackUser
): Promise<void> => {
  const email = user.profile?.email;
  if (email) {
    // Prepare merge fields from user.profile
    const mergeFields = {
      FNAME: user.profile?.first_name || '',
      LNAME: user.profile?.last_name || '',
      // Add any other fields you want to include
    };

    const result = await addSubscriber(mailchimpListId, email, mergeFields);
    if (result.ok) {
      logger.info(`Successfully added ${user.profile?.real_name} to Mailchimp list.`);
    } else {
      logger.error(`Failed to add ${user.profile?.real_name} to Mailchimp: ${result.error.message}`);
    }
  } else {
    logger.warn(`No email found for user ${user.profile?.real_name}. Not adding to Mailchimp.`);
  }
};