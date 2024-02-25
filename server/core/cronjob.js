const {CronJob} = require('cron');
const {fork} = require('child_process')
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs')
const parser = require('cron-parser')
const { prisma } = require('../config/prisma');


const calculateNextRun = (trigger) => {
	if(trigger?.type==='INTERVAL'){
		return dayjs().add(trigger?.interval, 'minutes')
	}
	if(trigger?.type==='CRON_JOB'){
		return new Date(parser.parseExpression(trigger?.expression).next().toString())
	}
}
const job = new CronJob(
	'* * * * * *', // cronTime
	( async () => {
		const today = new Date()
		const triggers = await prisma.trigger.findMany({
			where:{
				next_run:{
					gte: new Date(
						today.getFullYear(),
						today.getMonth(),
						today.getDate(),
						today.getHours(),
						today.getMinutes()
					),
					lte: new Date()
				},
				status: 'ACTIVE'
			},
			include:{
				schedule:{
					include:{
						workflow:true
					}
				}
			}
		})
		for(const trigger of triggers){
			console.log("🚀 ===== trigger:", trigger);
			await prisma.trigger.update({
				where:{
					id: trigger?.id
				},
				data:{
					next_run: calculateNextRun(trigger)
				}
			})
			let {id, uuid, flows} = trigger?.schedule?.workflow || {}
			flows = flows?.map((item) => ({
				...item?.data,
				id: item?.id
			}))
			const childProcess = fork('./core/run_process.js')
			childProcess.send({id, uuid, workflows: flows, process_uuid: uuidv4()})
			childProcess.on('message', ({status}) => {
				if(status==='SUCCESS'){
					return console.log('SUCCESS')
				}
					return console.log('ERROR')
			})
		}
		console.log("🚀 ===== triggers:", triggers);
		console.log('You will see this message every second');
	}), // onTick
	null, // onComplete
	// true, // start
	'America/Los_Angeles' // timeZone
);
// const job=() =>[1,2]?.map((item) => new CronJob(
// 	'* * * * * *', // cronTime
// 	(() => {
// 		console.log(item);
// 	}), // onTick
// 	null, // onComplete
// 	true, // start
// 	'America/Los_Angeles' // timeZone
// ))
module.exports = {job}