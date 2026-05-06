const { Router } = require("express");

const router = Router();


const {
  getWorkloadByConsultant,
  getWorkOrdersByStatus,
  getWorkloadAllConsultants,
  getSummary
} = require("../controllers/kpis.controller");

router.get("/workload-by-consultant/:consultantId", getWorkloadByConsultant);
router.get("/work-orders-by-status", getWorkOrdersByStatus);
router.get("/workload-all-consultants", getWorkloadAllConsultants);
router.get("/summary", getSummary);

module.exports = router;

