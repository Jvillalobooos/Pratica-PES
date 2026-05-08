import { useEffect, useState } from "react";
import { getConsultantsWorkload } from "../services/api";

export default function ConsultantsTable() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadConsultants = async () => {
    try {
      setLoading(true);
      const data = await getConsultantsWorkload();
      setConsultants(data);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultants();
  }, []);

  if (loading) return <p>Cargando carga de trabajo...</p>;
  if (error) return <p>Error: {error}</p>;
  if (consultants.length === 0) return <p>No hay datos de consultores.</p>;

  return (
    <section>
      <h2>Carga de Trabajo de Consultores</h2>

      <table border="1" cellPadding="8" style={{ width: "100%", backgroundColor: "white" }}>
        <thead>
          <tr>
            <th>Consultor</th>
            <th>Especialidad</th>
            <th>Carga actual</th>
            <th>Carga máxima</th>
            <th>% Ocupación</th>
            <th>Órdenes asignadas</th>
          </tr>
        </thead>

        <tbody>
          {consultants.map((consultant) => (
            <tr key={consultant.id}>
              <td>{consultant.consultant_name}</td>
              <td>{consultant.specialty}</td>
              <td>{consultant.current_workload}</td>
              <td>{consultant.max_hours_per_week}</td>
              <td>{consultant.workload_percentage}</td>
              <td>{consultant.assigned_work_orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}