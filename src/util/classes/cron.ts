import cron from 'node-cron';

export class Cron{
	private cronId: any

	start(time: string, callback: Function){
		this.cronId = cron.schedule(`${time} * * *`, async() => callback());
	}

	stop(){
		this.cronId.stop();
	}
}