import cron from 'node-cron';

export class Cron<T> {
  cronId: cron.ScheduledTask | null = null;

  constructor(private callback: Function) {}

  start(time: string, ...args: T[]) {
    time = time.split(':').reverse().join(' ');
		console.log('cron start', time)

    this.cronId = cron.schedule(`${time} * * *`, async () =>
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
