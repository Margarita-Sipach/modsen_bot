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

		this.cronId = cron.schedule(`28 12 * * *`, async () =>
      // this.callback(...args),
			console.log('cron hello', args)
    );
  }

  stop() {
		console.log('cron stop')
    this.cronId!.stop();
  }
}
