const express = require("express");
const fs = require("fs");
const router = express.Router();

const upper =  (lower) => {
    return lower.replace(/^\w/, function (chr) {
        return chr.toUpperCase();
    });
};
/* POST login */
router.get("/config/input", async (req, res, next) => {
    try {
        let words = fs.readFileSync( "server/config/words.txt","utf8");
        words = words.split(",\n");
        words = words.map(word => upper(word));
        let config = fs.readFileSync( "server/config/configuration.json", "utf8");
        config = JSON.parse(config);
        config = config.input;
        return res.json({
            words, config
        });
    } catch (err) {
        return next(err);
    }
});

/* POST login */
router.post("/word", async (req, res, next) => {
    try {
        return res.json({
            message: req.body['hans']
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
