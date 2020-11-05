// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const df = require('date-fns');
const ages = require('./EligibleAges')

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    try {
        let args = event.queryStringParameters;
        console.log('---> ' + args);
        let birthDate = df.parseISO(args.birthDate);
        console.log('---> ' + birthDate);
        let retireDate = df.parseISO(args.retireDate);
        console.log('---> ' + retireDate);
        let dates = {
            early: ages.getEarlyDate(birthDate),
            full: ages.getFullDate(birthDate),
            delayed: ages.getDelayedDate(birthDate)
        }

        let reduction = ages.calcEarlyReduction(birthDate, retireDate);

        response = {
            'statusCode': 200,
            'body': JSON.stringify(dates)
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
