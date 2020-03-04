let AWS = require("aws-sdk");
var aws_remote_config =  require('../config/config').aws_remote_config;

AWS.config.update(aws_remote_config);

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "icemanDev2",
    KeySchema: [       
        { AttributeName: "PK", KeyType: "HASH"},  //Partition key
        { AttributeName: "SK", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "PK", AttributeType: "S" },
        { AttributeName: "SK", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});