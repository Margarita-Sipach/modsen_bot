import cron from 'node-cron';

export class Cron<T> {
  cronId: cron.ScheduledTask | null = null;

  constructor(private callback: Function) {}

  start(time: string, ...args: T[]) {
    this.cronId = cron.schedule(`${time.split(':').reverse().join(' ')} * * *`, async () =>
      {
				console.log('shedule');
				this.callback(...args)
			}
    );
  }

  stop() {
		console.log('cron stop')
    this.cronId!.stop();
  }
}
