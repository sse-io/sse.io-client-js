declare class ShimoEventSource {
  constructor(url: string, options: any);
  public addEventListener(
    event: string,
    callback: (...params: any[]) => void
  ): void;
  public removeEventListener(event: string): void;
  public onerror(error: any): void;
  public close(): void;
}

declare module 'shimo-eventsource' {
  export = ShimoEventSource
}
