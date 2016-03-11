/**
 * Created by Alex on 11.03.2016.
 */





var mailsender = {
    init : function(){
        mailsender.email = require("emailjs/email");
        mailsender.saleserver = require("../saleserver.js");

        mailsender.saleserver.getConfigParamByKey('emailfrom', function(param){
            mailsender.emailfrom = param.value;
            mailsender.saleserver.getConfigParamByKey('emailfrompass', function(param){
                mailsender.emailfrompass = param.value;
                mailsender.saleserver.getConfigParamByKey('emailto', function(param){
                    mailsender.emailto = param.value;
                    mailsender.server  =  mailsender.email.server.connect({
                        user:    mailsender.emailfrom
                        , password:mailsender.emailfrompass
                        , host:    "smtp-mail.outlook.com"
                        , tls: {ciphers: "SSLv3"}
                    });
                });
            });

        });
    }
    , notify : function(messagetosend){
        var message = {
            text:    messagetosend
            , from:    "BubbleMaker <" + mailsender.emailfrom +">"
            , to:      mailsender.emailto
            //, cc:      "else <blobby@yandex.ru>",
            , subject: "Уведомление от системы учета"
            , attachment:
                [
                    {   data:"<html><h2>" + messagetosend + "</h2></html>"
                        , alternative:true}
                    , {path:"dbdata/checks.db",
                       type:"text",
                       name:"checks.db"}
                ]
        };

        // send the message and get a callback with an error or details of the message that was sent
        mailsender.server.send(message, function(err, message) {
            console.log(err || message);
        });
    }
};

module.exports = mailsender;

/*

var email = require('emailjs');

var server = email.server.connect({
    user: 'nodejsiscool@gmail.com',
    password: 'stackoverflow',
    host: 'smtp.gmail.com',
    ssl: true
});

server.send({
    text: 'Hey howdy',
    from: 'NodeJS',
    to: 'Wilson <wilson.balderrama@gmail.com>',
    cc: '',
    subject: 'Greetings'
}, function (err, message) {
    console.log(err || message);
});*/
