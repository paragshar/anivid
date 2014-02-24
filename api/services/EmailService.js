var nodemailer = require("nodemailer");

exports.sendInviteEmail = function(options) {

    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth:{
            user: "deepanshu@mantralabsglobal.com",
            pass: "deepanshu@99"
        }
    });

    var mailOptions = {
       from: "deepanshu@mantralabsglobal.com", 
       to: options.email, // list of receivers
       subject: "Verification link sent from Anivid.com",
       text: "Dear "+options.name+",\nYou're in the Beta! Click "+ options.link +" to verify your account"
    }

    smtpTransport.sendMail(mailOptions, function(error, response){
       if(error){
           console.log(error);
       }else{
           console.log("Message sent: " + response.message);
       }
    });
    
};