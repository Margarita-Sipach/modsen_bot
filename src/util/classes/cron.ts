import cron from 'node-cron';

export class Cron<T> {
  cronId: cron.ScheduledTask | null = null;

  constructor(private callback: Function) {}

  start(time: string, ...args: T[]) {
		console.log('cron start')
		console.log('12:15')

    time = time.split(':').reverse().join(' ');
    // this.cronId = cron.schedule(`${time} * * *`, async () =>
    //   this.callback(...args),
    // );

		this.cronId = cron.schedule(`15 12 * * *`, async () =>
      this.callback(...args),
    );
  }

  stop() {
		console.log('cron stop')
    this.cronId!.stop();
  }
}
