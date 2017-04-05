var express = require('express');
var fedex = require('./fedex/FedexAPI');
var app = express();
var path = require('path');
var session      = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var cors = require('cors')

var port = process.env.PORT || 3000;

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()) // parse application/json
app.use(session({ secret: 'meanstack passport app' })); // session secret
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(cors())


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'https://checkout.sandbox.netsuite.com/');

    /*// Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
*/
    // Pass to next layer of middleware
    next();
});
app.get('/', function(req, res) {
  res.send("hello world!");
});


app.post('/rates', function(request, response) {
  //res.send("hellow world!");
  //var zip = request.params.zip;
  //res.send(zip);
 // console.log('body : ',request.body.fedexData);
  if (request.body.fedexData) {
  	var input = request.body.fedexData;
  	var Shipper = input['Shipper'] || {
			Contact: {
				PersonName: 'Sender Name',
				CompanyName: 'Primary Arms',
				PhoneNumber: '5555555555'
			},
			Address: {
				StreetLines: ['2825 Miller Ranch Rd.'],
				City: 'Pearland',
				StateOrProvinceCode: 'TX',
				PostalCode: '77584',
				CountryCode: 'US'
			}
		}, 
  		Recipient = input['Recipient'] || {
			Contact: {
				PersonName: 'Recipient Name',
				CompanyName: 'Company Receipt Name',
				PhoneNumber: '5555555555'
			},
			Address: {
				StreetLines: ['Address Line 1'],
				PostalCode: '77407',
				CountryCode: 'US'
			}
		}, 
  		PackageCount = input['PackageCount'] || '1', 
  		RequestedPackageLineItems = input['RequestedPackageLineItems'] || {
	      SequenceNumber: 1,
	      GroupPackageCount: 1,
	      Weight: {
	        Units: 'LB',
	        Value: '50.0'
	      },
	      Dimensions: {
	        Length: 108,
	        Width: 5,
	        Height: 5,
	        Units: 'IN'
	      }
	    };

  	var params = {};
  	params['ReturnTransitAndCommit'] = true;
  	params['CarrierCodes'] = ['FDXE','FDXG'];
  	params['RequestedShipment'] = {};
  	params['RequestedShipment']['DropoffType'] = "REGULAR_PICKUP";
  	params['RequestedShipment']['PackagingType'] = "YOUR_PACKAGING";
  	params['RequestedShipment']['Shipper'] = Shipper;
  	params['RequestedShipment']['Recipient'] = Recipient;
  	params['RequestedShipment']['ShippingChargesPayment'] = {
      PaymentType: 'SENDER',
      Payor: {
        ResponsibleParty: {
          AccountNumber: fedex.options.account_number
        }
      }
    };
    params['RequestedShipment']['PackageCount'] = PackageCount;
    params['RequestedShipment']['RequestedPackageLineItems'] = RequestedPackageLineItems;

    fedex.rates(params, function(err, results) {
	  if(err) {
	    //return console.log(err);
	    response.json(err);
	  }
	  //console.log(results);
	  response.json(results);
	});

    /*
  	fedex.rates({
	  ReturnTransitAndCommit: true,
	  CarrierCodes: ['FDXE','FDXG'],
	  RequestedShipment: {
	    DropoffType: 'REGULAR_PICKUP',
	    //ServiceType: 'FEDEX_GROUND',
	    PackagingType: 'YOUR_PACKAGING',
	    Shipper: {
	      Contact: {
	        PersonName: 'Sender Name',
	        CompanyName: 'Primary Arms',
	        PhoneNumber: '5555555555'
	      },
	      Address: {
	        StreetLines: [
	          '2825 Miller Ranch Rd.'
	        ],
	        City: 'Pearland',
	        StateOrProvinceCode: 'TX',
	        PostalCode: '77584',
	        CountryCode: 'US'
	      }
	    },
	    Recipient: {
	      Contact: {
	        PersonName: 'Recipient Name',
	        CompanyName: 'Company Receipt Name',
	        PhoneNumber: '5555555555'
	      },
	      Address: {
	        StreetLines: [
	          'Address Line 1'
	        ],
	        City: 'Charlotte',
	        StateOrProvinceCode: 'NC',
	        PostalCode: zip,
	        CountryCode: 'US',
	        Residential: false
	      }
	    },
	    ShippingChargesPayment: {
	      PaymentType: 'SENDER',
	      Payor: {
	        ResponsibleParty: {
	          AccountNumber: fedex.options.account_number
	        }
	      }
	    },
	    PackageCount: '1',
	    RequestedPackageLineItems: {
	      SequenceNumber: 1,
	      GroupPackageCount: 1,
	      Weight: {
	        Units: 'LB',
	        Value: '50.0'
	      },
	      Dimensions: {
	        Length: 108,
	        Width: 5,
	        Height: 5,
	        Units: 'IN'
	      }
	    }
	  }
	}, function(err, results) {
	  if(err) {
	    //return console.log(err);
	    response.json(err);
	  }
	  //console.log(results);
	  response.json(results);
	  
	});*/
  };
  //response.send(request.body);

});

app.listen(port ,function(){
	console.log('server running on port : ',port)
});