import cron from 'node-cron';

export class Cron<T> {
  cronId: cron.ScheduledTask | null = null;

  constructor(private callback: Function) {}

  start(time: string, ...args: T[]) {
    const timeArr = time.split(':').reverse();
    this.cronId = cron.schedule(`${timeArr[0]} ${+timeArr[1] - 3} * * *`, async () =>
      this.callback(...args),
    );
  }

  stop() {
    this.cronId!.stop();
  }
}
