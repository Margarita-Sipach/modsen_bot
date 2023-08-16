import cron from 'node-cron';

export class Cron<T> {
  cronId: cron.ScheduledTask | null = null;

  constructor(private callback: Function) {}

  start(time: string, ...args: T[]) {
		console.log('cron start')
		console.log('11:50')

    time = time.split(':').reverse().join(' ');
    // this.cronId = cron.schedule(`${time} * * *`, async () =>
    //   this.callback(...args),
    // );

		this.cronId = cron.schedule(`50 11 * * *`, async () =>
      this.callback(...args),
    );
  }

  stop() {
		console.log('cron stop')
    this.cronId!.stop();
  }
}
