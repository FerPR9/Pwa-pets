let db;
let dbReady = false; // Variable para verificar si la base de datos está lista

// Abrir base de datos
const request = indexedDB.open("PetDatabase", 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  const objectStore = db.createObjectStore("pets", { keyPath: "id", autoIncrement: true });
  objectStore.createIndex("nombre", "nombre", { unique: false });
};

request.onsuccess = (event) => {
  db = event.target.result;
  dbReady = true; // La base de datos está lista
  console.log("Base de datos abierta con éxito");
};

request.onerror = (event) => {
  console.error("Error al abrir la base de datos:", event.target.errorCode);
};

// Agregar mascota
function addPet(pet) {
  if (!dbReady) {
    console.error("La base de datos no está lista.");
    return;
  }

  const transaction = db.transaction(["pets"], "readwrite");
  const objectStore = transaction.objectStore("pets");
  const request = objectStore.add(pet);

  request.onsuccess = () => {
    console.log("Mascota registrada:", pet);
  };

  transaction.onerror = (event) => {
    console.error("Error al guardar mascota:", event.target.errorCode);
  };
}

// Cargar mascotas
function loadPets() {
  if (!dbReady) {
    console.error("La base de datos no está lista.");
    return;
  }

  const transaction = db.transaction(["pets"], "readonly");
  const objectStore = transaction.objectStore("pets");
  const petTable = document.getElementById("petTable");
  petTable.innerHTML = ""; // Limpiar tabla antes de cargar los datos

  const cursorRequest = objectStore.openCursor();

  cursorRequest.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cursor.value.nombre}</td>
        <td>${cursor.value.especie}</td>
        <td>${cursor.value.descripcion}</td>
      `;
      petTable.appendChild(row);
      cursor.continue();
    } else {
      console.log("No hay más mascotas.");
    }
  };

  cursorRequest.onerror = (event) => {
    console.error("Error al cargar mascotas:", event.target.errorCode);
  };

  transaction.onerror = (event) => {
    console.error("Error al obtener mascotas:", event.target.errorCode);
  };
}
