import { useEffect, useState } from "react";
import { getSummary } from "../services/api";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

export default function SummaryCards() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await getSummary();
      setSummary(data);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!summary) return <Alert severity="info">No hay datos de resumen.</Alert>;

  const cards = [
    { title: "Consultores", value: summary.total_consultants || 0 },
    { title: "Órdenes", value: summary.total_work_orders || 0 },
    { title: "Pendientes", value: summary.pending_work_orders || 0 },
    { title: "Asignadas", value: summary.assigned_work_orders || 0 },
    { title: "En progreso", value: summary.in_progress_work_orders || 0 },
    { title: "Completadas", value: summary.completed_work_orders || 0 },
    { title: "Canceladas", value: summary.cancelled_work_orders || 0 },
    { title: "Tickets", value: summary.total_tickets || 0 },
    { title: "Tickets abiertos", value: summary.open_tickets || 0 },
    { title: "Tickets convertidos", value: summary.converted_tickets || 0 },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Resumen Operativo
          </Typography>
          <Typography color="text.secondary">
            Vista general de tickets, órdenes de trabajo y carga operativa.
          </Typography>
        </Box>

        <Button variant="contained" onClick={loadSummary}>
          Actualizar
        </Button>
      </Box>

      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>

                <Typography variant="h4" fontWeight="bold">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}