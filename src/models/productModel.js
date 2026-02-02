const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.DYNAMODB_ENDPOINT
});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "Products";

const Product = {
    getAll: async () => {
        const data = await ddbDocClient.send(new ScanCommand({ TableName: TABLE_NAME }));
        return data.Items;
    },
    save: async (product) => {
        return await ddbDocClient.send(new PutCommand({ TableName: TABLE_NAME, Item: product }));
    },
    delete: async (id) => {
        return await ddbDocClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
    }
};

module.exports = Product;