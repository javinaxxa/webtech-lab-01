
const books = [
  { id: 1, title: "Fourth Wing", author: "Rebecca Yarros", genre: "fantasy" },
  { id: 2, title: "A Court of Thorns and Roses", author: "Sarah J. Maas", genre: "fantasy" },
  { id: 3, title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "fantasy" },
  { id: 4, title: "The Hating Game", author: "Sally Thorne", genre: "romance" },
  { id: 5, title: "People We Meet on Vacation", author: "Emily Henry", genre: "romance" },
  { id: 6, title: "Beach Read", author: "Emily Henry", genre: "romance" },
];

let nextBookId = books.length + 1;
let activeGenre = "all";

const libraryList = document.querySelector("#library-list");
const libraryEmpty = document.querySelector("#library-empty");
const bookSearch = document.querySelector("#book-search");
const genreFilters = document.querySelector(".genre-filters");
const addBookForm = document.querySelector("#add-book-form");


function createBookElement(book) {
  const li = document.createElement("li");
  li.className = "book-item";
  li.dataset.id = book.id;
  li.dataset.genre = book.genre;

  const info = document.createElement("div");
  info.className = "book-info";

  const title = document.createElement("p");
  title.className = "book-title";
  title.textContent = book.title;

  const meta = document.createElement("p");
  meta.className = "book-meta";
  meta.textContent = `${book.author} · ${book.genre}`;

  info.append(title, meta);

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "book-toggle";
  toggleBtn.setAttribute("aria-pressed", "false");
  toggleBtn.textContent = "Mark as read";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "book-remove";
  removeBtn.setAttribute("aria-label", `Remove ${book.title}`);
  removeBtn.textContent = "✕";

  li.append(info, toggleBtn, removeBtn);
  return li;
}


function renderBooks() {
  const query = bookSearch.value.trim().toLowerCase();

  const filtered = books.filter((book) => {
    const matchesGenre = activeGenre === "all" || book.genre === activeGenre;
    const matchesQuery =
      query === "" ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);
    return matchesGenre && matchesQuery;
  });

  libraryList.replaceChildren();
  filtered.forEach((book) => {
    libraryList.append(createBookElement(book));
  });

  libraryEmpty.hidden = filtered.length > 0;
}


bookSearch.addEventListener("input", renderBooks);

genreFilters.addEventListener("click", (event) => {
  const button = event.target.closest(".genre-btn");
  if (!button) return;

  activeGenre = button.dataset.genre;

  genreFilters.querySelectorAll(".genre-btn").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn === button));
  });

  renderBooks();
});


addBookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const titleInput = document.querySelector("#book-title");
  const authorInput = document.querySelector("#book-author");
  const genreSelect = document.querySelector("#book-genre");
  const titleError = document.querySelector("#book-title-error");
  const authorError = document.querySelector("#book-author-error");

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  titleError.textContent = title === "" ? "Please enter a title." : "";
  authorError.textContent = author === "" ? "Please enter an author." : "";

  if (title === "" || author === "") return;

  books.push({
    id: nextBookId++,
    title,
    author,
    genre: genreSelect.value,
  });

  addBookForm.reset();
  renderBooks();
});


libraryList.addEventListener("click", (event) => {
  const item = event.target.closest(".book-item");
  if (!item) return;

  const id = Number(item.dataset.id);

  if (event.target.closest(".book-toggle")) {
    const button = event.target.closest(".book-toggle");
    const isRead = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!isRead));
    button.textContent = isRead ? "Mark as read" : "Mark as unread";
    item.classList.toggle("is-read", !isRead);
  }

  if (event.target.closest(".book-remove")) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) books.splice(index, 1);
    item.remove();
    libraryEmpty.hidden = libraryList.children.length > 0;
  }
});

renderBooks();


const contactForm = document.querySelector("#contact-form");
const confirmation = document.querySelector("#contact-confirmation");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setError(inputId, message) {
  const errorEl = document.querySelector(`#${inputId}-error`);
  errorEl.textContent = message;
}

function validateContactForm() {
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();

  let isValid = true;

  if (name === "") {
    setError("name", "Please enter your name.");
    isValid = false;
  } else {
    setError("name", "");
  }

  if (email === "") {
    setError("email", "Please enter your email address.");
    isValid = false;
  } else if (!emailPattern.test(email)) {
    setError("email", "That doesn't look like a valid email address.");
    isValid = false;
  } else {
    setError("email", "");
  }

  if (message === "") {
    setError("message", "Please write a short message.");
    isValid = false;
  } else if (message.length < 10) {
    setError("message", "Please write at least 10 characters.");
    isValid = false;
  } else {
    setError("message", "");
  }

  return isValid;
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  confirmation.hidden = true;

  if (!validateContactForm()) return;

  confirmation.textContent = "Thanks! Your message has been noted — there's no server behind this form yet, but it's ready for one.";
  confirmation.hidden = false;
  contactForm.reset();
});

// Clear a field's error message as soon as it's fixed, without
// waiting for another submit.
["name", "email", "message"].forEach((fieldId) => {
  const field = document.querySelector(`#${fieldId}`);
  field.addEventListener("input", () => {
    const errorEl = document.querySelector(`#${fieldId}-error`);
    if (errorEl.textContent === "") return;
    validateContactForm();
  });
});



const themeToggle = document.querySelector("#theme-toggle");

themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("theme-dark");
  const isDark = document.documentElement.classList.contains("theme-dark");
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.textContent = isDark ? " Light mode" : "Dark mode";
});
