import cron from 'node-cron';

export class Cron<T> {
  cronId: cron.ScheduledTask | null = null;

  constructor(private callback: Function) {}

  start(time: string, ...args: T[]) {
		console.log('cron start')
    time = time.split(':').reverse().join(' ');
    // this.cronId = cron.schedule(`${time} * * *`, async () =>
    //   this.callback(...args),
    // );
		console.log('11:38')

		this.cronId = cron.schedule(`38 11 * * *`, async () =>
      this.callback(...args),
    );
  }

  stop() {
		console.log('cron stop')
    this.cronId!.stop();
  }
}
