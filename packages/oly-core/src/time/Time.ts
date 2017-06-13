export interface ITimer {

  /**
   * Js Timer identifier (NodeJs or Browser)
   */
  id: any;

  /**
   * Timeout or Interval
   */
  type: "timeout" | "interval";

  /**
   * Function to call
   */
  tick: Function;

  /**
   * Start time
   */
  now: number;

  /**
   * Duration in millis
   */
  ms: number;
}

/**
 * Idea:
 *
 * Do not rely on Date.now and setTimeout on your app.
 * This is hard to test.
 *
 * If this is class is used EVERYWHERE is the app, it will be fun.
 */
export class Time {

  /**
   * Time cursor.
   */
  private cursor: number | null;

  /**
   * Timer registry.
   */
  private timers: any[] = [];

  /**
   * Date.now like
   */
  public now(): number {
    return this.cursor || Date.now();
  }

  /**
   * setTimeout like
   *
   * @param func
   * @param ms
   */
  public timeout(func: Function, ms: number = 0): ITimer {

    const timer: ITimer = {
      id: null,
      tick: func,
      ms,
      now: this.now(),
      type: "timeout",
    };

    this.timers.push(timer);

    if (!this.cursor) {
      timer.id = setTimeout(() => {
        if (!this.cursor) {
          func();
        }
      }, ms);
    }

    return timer;
  }

  /**
   * Pause fake time.
   */
  public pause(): void {
    this.cursor = Date.now();
  }

  /**
   * Resume fake time.
   */
  public reset(): void {
    this.cursor = null;
  }

  /**
   * Move cursor if time is paused.
   *
   * @param ms    Positive or negative delta in millis
   */
  public travel(ms: number): void {
    if (this.cursor) {
      this.cursor += ms;
      for (const timer of this.timers) {
        if (timer.now + timer.ms < this.cursor) {
          timer.tick();
        }
      }
    }
  }
}
