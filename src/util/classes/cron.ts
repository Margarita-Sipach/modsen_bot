import cron from 'node-cron';

export class Cron<T> {
  cronId: cron.ScheduledTask | null = null;

  constructor(private callback: Function) {}

  start(time: string, ...args: T[]) {
		console.log('cron start')
		console.log(args)

		for(let i = 0; i < 24; i++){
			const timeArr = time.split(':');//.reverse().join(' ');
			// this.cronId = cron.schedule(`${time} * * *`, async () =>
			//   this.callback(...args),
			// );
	
			this.cronId = cron.schedule(`${timeArr[1]} ${i} * * *`, async () =>
				// this.callback(...args),
				console.log('cron hello', timeArr[1], i)
			);
		}
    
  }

  stop() {
		console.log('cron stop')
    this.cronId!.stop();
  }
}
