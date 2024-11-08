import { mockTeamJoinEvent } from './mockTeamJoinEvent';
import { EnvelopedEvent, ReceiverEvent, SlackEventMiddlewareArgs, TeamJoinEvent } from "@slack/bolt";

export const noopVoid = (..._args: any[]) => Promise.resolve();

interface DummyTeamJoinOverrides {
    event?: TeamJoinEvent;
    text?: string;
  }

export function createDummyTeamJoinEventMiddlewareArgs(
    eventOverrides?: DummyTeamJoinOverrides,
    // biome-ignore lint/suspicious/noExplicitAny: allow mocking tools to provide any override
    bodyOverrides?: Record<string, any>,
  ): SlackEventMiddlewareArgs<'team_join'> {
    
    const payload: TeamJoinEvent = eventOverrides?.event ||mockTeamJoinEvent;
    return {
      payload,
      event: payload,
      body: envelopeEvent(payload, bodyOverrides),
      message: undefined,
      say:undefined

    };
  }


  function envelopeEvent<SlackEvent>(
    evt: SlackEvent,
    // biome-ignore lint/suspicious/noExplicitAny: allow mocking tools to provide any override
    overrides?: Record<string, any>,
  ): EnvelopedEvent<SlackEvent> {
    const obj: EnvelopedEvent<SlackEvent> = {
      token: 'xoxb-1234',
      team_id: 'T1234',
      api_app_id: 'A1234',
      event: evt,
      type: 'event_callback',
      event_id: '1234',
      event_time: 1234,
      ...overrides,
    };
    return obj;
  }
  // Dummies (values that have no real behavior but pass through the system opaquely)
  export function createDummyReceiverEvent(type = 'dummy_event_type'): ReceiverEvent {
    // NOTE: this is a degenerate ReceiverEvent that would successfully pass through the App. it happens to look like a
    // IncomingEventType.Event
    return {
      body: {
        event: {
          type,
        },
      },
      ack: () => Promise.resolve(),
    };
  }