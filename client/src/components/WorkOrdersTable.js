import { useEffect, useState } from "react";
import {
  getWorkOrders,
  assignWorkOrder,
  updateWorkOrderStatus,
} from "../services/api";

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
  Select,
  MenuItem,
  Stack,
TextField,
  FormControl,
  InputLabel,
} from "@mui/material";

const getStatusColor = (status) => {
  const colors = {
    pendiente: "warning",
    asignado: "info",
    en_progreso: "secondary",
    completado: "success",
    cancelado: "error",
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


export default function WorkOrdersTable() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
  status: "",
  priority: "",
  consultant_id: "",
  search: "",
});

const loadWorkOrders = async () => {
  try {
    setLoading(true);
    const data = await getWorkOrders(filters);
    setWorkOrders(data);
    setError("");
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
const handleFilterChange = (name, value) => {
  setFilters((prev) => ({
    ...prev,
    [name]: value,
  }));
};
const applyFilters = async () => {
  await loadWorkOrders();
};

const clearFilters = async () => {
  const emptyFilters = {
    status: "",
    priority: "",
    consultant_id: "",
    search: "",
  };

  setFilters(emptyFilters);

  try {
    setLoading(true);
    const data = await getWorkOrders(emptyFilters);
    setWorkOrders(data);
    setError("");
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleAssign = async (workOrderId) => {
    try {
      setActionLoadingId(workOrderId);
      await assignWorkOrder(workOrderId);
      setMessage("Orden de trabajo asignada correctamente.");
      setError("");
      await loadWorkOrders();
    } catch (error) {
      setError(error.message);
      setMessage("");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleStatusUpdate = async (workOrderId, status) => {
    try {
      setActionLoadingId(workOrderId);
      await updateWorkOrderStatus(workOrderId, status);
      setMessage("Estado actualizado correctamente.");
      setError("");
      await loadWorkOrders();
    } catch (error) {
      setError(error.message);
      setMessage("");
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    loadWorkOrders();
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
          Órdenes de Trabajo
        </Typography>
        <Typography color="text.secondary">
          Gestiona asignaciones, estados y carga operativa.
        </Typography>
      </Box>

      <Button variant="outlined" onClick={loadWorkOrders}>
        Actualizar
      </Button>
    </Stack>

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

    {/* FILTROS */}
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="Buscar"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            label="Estado"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="asignado">Asignado</MenuItem>
            <MenuItem value="en_progreso">En progreso</MenuItem>
            <MenuItem value="completado">Completado</MenuItem>
            <MenuItem value="cancelado">Cancelado</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Prioridad</InputLabel>
          <Select
            label="Prioridad"
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="baja">Baja</MenuItem>
            <MenuItem value="media">Media</MenuItem>
            <MenuItem value="alta">Alta</MenuItem>
            <MenuItem value="critica">Crítica</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Consultor ID"
          value={filters.consultant_id}
          onChange={(e) => handleFilterChange("consultant_id", e.target.value)}
          fullWidth
        />

        <Button variant="contained" onClick={applyFilters}>
          Filtrar
        </Button>

        <Button variant="outlined" onClick={clearFilters}>
          Limpiar
        </Button>
      </Stack>
    </Paper>

    {/* TABLA */}
    {workOrders.length === 0 ? (
      <Alert severity="info">No hay órdenes de trabajo registradas.</Alert>
    ) : (
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Horas</TableCell>
              <TableCell>Consultor</TableCell>
              <TableCell align="center">Asignación</TableCell>
              <TableCell align="center">Cambiar estado</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {workOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.id}</TableCell>

                <TableCell>
                  <Typography fontWeight="medium">
                    {order.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.description || "Sin descripción"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={order.priority || "sin prioridad"}
                    color={getPriorityColor(order.priority)}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>

                <TableCell>{order.estimated_hours}</TableCell>

                <TableCell>
                  {order.consultant_id ? order.consultant_id : "Sin asignar"}
                </TableCell>

                <TableCell align="center">
                  {!order.consultant_id ? (
                    <Button
                      variant="contained"
                      size="small"
                      disabled={actionLoadingId === order.id}
                      onClick={() => handleAssign(order.id)}
                    >
                      Asignar
                    </Button>
                  ) : (
                    <Chip label="Asignada" color="success" size="small" />
                  )}
                </TableCell>

                <TableCell align="center">
                  <Select
                    size="small"
                    value={order.status}
                    disabled={actionLoadingId === order.id}
                    onChange={(e) =>
                      handleStatusUpdate(order.id, e.target.value)
                    }
                  >
                    <MenuItem value="pendiente">pendiente</MenuItem>
                    <MenuItem value="asignado">asignado</MenuItem>
                    <MenuItem value="en_progreso">en_progreso</MenuItem>
                    <MenuItem value="completado">completado</MenuItem>
                    <MenuItem value="cancelado">cancelado</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Box>
);
}