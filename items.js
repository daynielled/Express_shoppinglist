const express = require("express")
const router = new express.Router()
const ExpressError = require("./expressError")
const items = require("./fakeDb");
const { runInNewContext } = require("vm");

router.get('/', function (req, res) {
    res.json(items);
});

router.post('/', function (req, res, next) {
    try {
        if (!req.body.name || !req.body.price) {
            throw new ExpressError('Both name and price are required', 400);
        }
        const price = parseFloat(req.body.price);
        if (isNaN(price)) {
            throw new ExpressError('Invalid price', 400)
        }
        const newItem = { name: req.body.name, price };
        items.push(newItem)
        res.status(201).json({ added: newItem });
    } catch (e) {
        return next(e);
    }
});

router.get("/:name", function (req, res) {
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) {
        throw new ExpressError("Item not found", 404)
    }
    res.json({ item: foundItem })
});

router.patch("/:name", function (req, res, next) {
    try {
        const foundItem = items.find(item => item.name === req.params.name)
        if (foundItem === undefined) {
            throw new ExpressError("Item not found", 404)
        }
        if (req.body.name !== undefined) {
            foundItem.name = req.body.name
        }
        if (req.body.price !== undefined) {
            const newPrice = parseFloat(req.body.price);

            if (isNaN(newPrice)) {
                throw new ExpressError('Invalid price', 400)
            }
            foundItem.price = newPrice
        }
        res.json({ updated: foundItem });
    } catch (e) {
        next(e);
    }

});

router.delete("/:name", function (req, res, next) {
    try {
        const foundItem = items.findIndex(item => item.name === req.params.name)
        if (foundItem === -1) {
            throw new ExpressError("Item not found", 404)
        }
        items.splice(foundItem, 1);
        
        res.json({ message: "Deleted" })
    } catch (e) {
        next(e);
    }

});

module.exports = router;