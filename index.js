'use strict';

if (!process.env.GMAIL_ADDRESS) {
  console.error("You need to define GMAIL_ADDRESS env variable");
  process.exit(1);
}

if (!process.env.GMAIL_PASSWORD ) {
  console.error("You need to define GMAIL_PASSWORD env variable");
  process.exit(1);
}

if (!process.env.RECIPIENT) {
  console.error("You need to define RECIPIENT env variable");
  process.exit(1);
}

const os = require('os');
const publicIp = require('public-ip');
const Rx = require('rxjs');
const nodemailer = require('nodemailer');

const data = {};

const publicIpObservable = Rx.Observable.fromPromise(publicIp.v4());

const privateIpObservable = Rx.Observable.create(function (observer) {
  const ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(function (ifname) {
    let alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      observer.next(iface.address);
    });
  });

  observer.complete();
}).reduce(function(acc, item) {
  acc.push(item);
  return acc;
}, []);

const flatMapEmail = function(data) {
  let text = "Hi !\n\n";
  text += "Your Raspberry Pi is online.\n\n";
  text += "Public IP address : " + data.public + "\n";
  text += "Private IP addresses : \n";
  data.private.forEach(function (privateIp) {
    text += "- " + privateIp + "\n";
  });

  return Rx.Observable.create(function (observer) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_ADDRESS,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Raspberry Pi" <' + process.env.GMAIL_ADDRESS + '>', // sender address
        to: process.env.RECIPIENT, // list of receivers
        subject: 'Rasperry Pi Started ✔', // Subject line
        text: text // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        observer.error(error);
      } else {
        observer.next(info);
        observer.complete();
      }
    });
  });
};

const dataObservable = Rx.Observable.combineLatest(
    publicIpObservable,
    privateIpObservable,
    function (publicIps, privateIps) {
      return {
        public: publicIps,
        private: privateIps
      }
    }
).flatMap(flatMapEmail);

dataObservable.subscribe(
  function (x) {
    console.log(x);
    process.exit(0);
  },
  function (err) {
    console.error(err);
    process.exit(1);
  },
  function () {
  }
);
