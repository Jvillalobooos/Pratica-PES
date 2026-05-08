import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Stack,
  Alert,
} from "@mui/material";
import { createTicket } from "../services/api";

export default function TicketForm({ onTicketCreated }) {
  const [formData, setFormData] = useState({
    external_ticket_id: "",
    client_name: "",
    subject: "",
    description: "",
    priority: "media",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setFormData({
      external_ticket_id: "",
      client_name: "",
      subject: "",
      description: "",
      priority: "media",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.client_name || !formData.subject) {
      setError("Cliente y asunto son requeridos.");
      setMessage("");
      return;
    }

    try {
      setSaving(true);
      await createTicket(formData);

      setMessage("Ticket creado correctamente.");
      setError("");
      clearForm();

      if (onTicketCreated) {
        onTicketCreated();
      }
    } catch (error) {
      setError(error.message);
      setMessage("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Crear nuevo ticket
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Registra una solicitud de soporte para convertirla posteriormente en una orden de trabajo.
      </Typography>

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

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="ID externo"
            name="external_ticket_id"
            value={formData.external_ticket_id}
            onChange={handleChange}
            placeholder="OTOBO-1001"
            fullWidth
          />

          <TextField
            label="Cliente"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Asunto"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            select
            label="Prioridad"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="baja">Baja</MenuItem>
            <MenuItem value="media">Media</MenuItem>
            <MenuItem value="alta">Alta</MenuItem>
            <MenuItem value="critica">Crítica</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Guardando..." : "Crear ticket"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}