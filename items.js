const express = require("express")
const router = new express.Router()
const ExpressError = require("./expressError")
const items = require("./fakeDb");


router.get('/', function (req, res, next) {
    try{
        return  res.json(items);
    } catch(e) {
        return next(e)
    }
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

// router.get("/:name", function (req, res, next) {
//     try{
//         const foundItem = items.find(item => item.name === req.params.name)
//         if (foundItem === undefined) {
//         throw new ExpressError("Item not found", 404)
//     }
//     res.json({ item:foundItem })
//     } catch(e) {
//         next(e);
//     }
// });
const items = [
    { name: "popsicle", price: 1.45 },
    // Add more items as needed
  ];
  
  // Route to get a single item by name
  router.get("/:name", (req, res) => {
    try{
        const itemName = req.params.name;
        const foundItem = items.find(item => item.name === itemName);
        if (!foundItem) {
            return res.status(404).json({ error: "Item not found" });
    }
    res.json(foundItem);
   
    } catch(e){
        console.error("Error in GET /:name route:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
      
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
        const foundItem = items.filter(item => item.name === req.params.name)
        if (foundItem.length === items.length) {
            throw new ExpressError("Item not found", 404)
        }
        items= foundItem;
        res.json({ message: "Deleted" })
    } catch (e) {
        next(e);
    }

});

module.exports = router;