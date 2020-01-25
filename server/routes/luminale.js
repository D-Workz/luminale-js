const express = require("express");

const router = express.Router();

/* POST login */
router.get("/config", async (req, res, next) => {
    try {

        return res.json({
            message: "ok"
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
