const { dynamodb } = require('../config/aws-config');
const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

const Product = {
    // Lấy tất cả sản phẩm
    getAll: async() => {
        const command = new ScanCommand({ TableName: TABLE_NAME });
        return await dynamodb.send(command);
    },

    // Lấy 1 sản phẩm theo ID
    getById: async(id) => {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: { id: id }
        });
        return await dynamodb.send(command);
    },

    // Lưu sản phẩm (Thêm mới hoặc Cập nhật)
    save: async(data) => {
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                id: data.id || uuidv4(),
                name: data.name,
                image: data.image,
                price: Number(data.price),
                quantity: Number(data.quantity)
            }
        });
        return await dynamodb.send(command);
    },

    // Xóa sản phẩm
    delete: async(id) => {
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id: id }
        });
        return await dynamodb.send(command);
    },

    // Tìm kiếm sản phẩm theo tên
    search: async(keyword) => {
        const command = new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: "contains(#n, :k)",
            ExpressionAttributeNames: { "#n": "name" },
            ExpressionAttributeValues: { ":k": keyword }
        });
        return await dynamodb.send(command);
    }
};

module.exports = Product;