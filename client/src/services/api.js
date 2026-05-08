const API_URL = "http://localhost:3000/api";

const handleResponse = async (response) => {
  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Respuesta no es JSON. Status: ${response.status}. Respuesta: ${text.slice(0, 100)}`);
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

export const getSummary = async () => {
  const response = await fetch(`${API_URL}/kpis/summary`);
  return handleResponse(response);
};

export const getConsultantsWorkload = async () => {
  const response = await fetch(`${API_URL}/kpis/workload-all-consultants`);
  return handleResponse(response);
};

export const getWorkOrders = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  if (filters.status) queryParams.append("status", filters.status);
  if (filters.priority) queryParams.append("priority", filters.priority);
  if (filters.consultant_id) queryParams.append("consultant_id", filters.consultant_id);
  if (filters.search) queryParams.append("search", filters.search);

  const queryString = queryParams.toString();

  const response = await fetch(
    `${API_URL}/work-orders${queryString ? `?${queryString}` : ""}`
  );

  return handleResponse(response);
};
export const getTicketTracking = async (ticketId) => {
  const response = await fetch(`${API_URL}/tickets/${ticketId}/tracking`);
  return handleResponse(response);
};

export const createTicket = async (ticketData) => {
  const response = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticketData),
  });

  return handleResponse(response);
};
export const assignWorkOrder = async (workOrderId) => {
  const response = await fetch(`${API_URL}/work-orders/${workOrderId}/assign`, {
    method: "POST",
  });

  return handleResponse(response);
};

export const updateWorkOrderStatus = async (workOrderId, status) => {
  const response = await fetch(`${API_URL}/work-orders/${workOrderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse(response);
};


export const getTickets = async () => {
  const response = await fetch(`${API_URL}/tickets`);
  return handleResponse(response);
};



export const convertTicketToWorkOrder = async (ticketId) => {
  const response = await fetch(
    `${API_URL}/tickets/${ticketId}/convert-to-work-order`,
    {
      method: "POST",
    }
  );

  return handleResponse(response);
};