const {Router} = require("express");
const router = Router();



const {
  addData,
  listData,
  updateCount,
  getCount,
  updateData
} = require("../Controllers/apiController");

router.post("/data/add", addData );
router.get("/data/list", listData );
router.post("/counter/update", updateCount);
router.get("/counter/get",getCount);
router.put("/data/update/:id", updateData);

module.exports = router;