import { useEffect, useState } from "react";
import {
  getTickets,
  convertTicketToWorkOrder,
  getTicketTracking,
} from "../services/api";
import TicketForm from "./TicketForm";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

const getTicketStatusColor = (status) => {
  const colors = {
    abierto: "warning",
    convertido: "success",
    cerrado: "default",
  };

  return colors[status] || "default";
};

const getPriorityColor = (priority) => {
  const colors = {
    baja: "default",
    media: "info",
    alta: "warning",
    critica: "error",
  };

  return colors[priority] || "default";
};

export default function TicketsTable() {
  const [tickets, setTickets] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [trackingOpen, setTrackingOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(data);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (id) => {
    try {
      setActionLoadingId(id);
      await convertTicketToWorkOrder(id);
      setMessage("Ticket convertido correctamente.");
      setError("");
      await loadTickets();
    } catch (error) {
      setError(error.message);
      setMessage("");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTracking = async (id) => {
    try {
      setActionLoadingId(id);
      const data = await getTicketTracking(id);
      setTracking(data);
      setTrackingOpen(true);
      setError("");
    } catch (error) {
      setError(error.message);
      setTracking(null);
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Tickets de Soporte
          </Typography>
          <Typography color="text.secondary">
            Gestiona solicitudes de soporte y conviértelas en órdenes de trabajo.
          </Typography>
        </Box>

        <Button variant="outlined" onClick={loadTickets}>
          Actualizar
        </Button>
      </Stack>

      
    <TicketForm onTicketCreated={loadTickets} />


      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {tickets.length === 0 ? (
        <Alert severity="info">No hay tickets registrados.</Alert>
      ) : (
        
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Asunto</TableCell>
                <TableCell>Prioridad</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Work Order</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} hover>
                  <TableCell>{ticket.id}</TableCell>

                  <TableCell>{ticket.client_name}</TableCell>

                  <TableCell>
                    <Typography fontWeight="medium">
                      {ticket.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {ticket.description || "Sin descripción"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={ticket.priority || "media"}
                      color={getPriorityColor(ticket.priority)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={ticket.status}
                      color={getTicketStatusColor(ticket.status)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {ticket.work_order_id ? ticket.work_order_id : "No convertida"}
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {!ticket.work_order_id && (
                        <Button
                          variant="contained"
                          size="small"
                          disabled={actionLoadingId === ticket.id}
                          onClick={() => handleConvert(ticket.id)}
                        >
                          Convertir
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        size="small"
                        disabled={actionLoadingId === ticket.id}
                        onClick={() => handleTracking(ticket.id)}
                      >
                        Tracking
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={trackingOpen}
        onClose={() => setTrackingOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Tracking del Ticket</DialogTitle>

        <DialogContent>
          {!tracking ? (
            <Alert severity="info">No hay datos de tracking.</Alert>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Ticket
              </Typography>

              <Typography>
                <strong>ID:</strong> {tracking.ticket_id}
              </Typography>
              <Typography>
                <strong>Cliente:</strong> {tracking.client_name}
              </Typography>
              <Typography>
                <strong>Asunto:</strong> {tracking.subject}
              </Typography>
              <Typography>
                <strong>Estado:</strong> {tracking.ticket_status}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Work Order
              </Typography>

              {tracking.work_order_id ? (
                <>
                  <Typography>
                    <strong>ID:</strong> {tracking.work_order_id}
                  </Typography>
                  <Typography>
                    <strong>Título:</strong> {tracking.work_order_title}
                  </Typography>
                  <Typography>
                    <strong>Estado:</strong> {tracking.work_order_status}
                  </Typography>
                  <Typography>
                    <strong>Horas estimadas:</strong> {tracking.estimated_hours}
                  </Typography>
                </>
              ) : (
                <Alert severity="warning">
                  Este ticket todavía no tiene work order asociada.
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Consultor asignado
              </Typography>

              {tracking.consultant_id ? (
                <>
                  <Typography>
                    <strong>ID:</strong> {tracking.consultant_id}
                  </Typography>
                  <Typography>
                    <strong>Nombre:</strong> {tracking.consultant_name}
                  </Typography>
                  <Typography>
                    <strong>Especialidad:</strong> {tracking.consultant_specialty}
                  </Typography>
                </>
              ) : (
                <Alert severity="info">
                  La work order aún no tiene consultor asignado.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setTrackingOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}