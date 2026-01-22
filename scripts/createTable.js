const {
    DynamoDBClient,
    CreateTableCommand,
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
    region: "local",
    endpoint: "http://localhost:8000",

    credentials: {
        accessKeyId: "fakeMyKeyId",
        secretAccessKey: "fakeSecretAccessKey",
    },
});

const params = {
    TableName: "Products",
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
    ],
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },
    ],
    BillingMode: "PAY_PER_REQUEST",
};

client.send(new CreateTableCommand(params))
    .then(() => console.log("✅ Đã tạo bảng Products"))
    .catch(console.error);