import cron from 'node-cron';

export class Cron<T> {
  cronId: cron.ScheduledTask | null = null;

  constructor(private callback: Function) {}

  start(time: Date, ...args: T[]) {
    console.log('cron start');

    //const timeArr = new Date(time).toLocaleTimeString();//.reverse().join(' ');
    // this.cronId = cron.schedule(`${time} * * *`, async () =>
    //   this.callback(...args),
    // );
    console.log(time, `${time.getUTCMinutes()} ${time.getUTCHours()} * * *`);
    this.cronId = cron.schedule(
      `${time.getUTCMinutes()} ${time.getUTCHours()} * * *`,
      async () =>
        // this.callback(...args),
        console.log('cron hello', `${time.getMinutes()} ${time.getHours()}`),
    );
  }

  stop() {
    console.log('cron stop');
    this.cronId!.stop();
  }
}
