const socket = io();

const servicesList = document.getElementById("servicesList");
const servicesEmpty = document.getElementById("servicesEmpty");
const serviceDetail = document.getElementById("service-detail");
const bookingsList = document.getElementById("bookingsList");
const bookingsEmpty = document.getElementById("bookingsEmpty");
const messagesList = document.getElementById("messagesList");
const messagesEmpty = document.getElementById("messagesEmpty");

const createElement = (tag, text, className) => {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
};

const toggleEmptyState = (list, emptyElement) => {
  if (!list || !emptyElement) return;
  emptyElement.hidden = list.children.length > 0;
};

// ---------- Servicios (listado) ----------

const currentFilters = new URLSearchParams(window.location.search);

// El listado puede estar filtrado por la URL (?category=...&available=...).
// Solo se muestran los servicios que cumplen esos mismos filtros.
const matchesFilters = (service) => {
  const category = currentFilters.get("category");
  const available = currentFilters.get("available");

  if (category && service.category !== category) return false;
  if (available !== null && String(service.available) !== available) {
    return false;
  }
  return true;
};

const buildServiceCard = (service) => {
  const article = document.createElement("article");
  article.id = service._id;
  article.className = "service-card";

  const detailsLink = createElement("a", "Ver detalles");
  detailsLink.href = `/views/services/${service._id}`;

  article.append(
    createElement("h2", service.name),
    createElement("p", service.description),
    createElement("p", `Duración: ${service.duration} minutos`),
    createElement("p", `Precio: $${service.price}`),
    createElement("p", `Categoría: ${service.category}`),
    createElement(
      "p",
      `Disponibilidad: ${service.available ? "Disponible" : "No disponible"}`,
      service.available ? "available" : "unavailable",
    ),
    detailsLink,
  );

  return article;
};

socket.on("serviceCreated", (service) => {
  if (!servicesList) return;
  if (document.getElementById(service._id)) return;
  if (!matchesFilters(service)) return;

  servicesList.append(buildServiceCard(service));
  toggleEmptyState(servicesList, servicesEmpty);
});

socket.on("serviceUpdated", (service) => {
  if (!servicesList) return;

  const article = document.getElementById(service._id);

  if (!matchesFilters(service)) {
    if (article) article.remove();
  } else if (article) {
    article.replaceWith(buildServiceCard(service));
  } else {
    servicesList.append(buildServiceCard(service));
  }

  toggleEmptyState(servicesList, servicesEmpty);
});

socket.on("serviceDeleted", (serviceId) => {
  if (!servicesList) return;

  const article = document.getElementById(serviceId);
  if (article) article.remove();

  toggleEmptyState(servicesList, servicesEmpty);
});

// ---------- Servicios (detalle) ----------

socket.on("serviceUpdated", (service) => {
  if (!serviceDetail) return;

  // Comprobamos que el evento corresponda al servicio que estamos viendo.
  if (serviceDetail.dataset.serviceId !== service._id) return;

  document.getElementById("service-name").textContent = service.name;
  document.getElementById("service-description").textContent =
    service.description;
  document.getElementById("service-duration").textContent = service.duration;
  document.getElementById("service-price").textContent = service.price;
  document.getElementById("service-category").textContent = service.category;
  document.getElementById("service-availability").textContent =
    service.available ? "Disponible" : "No disponible";
});

socket.on("serviceDeleted", (serviceId) => {
  if (!serviceDetail) return;
  if (serviceDetail.dataset.serviceId !== serviceId) return;

  const notice = createElement(
    "p",
    "Este servicio fue eliminado. Volvé al listado para ver los servicios actuales.",
    "notice",
  );
  serviceDetail.replaceChildren(notice);
});

// ---------- Reservas ----------

const buildBookingCard = (booking) => {
  const article = document.createElement("article");
  article.id = booking._id;
  article.className = "booking-card";

  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  headerRow.append(
    createElement("th", "Servicio"),
    createElement("th", "Cantidad"),
  );
  table.append(headerRow);

  const items = Array.isArray(booking.services) ? booking.services : [];

  if (items.length === 0) {
    const row = document.createElement("tr");
    const cell = createElement("td", "Sin servicios agregados");
    cell.colSpan = 2;
    row.append(cell);
    table.append(row);
  }

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.append(
      createElement("td", item.service ? item.service.name : "Servicio eliminado"),
      createElement("td", item.quantity),
    );
    table.append(row);
  });

  article.append(
    createElement("h2", `Cliente: ${booking.clientName}`),
    createElement("p", `Email: ${booking.clientEmail}`),
    createElement("p", `Fecha: ${booking.date}`),
    createElement("p", `Hora: ${booking.time}`),
    createElement("p", `Estado: ${booking.status}`),
    table,
  );

  return article;
};

socket.on("bookingCreated", (booking) => {
  if (!bookingsList) return;
  if (document.getElementById(booking._id)) return;

  bookingsList.append(buildBookingCard(booking));
  toggleEmptyState(bookingsList, bookingsEmpty);
});

socket.on("bookingUpdated", (booking) => {
  if (!bookingsList) return;

  const article = document.getElementById(booking._id);

  if (article) {
    article.replaceWith(buildBookingCard(booking));
  } else {
    bookingsList.append(buildBookingCard(booking));
  }

  toggleEmptyState(bookingsList, bookingsEmpty);
});

socket.on("bookingDeleted", (bookingId) => {
  if (!bookingsList) return;

  const article = document.getElementById(bookingId);
  if (article) article.remove();

  toggleEmptyState(bookingsList, bookingsEmpty);
});

// ---------- Mensajes ----------

const buildMessageCard = (message) => {
  const article = document.createElement("article");
  article.id = message._id;
  article.className = "message-card";

  const meta = document.createElement("p");
  meta.className = "message-meta";
  meta.append(
    createElement("strong", message.user),
    ` · ${new Date(message.createdAt).toLocaleString("es-AR")}`,
  );

  const deleteButton = createElement("button", "Eliminar", "delete-message");
  deleteButton.type = "button";
  deleteButton.dataset.id = message._id;

  article.append(
    meta,
    createElement("p", message.message, "message-text"),
    deleteButton,
  );

  return article;
};

socket.on("messageCreated", (message) => {
  if (!messagesList) return;
  if (document.getElementById(message._id)) return;

  messagesList.append(buildMessageCard(message));
  toggleEmptyState(messagesList, messagesEmpty);
});

socket.on("messageUpdated", (message) => {
  if (!messagesList) return;

  const article = document.getElementById(message._id);
  if (article) article.replaceWith(buildMessageCard(message));
});

socket.on("messageDeleted", (messageId) => {
  if (!messagesList) return;

  const article = document.getElementById(messageId);
  if (article) article.remove();

  toggleEmptyState(messagesList, messagesEmpty);
});
