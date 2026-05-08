const { Router } = require("express");

const router = Router();

const {
  getAllTickets,
  getTicketById,
  createTicket,
  convertTicketToWorkOrder,
  getTicketTracking
} = require("../controllers/tickets.controller");

router.get("/", getAllTickets);

router.get("/:id", getTicketById);
router.post("/", createTicket);
router.post("/:id/convert-to-work-order", convertTicketToWorkOrder);
router.get("/:id/tracking", getTicketTracking);
module.exports = router;