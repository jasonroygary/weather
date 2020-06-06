/*
THIS IS THE INTERCEPTOR ROUTE FOR THE WEATHER BRIDGE
HANDLING THIS OUTSIDE OF LOOPBACK MODEL PROVISIONING DUE TO ODD TLS
CONFIGURATION NEED (1.1)
*/
module.exports = function(app) {
var weather = app.models.Weather;
const express = require('express')
const https = require('https')
const eApp = express()
const url = require('url');
var bodyParser = require("body-parser");
const fs = require('fs');
var tools = require('../helper');
eApp.use(bodyParser.urlencoded({ extended: true }));
eApp.use(bodyParser.json());
eApp.use(bodyParser.text());

eApp.all('/*',function (req,res){
    console.log('request emitted on ' + req.url);
    console.log('connected');
    res.writeHead(200);
    const queryObject = url.parse(req.url,true).query;
    var timeStamp = new Date(queryObject.dateutc + 'Z');

    var weatherDoc = {
        dateUTC: queryObject.dateutc,
        id: queryObject.id,
        sensor: queryObject.sensor,
        sensorBattery: queryObject.sensorbattery,
        rssi: queryObject.rssi,
        hubBattery: queryObject.hubbattery,
        pressureInHg: queryObject.baromin,
        UVIndex: queryObject.uvindex,
        lightIntensity: queryObject.lightintensity,
        measuredLightSec: queryObject.measured_light_seconds,
        strikeCount: queryObject.strikecount,
        interference: queryObject.interference,
        lastStrikeTime: queryObject.last_strike_ts,
        lastStrikeDistanceMiles: queryObject.last_strike_distance,
        humidity: queryObject.humidity,
        tempF: queryObject.tempf,
        windSpeedMph: queryObject.windspeedmph,
        windDirDegrees: queryObject.winddir,
        windGustMph: queryObject.windgustmph,
        windGustDirectionDegrees: queryObject.windgustdir,
        windSpeedAverageMph: queryObject.windspeedavgmph,
        heatIndexF: queryObject.heatindex,
        feelsLikeF: queryObject.feelslike,
        windChillF: queryObject.windchill,
        dewPointF: queryObject.dewptf,
        rainIn: queryObject.rainin,
        dailyRainIn: queryObject.dailyrainin,
        //SPECIAL
        windGustDirectionCompass: tools.degreeToCompass(queryObject.windgustdir),
        dateNDLocal: timeStamp.toLocaleString(),
        lastStrikeDistanceKM: (queryObject.last_strike_distance * 1.60934).toFixed(2),
        windDirectionCompass: tools.degreeToCompass(queryObject.windgustdir),
        windSpeedKph: (queryObject.windspeedmph * 1.60934).toFixed(2),
        windSpeedAverageKph: (queryObject.windspeedavgmph * 1.60934).toFixed(2),
        windGustKph: (queryObject.windgustmph * 1.60934).toFixed(2),
        measuredLightHours: (queryObject.measured_light_seconds/60/60).toFixed(2),
        tempC: ((queryObject.tempf-32)/1.8).toFixed(2),
        dewPointC: ((queryObject.dewptf-32)/1.8).toFixed(2),
        windChillC: ((queryObject.windchill-32)/1.8).toFixed(2),
        feelsLikeC: ((queryObject.feelslike-32)/1.8).toFixed(2),
        heatIndexC: ((queryObject.heatindex-32)/1.8).toFixed(2),
        dailyRainCm: (queryObject.dailyrainin * 2.54).toFixed(2),
        pressurehPa: (queryObject.baromin * 33.86389).toFixed(2),
        rainCm: (queryObject.rainin * 2.54).toFixed(2),
        queryString: req.url
    }

    weather.create(weatherDoc,function(err, weather) {
        if(err){
            console.log(err);
          } 
        }
        )

    res.end('WEATHER');
});

https.createServer({
    key: fs.readFileSync('ssl-cert-snakeoil.key'),
    cert: fs.readFileSync('ssl-cert-snakeoil.pem'),
    secureProtocol: "TLSv1_1_method"
  }, eApp).listen(443, () => {
    console.log('Listening...')
  })
}