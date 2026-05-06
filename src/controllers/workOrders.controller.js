const pool = require('../db');

const getAllworkOrders = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM work_orders");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
    
};

const getWorkOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
       
        const resultid = await pool.query("SELECT * FROM work_orders WHERE id = $1", [id]);
        if (resultid.rows.length === 0) {
            return res.status(404).json({ message: "Orden de trabajo no encontrada" });
        }
        res.json(resultid.rows[0]);
    } catch (error) {
        next(error);
    }
    
};

const createWorkOrder = async (req, res, next) => {
 const {title, description, priority, status, estimated_hours, consultant_id}  =  req.body; // Aquí se puede acceder a los datos enviados en el cuerpo de la solicitud
 try {
     const result = await pool.query(
         "INSERT INTO work_orders (title, description, priority, status, estimated_hours, consultant_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
         [title, description, priority, status, estimated_hours, consultant_id]
     );
     res.json(result.rows[0]); // Devuelve la orden de trabajo recién creada como respuesta
 } catch (error) {
  next(error);
 }  
};

const searchAndAssignmentWorkOrder = async (req, res, next) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const workOrderResult = await client.query(
      "SELECT * FROM work_orders WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (workOrderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Orden de trabajo no encontrada" });
    }

    const workOrder = workOrderResult.rows[0];

    if (!workOrder.estimated_hours || workOrder.estimated_hours <= 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "La orden de trabajo no tiene horas estimadas válidas",
      });
    }

    if (workOrder.consultant_id) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "La orden de trabajo ya está asignada a un consultor",
      });
    }

    const consultantResult = await client.query(
      `SELECT *
       FROM consultants
       WHERE current_workload + $1 <= max_hours_per_week
       ORDER BY current_workload ASC
       LIMIT 1
       FOR UPDATE`,
      [workOrder.estimated_hours]
    );

    if (consultantResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "No hay consultores disponibles para asignar esta orden de trabajo",
      });
    }

    const consultant = consultantResult.rows[0];

    const assignResult = await client.query(
      `UPDATE work_orders
       SET consultant_id = $1, status = 'asignado'
       WHERE id = $2
       RETURNING *`,
      [consultant.id, id]
    );

    const updatedConsultantResult = await client.query(
      `UPDATE consultants
       SET current_workload = current_workload + $1
       WHERE id = $2
       RETURNING *`,
      [workOrder.estimated_hours, consultant.id]
    );

    await client.query("COMMIT");

    res.json({
      message: "Orden de trabajo asignada correctamente",
      workOrder: assignResult.rows[0],
      consultant: updatedConsultantResult.rows[0],
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Rollback error:", rollbackError);
    }

    next(error);
  } finally {
    client.release();
  }
};




module.exports = {
    getAllworkOrders,
    getWorkOrderById,
    createWorkOrder,
    searchAndAssignmentWorkOrder
}