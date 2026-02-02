require('dotenv').config();
const express = require('express');
const path = require('path');
const { CreateTableCommand, ListTablesCommand, DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const productController = require('./controllers/productController');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', productController.renderPage);
app.post('/save', productController.saveProduct);
app.get('/delete/:id', productController.deleteProduct);

const initDB = async () => {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION, endpoint: process.env.DYNAMODB_ENDPOINT });
    try {
        const { TableNames } = await client.send(new ListTablesCommand({}));
        if (!TableNames.includes("Products")) {
            await client.send(new CreateTableCommand({
                TableName: "Products",
                KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
                AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
                ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
            }));
            console.log("✅ Đã tạo bảng Products thành công.");
        }
    } catch (err) { console.error("❌ Lỗi DB:", err.message); }
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    setTimeout(initDB, 5000); // Đợi 5s cho DB khởi động
});