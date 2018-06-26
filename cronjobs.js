const CronJob = require('cron').CronJob,
    Controllers = require("app/Controllers");

let RendimientoGuardar = new CronJob({
    cronTime: '0 0 0 1 * *',
    onTick: () => {
        Controllers.RendimientoController.generar();
    },
    onComplete: null,
    start: true, 
    time: 'America/Argentina/Buenos_Aires'
});