const API_URL = "http://localhost:3000/api/v1";

const statusLine = document.querySelector("#price-list-status");
const table = document.querySelector("#price-list-table");
const rows = document.querySelector("#price-list-rows");
const lookupForm = document.querySelector("#service-lookup-form");
const lookupInput = document.querySelector("#service-id");
const lookupResult = document.querySelector("#service-lookup-result");

const money = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0
});

function formatPrice(price) {
  return money.format(Number(price));
}

function clear(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function cell(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}

function drawServices(services) {
  clear(rows);

  services.forEach(function (service) {
    const tr = document.createElement("tr");
    tr.appendChild(cell(service.name));
    tr.appendChild(cell(formatPrice(service.price)));
    rows.appendChild(tr);
  });

  table.hidden = false;
  statusLine.textContent = "";
  statusLine.hidden = true;
}

function showProblem(messages) {
  table.hidden = true;
  statusLine.hidden = false;
  statusLine.textContent = messages.join(" ");
}

async function loadServices() {
  try {
    const response = await fetch(`${API_URL}/services`);

    if (!response.ok) {
      const body = await response.json();
      showProblem(body.errors || ["The price list could not be read."]);
      return;
    }

    const services = await response.json();
    drawServices(services);
  } catch (error) {
    showProblem(["The price list is not available right now. The shop's server may be offline."]);
  }
}

async function lookUpService(id) {
  lookupResult.textContent = "Looking it up…";

  try {
    const response = await fetch(`${API_URL}/services/${id}`);
    const body = await response.json();

    if (!response.ok) {
      lookupResult.textContent = (body.errors || ["That service could not be read."]).join(" ");
      return;
    }

    const times = body.charged_on_repairs === 1 ? "time" : "times";
    lookupResult.textContent =
      `${body.name} — ${formatPrice(body.price)} — charged on ${body.charged_on_repairs} ${times}.`;
  } catch (error) {
    lookupResult.textContent = "The shop's server is not answering right now.";
  }
}

lookupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  lookUpService(lookupInput.value);
});

loadServices();
