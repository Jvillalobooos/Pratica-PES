import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";

import SummaryCards from "./components/SummaryCards.js";
import ConsultantsTable from "./components/ConsultantsTable.js";
import WorkOrdersTable from "./components/WorkOrdersTable.js";
import TicketsTable from "./components/TicketsTable.js";

export default function App() {
  return (
    <BrowserRouter>
      <Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
              Dashboard PES
            </Typography>

            <Button color="inherit" component={Link} to="/">
              Resumen
            </Button>

            <Button color="inherit" component={Link} to="/consultants">
              Consultores
            </Button>

            <Button color="inherit" component={Link} to="/work-orders">
              Órdenes
            </Button>

            <Button color="inherit" component={Link} to="/tickets">
              Tickets
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<SummaryCards />} />
            <Route path="/consultants" element={<ConsultantsTable />} />
            <Route path="/work-orders" element={<WorkOrdersTable />} />
            <Route path="/tickets" element={<TicketsTable />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}