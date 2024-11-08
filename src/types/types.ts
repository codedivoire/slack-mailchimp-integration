import { Status } from "@mailchimp/mailchimp_marketing";

export type SlackUser = {
  id: string;
  team_id: string;
  profile?: {
    email?: string; // Email is optional
    real_name?: string; // Real name is optional
    display_name?: string;
    first_name?: string;
    last_name?: string;
    // Add other profile fields as necessary
  };
};

export type MailchimpSubscriber = {
  email_address: string;
  status: Status; // 'subscribed' | 'pending' | 'unsubscribed';
  merge_fields?: {
    FNAME?: string;
    LNAME?: string;
  };
};

export type Result<T, E = Error> = {
  ok: true;
  value: T;
} | {
  ok: false;
  error: E;
};

export type AppConfig = {
  port: number;
  env: string;
  slack: {
    signingSecret: string;
    botToken: string;
    appToken: string;
  };
  mailchimp: {
    apiKey: string;
    listId: string;
    serverPrefix: string;
  };
};

export type AppError = {
  code: string;
  message: string;
  originalError?: unknown;
};