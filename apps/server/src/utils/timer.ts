import { EmptyCallback } from '../types/handlerProps.ts';

export class Timer {
  private interval: ReturnType<typeof setInterval> | undefined = undefined;

  public constructor(private readonly duration: number) {}

  public start(callback: EmptyCallback): void {
    let time = this.duration;
    this.interval = setInterval(() => {
      time--;
      if (time === 0) {
        clearInterval(this.interval);
        this.interval = undefined;
        callback();
      }
    }, 1000);
  }
}
