// Define app configuration in a single location, but pull in values from
// system environment variables (so we don't check them in to source control!)
module.exports = {

    //flag to get Twilio Account Setting from this file or from environment
    getTwiliAccountSettingsfromFile: 'Y',


    // Your primary Twilio Account SID
    accountSid: 'AC2xdsfjlaksdfjkldsafjYourAccountSidHere',

    // API Key/Secret Pair - generate a pair in the console
    apiKey: 'SKadsjfklsajdfklsYourAPIKeyHere',
    apiSecret: 'Vdadsfo23432asYourSecretKeyHere',

    // Your Chat service instance SID
    serviceSid: 'ISc3258347afadsfjsdkjChatServiceInstanceSIDHere',

    // Defines whether or not this application is deployed in a production
    // environment
    nodeEnv: process.env.NODE_ENV || 'development',

    // In production, this is the base host name for web app on the public
    // internet, like "jimmysbbq.herokuapp.com".  This should be the same host
    // you use in your Twilio Number config for voice or messaging URLs
    host: process.env.HOST || 'localhost',

    // The port your web application will run on
    port: process.env.PORT || 3000
};
