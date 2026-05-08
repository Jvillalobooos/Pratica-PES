const pool = require("../db");

const getWorkloadByConsultant = async (req, res, next) => {
  try {
    const { consultantId } = req.params; // Obtener el ID del consultor desde los parámetros de la ruta

    const result = await pool.query(// Consulta SQL para obtener la carga de trabajo del consultor, calculando el porcentaje de carga de trabajo en función de las horas actuales y las horas máximas por semana, y contando el número de órdenes de trabajo asignadas al consultor
     `SELECT 
        c.id,
        c.name AS consultant_name,
        c.specialty,
        c.current_workload,
        c.max_hours_per_week,
        ROUND((c.current_workload::decimal / c.max_hours_per_week) * 100, 2) AS workload_percentage,
        COUNT(w.id) AS assigned_work_orders
       FROM consultants c
       LEFT JOIN work_orders w ON c.id = w.consultant_id
       WHERE c.id = $1
       GROUP BY 
        c.id,
        c.name,
        c.specialty,
        c.current_workload,
        c.max_hours_per_week`,
      [consultantId] // Utilizar el ID del consultor como parámetro para la consulta SQL
    );

    res.json(result.rows[0]); // Devolver la carga de trabajo del consultor como respuesta en formato JSON
  } catch (error) {
    next(error);
  }
};


const getWorkOrdersByStatus = async (req, res, next) => {
  try {
    const result = await pool.query( 
        
`SELECT status,
COUNT(*) AS total
FROM work_orders
GROUP BY status
ORDER BY total DESC`
    )// Consulta SQL para obtener las órdenes de trabajo agrupadas por estado y contar el total de cada estado

    res.json(result.rows); // Devolver las órdenes de trabajo por estado como respuesta en formato JSON
  } catch (error) {
    next(error);
  }
};

const getWorkloadAllConsultants = async (req, res, next) => {
  try {
    const result = await pool.query( // Consulta SQL para obtener la carga de trabajo de todos los consultores, calculando el porcentaje de carga de trabajo en función de las horas actuales y las horas máximas por semana
      `SELECT 
        c.id,
        c.name AS consultant_name,
        c.specialty,
        c.current_workload,
        c.max_hours_per_week,
        ROUND((c.current_workload::decimal / c.max_hours_per_week) * 100, 2) AS workload_percentage,
        COUNT(w.id) AS assigned_work_orders
       FROM consultants c
       LEFT JOIN work_orders w ON c.id = w.consultant_id 
       GROUP BY 
        c.id,
        c.name,
        c.specialty,
        c.current_workload,
        c.max_hours_per_week
       ORDER BY workload_percentage DESC`
    );

    res.json(result.rows); 
  } catch (error) {
    next(error);
  }
};
const getSummary = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM consultants) AS total_consultants,
        (SELECT COUNT(*) FROM work_orders) AS total_work_orders,
        (SELECT COUNT(*) FROM work_orders WHERE status = 'pendiente') AS pending_work_orders,
        (SELECT COUNT(*) FROM work_orders WHERE status = 'asignado') AS assigned_work_orders,
        (SELECT COUNT(*) FROM work_orders WHERE status = 'en_progreso') AS in_progress_work_orders,
        (SELECT COUNT(*) FROM work_orders WHERE status = 'completado') AS completed_work_orders,
        (SELECT COUNT(*) FROM work_orders WHERE status = 'cancelado') AS cancelled_work_orders,
        (SELECT COUNT(*) FROM tickets) AS total_tickets,
        (SELECT COUNT(*) FROM tickets WHERE status = 'abierto') AS open_tickets,
        (SELECT COUNT(*) FROM tickets WHERE status = 'convertido') AS converted_tickets`
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getWorkloadByConsultant,
  getWorkOrdersByStatus,
  getWorkloadAllConsultants,
  getSummary
};
 
