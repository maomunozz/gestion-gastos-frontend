// Importamos funciones auxiliares
import { apiFetch } from "../utils/api.js";
import { getToken } from "../utils/auth.js";

// Referencias a elementos del DOM
// Referencias a elementos del DOM
const form = document.getElementById("expenseForm");
const inputTitle = document.getElementById("expenseTitle");
const inputAmount = document.getElementById("expenseAmount");
const selectCategory = document.getElementById("expenseCategory");
const inputDate = document.getElementById("expenseDate");
const inputId = document.getElementById("expenseId");
const btnSave = document.getElementById("saveExpense");
const btnUpdate = document.getElementById("updateExpense");
const btnCancel = document.getElementById("cancelUpdate");
const expenseList = document.getElementById("expenseList");

/**
 * Función para cargar las categorías en el dropdown
 */
async function loadCategories() {
  try {
    const token = getToken();
    const categories = await apiFetch("/categories", "GET", null, token);

    selectCategory.innerHTML =
      '<option value="">Selecciona una categoría</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category._id;
      option.textContent = category.name;
      selectCategory.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar las categorías:", error.message);
    alert("No se pudieron cargar las categorías.");
  }
}

/**
 * Carga los gastos desde la API y las muestra en la lista.
 */
async function loadExpenses() {
  try {
    const token = getToken();
    const expenses = await apiFetch("/expenses", "GET", null, token);
    expenseList.innerHTML = ""; // Limpiar la lista existente

    expenses.forEach((expense) => {
      // Crear un elemento <li> para cada categoría
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${expense.title} - $${expense.amount} (${expense.category.name})</span>
        <div>
          <button id="editExpense" class="edit">Editar</button>
          <button id="deleteExpense" class="delete">Eliminar</button>
        </div>
      `;
      // Al hacer clic en "Editar" se carga la categoría en el formulario
      li.querySelector("#deleteExpense").addEventListener("click", () =>
        deleteExpense(expense._id)
      );

      // Al hacer clic en "Editar" se carga la categoría en el formulario
      li.querySelector("#editExpense").addEventListener("click", () =>
        editExpense(expense)
      );
      expenseList.appendChild(li);
    });
  } catch (error) {
    console.error("Error al cargar gastos:", error.message);
    alert("No se pudieron cargar los gastos.");
  }
}

/**
 * Guarda un nuevo gasto usando la API.
 */
async function saveExpense() {
  const title = inputTitle.value.trim();
  const amount = inputAmount.value.trim();
  const category = selectCategory.value;
  const date = inputDate.value;

  if (!title || !amount || !category) {
    return alert("Todos los campos son obligatorios.");
  }
  try {
    const token = getToken();
    await apiFetch(
      "/expenses",
      "POST",
      { title, amount, category, date },
      token
    );
    alert("Gasto guardado correctamente.");
    form.reset();
    loadExpenses();
  } catch (error) {
    console.error("Error al guardar el gasto:", error.message);
    alert("No se pudo guardar el gasto.");
  }
}

/**
 * Coloca los datos del gasto a editar en el formulario.
 * También alterna los botones para mostrar "Actualizar" en lugar de "Guardar".
 */
function editExpense(expense) {
  inputId.value = expense._id;
  inputTitle.value = expense.title;
  inputAmount.value = expense.amount;
  selectCategory.value = expense.category._id;
  // Convertir la fecha al formato YYYY-MM-DD
  inputDate.value = expense.date.split("T")[0];
  btnSave.style.display = "none";
  btnUpdate.style.display = "inline-block";
  btnCancel.style.display = "inline-block";
}

function cancelUpdate() {
  btnSave.style.display = "inline-block";
  btnUpdate.style.display = "none";
  btnCancel.style.display = "none";
  form.reset();
}

/**
 * Actualiza un gasto existente usando la API.
 */
async function updateExpense() {
  const id = inputId.value;
  const title = inputTitle.value.trim();
  const amount = inputAmount.value.trim();
  const category = selectCategory.value;
  const date = inputDate.value;

  if (!id || !title || !amount || !category) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  try {
    const token = getToken();
    await apiFetch(
      `/expenses/${id}`,
      "PUT",
      { title, amount, category, date },
      token
    );
    alert("Gasto actualizado correctamente.");
    form.reset();
    btnSave.style.display = "inline-block";
    btnUpdate.style.display = "none";
    btnCancel.style.display = "none";
    loadExpenses();
  } catch (error) {
    console.error("Error al actualizar el gasto:", error.message);
    alert("No se pudo actualizar el gasto.");
  }
}

/**
 * Elimina un gasto después de confirmar la acción.
 */
async function deleteExpense(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este gasto?")) return;

  try {
    const token = getToken();
    await apiFetch(`/expenses/${id}`, "DELETE", null, token);
    alert("Gasto eliminado correctamente.");
    loadExpenses();
  } catch (error) {
    console.error("Error al eliminar el gasto:", error.message);
    alert("No se pudo eliminar el gasto.");
  }
}

// Asignar eventos a los botones del formulario
btnSave.addEventListener("click", saveExpense);
btnUpdate.addEventListener("click", updateExpense);
btnCancel.addEventListener("click", cancelUpdate);

// Eventos iniciales
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadExpenses();
});
