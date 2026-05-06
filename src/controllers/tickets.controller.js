const pool = require('../db');

const getAllTickets = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT * FROM tickets");
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
    
};

const getTicketById = async (req, res, next) => {
    try {
        const { id } = req.params;
       
        const resultid = await pool.query("SELECT * FROM tickets WHERE id = $1", [id]);
        if (resultid.rows.length === 0) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }
        res.json(resultid.rows[0]);
    } catch (error) {
        next(error);
    }
    
};

const createTicket = async (req, res, next) => {
 const {name, specialty}  =  req.body; // Aquí se puede acceder a los datos enviados en el cuerpo de la solicitud
 try {
     const result = await pool.query(
         "INSERT INTO tickets (name, specialty) VALUES ($1, $2) RETURNING *",
         [name, specialty]
     );
     res.json(result.rows[0]); // Devuelve el ticket recién creado como respuesta
 } catch (error) {
  next(error);
 }  
};


const convertTicketToWorkOrder = async (req, res, next) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const ticketResult = await client.query(
      "SELECT * FROM tickets WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (ticketResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    const ticket = ticketResult.rows[0];

    if (ticket.status === "convertido" || ticket.work_order_id) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Este ticket ya fue convertido en una orden de trabajo",
      });
    }

    const workOrderResult = await client.query(
      `INSERT INTO work_orders 
       (title, description, priority, status, estimated_hours, consultant_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        ticket.subject,
        ticket.description,
        ticket.priority,
        "pendiente",
        2,
        null,
      ]
    );

    const updatedTicketResult = await client.query(
      `UPDATE tickets
       SET status = 'convertido', work_order_id = $1
       WHERE id = $2 
       RETURNING *`,
      [workOrderResult.rows[0].id, id]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Ticket convertido a orden de trabajo correctamente",
      ticket: updatedTicketResult.rows[0],
      workOrder: workOrderResult.rows[0],
    });
  } catch (error) {
    
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

module.exports = {
    getAllTickets,
    getTicketById,
    createTicket,
    convertTicketToWorkOrder

}