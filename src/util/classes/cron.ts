import cron from 'node-cron';

export class Cron{
	private cronId: cron.ScheduledTask | null = null

	constructor(time: string, callback: Function){
		this.start(time, callback)
	}

	start(time: string, callback: Function){
		this.cronId = cron.schedule(`${time} * * *`, async() => callback());
	}

	stop(){
		this.cronId!.stop();
	}
}