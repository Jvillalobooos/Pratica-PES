const { Router } = require("express");

const router = Router();


const {
  getAllworkOrders,
  getWorkOrderById,
  createWorkOrder,
  searchAndAssignmentWorkOrder,
  updateStatus,
} = require("../controllers/workOrders.controller");

router.get("/", getAllworkOrders);

router.get("/:id", getWorkOrderById);

router.post("/", createWorkOrder);

router.post("/:id/assign", searchAndAssignmentWorkOrder);

router.patch("/:id", updateStatus);


module.exports = router;