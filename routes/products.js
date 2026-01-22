const express = require("express");
const { v4: uuidv4 } = require("uuid");
const {
    PutItemCommand,
    ScanCommand,
    GetItemCommand,
    UpdateItemCommand,
    DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");

const client = require("../config/dynamodb");
const upload = require("../config/upload");

const router = express.Router();

/* READ */
router.get("/", async(req, res) => {
    const data = await client.send(
        new ScanCommand({ TableName: "Products" })
    );
    res.render("index", { products: data.Items || [] });
});

/* FORM ADD */
router.get("/add", (req, res) => {
    res.render("add");
});

/* CREATE */
router.post("/add", upload.single("image"), async(req, res) => {
    const { name, price, quantity } = req.body;

    await client.send(
        new PutItemCommand({
            TableName: "Products",
            Item: {
                id: { S: uuidv4() },
                name: { S: name },
                price: { N: price },
                quantity: { N: quantity },
                url_image: { S: `/uploads/${req.file.filename}` },
            },
        })
    );

    res.redirect("/");
});

/* FORM EDIT */
router.get("/edit/:id", async(req, res) => {
    const data = await client.send(
        new GetItemCommand({
            TableName: "Products",
            Key: { id: { S: req.params.id } },
        })
    );
    res.render("edit", { product: data.Item });
});

/* UPDATE */
router.post("/edit/:id", upload.single("image"), async(req, res) => {
    const { name, price, quantity } = req.body;

    let updateExpression = "SET #n=:n, price=:p, quantity=:q";
    let expressionNames = { "#n": "name" };
    let expressionValues = {
        ":n": { S: name },
        ":p": { N: price },
        ":q": { N: quantity },
    };

    if (req.file) {
        updateExpression += ", url_image=:img";
        expressionValues[":img"] = {
            S: `/uploads/${req.file.filename}`,
        };
    }

    await client.send(
        new UpdateItemCommand({
            TableName: "Products",
            Key: { id: { S: req.params.id } },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionNames,
            ExpressionAttributeValues: expressionValues,
        })
    );

    res.redirect("/");
});

/* DELETE */
router.get("/delete/:id", async(req, res) => {
    await client.send(
        new DeleteItemCommand({
            TableName: "Products",
            Key: { id: { S: req.params.id } },
        })
    );
    res.redirect("/");
});

module.exports = router;