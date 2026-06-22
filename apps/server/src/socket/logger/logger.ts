import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@repo/shared/socketEvents';
import colors from 'colors';
import process from 'node:process';
import { KEY_FOR_SHOW_KEY } from '../../types/types.ts';

class Logger {
  private static instance: Logger | undefined;
  private isShow: boolean = false;

  public constructor() {
    if (Logger.instance) return Logger.instance;

    this.isShow = process.env.SHOW_LOG === KEY_FOR_SHOW_KEY;

    Logger.instance = this;
  }

  public emit<T extends keyof ServerToClientEvents>(
    userIds: string[],
    event: T,
    payload: ServerToClientEvents[T] extends (argument: infer P) => void
      ? P
      : never
  ): void {
    if (this.isShow) {
      console.log(colors.yellow(event), colors.green('TO'), userIds);
      if (payload) {
        console.log('payload:', payload);
      }
    }
  }

  public on<T extends keyof ClientToServerEvents>(
    userId: string,
    event: T,
    payload?: ClientToServerEvents[T] extends (argument: infer P) => void
      ? P
      : never
  ): void {
    if (this.isShow) {
      console.log(colors.magenta(event), colors.green('FROM'), userId);
      if (payload) {
        console.log('payload:', payload);
      }
    }
  }

  public info(...messages: string[]): void {
    if (this.isShow) {
      console.log(...messages.map(message => colors.blue(message)));
    }
  }
}

export const getLogger = (): Logger => new Logger();
