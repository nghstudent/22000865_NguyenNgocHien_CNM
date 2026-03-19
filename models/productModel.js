const { dynamoDB } = require("../config/aws");
const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "Products";

const Product = {
    getAll: async() => {
        const data = await dynamoDB.send(new ScanCommand({ TableName: TABLE_NAME }));
        return data.Items;
    },
    getById: async(id) => {
        const data = await dynamoDB.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
        return data.Item;
    },
    save: async(product) => {
        await dynamoDB.send(new PutCommand({ TableName: TABLE_NAME, Item: product }));
    },
    delete: async(id) => {
        await dynamoDB.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
    }
};

module.exports = Product;