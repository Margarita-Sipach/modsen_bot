import cron from 'node-cron';

export class Cron<T>{
	private cronId: cron.ScheduledTask | null = null

	constructor(private callback: Function){}

	start(time: string, ...args: T[]){
		time = time.split(':').reverse().join(' ');
		this.cronId = cron.schedule(`${time} * * *`, async() => this.callback(...args));
	}

	stop(){
		this.cronId!.stop();
	}
}