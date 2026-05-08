const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const workOrdersRoutes = require("./routes/workOrders.routes");
const ticketRoutes = require("./routes/tickets.routes");
const consultantRoutes = require("./routes/consultants.routes");
const kpisRoutes = require("./routes/kpis.routes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); // ESTO ES CLAVE

app.use("/api/work-orders", workOrdersRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/consultants", consultantRoutes);
app.use("/api/kpis", kpisRoutes);

app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message });
});

app.listen(3000);
console.log("Servidor en el puerto 3000");