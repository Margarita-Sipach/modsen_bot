import cron from 'node-cron';

export class Cron<T> {
  cronId: cron.ScheduledTask | null = null;

  constructor(private callback: Function) {}

  start(time: string, ...args: T[]) {
		console.log('cron start', time)
    time = time.split(':').reverse().join(' ');
		cron.schedule("*/10 * * * * *", function() {
      console.log("running a task every 10 second");
    });
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
