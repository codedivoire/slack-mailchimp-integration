import { App, Receiver, ReceiverEvent } from '@slack/bolt';

export class FakeReceiver implements Receiver {
  private bolt: App | undefined;

  public init = (bolt: App) => {
    this.bolt = bolt;
  };

  public start = jest.fn(
    (...params: Parameters<typeof App.prototype.start>): Promise<unknown> => {
      // Simulate starting the receiver with parameters
      return Promise.resolve([...params]);
    }
  );

  public stop = jest.fn(
    (...params: Parameters<typeof App.prototype.start>): Promise<unknown> =>
      Promise.resolve([...params])
  );

  public async sendEvent(event: ReceiverEvent): Promise<void> {
    return this.bolt?.processEvent(event);
  }
}
