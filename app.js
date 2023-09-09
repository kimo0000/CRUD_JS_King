const alertEl = document.querySelector(".alert");
const formEl = document.querySelector("form");
const btnSubmit = document.querySelector(".btn_submit");
const inputEl = document.querySelector(".inp");
const result = document.querySelector(".result");
const list = document.querySelector(".list");
const btnClear = document.querySelector(".btn_clear");

let editItem;
let editID = "";
let editFlag = false;

formEl.addEventListener("submit", addItemTopage);
btnClear.addEventListener("click", removeAllItemToPage);

function setUpItem() {
  let arrayItems = getLocalStorage();
  if (arrayItems.length > 0) {
    arrayItems.forEach((item) => {
      getListItem(item.id, item.value);
      result.classList.add("show_container");
    });
  }
}

setUpItem();

function getListItem(id, value) {
  const el = document.createElement("article");
  el.classList.add("items");
  el.id = id;
  el.innerHTML = ` <span class="item">${value}</span>
                    <div class="icons">
                        <i class="fa-solid fa-square-check checked"></i>
                        <i class="fa-solid fa-pen-to-square edit"></i>
                        <i class="fa-solid fa-trash delete"></i>
                   </div>`;

  const delItem = el.querySelector(".delete");
  const editItem = el.querySelector(".edit");

  delItem.addEventListener("click", deleteItem);
  editItem.addEventListener("click", edittItem);

  list.appendChild(el);
}

function addItemTopage(e) {
  e.preventDefault();

  let value = inputEl.value;
  let id = Date.now().toString();

  if (value && !editFlag) {
    getListItem(id, value);

    result.classList.add("show_container");
    displayItem("Item Added To Page", "success");
    addItemToLocal(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editItem.innerText = value;
    displayItem("Item Edited Successefuly", "success");
    editElFromLocal(editID, value);
    setBackToDefault();
  } else {
    displayItem("Please Insert item !", "danger");
  }
}

function setBackToDefault() {
  inputEl.value = "";
  editItem;
  editFlag = false;
  editID = "";
  btnSubmit.innerText = "Submit";
}

function removeAllItemToPage() {
  const item = document.querySelectorAll(".items");
  item.forEach((item) => {
    list.removeChild(item);
    if (list.children.length === 0) {
      result.classList.remove("show_container");
    }

    displayItem("list Of Item Is Empty !", "danger");
    localStorage.clear();
  });
}

function displayItem(text, action) {
  alertEl.innerText = text;
  alertEl.classList.add(action);

  setTimeout(() => {
    alertEl.innerText = "";
    alertEl.classList.remove(action);
  }, 1500);
}

function deleteItem(e) {
  const element = e.target.parentElement.parentElement;
  const id = element.id;
  list.removeChild(element);
  displayItem("Item Deleted Successfuly !", "danger");
  removeElFromLocal(id);
  if (list.children.length === 0) {
    result.classList.remove("show_container");
  }
}

function edittItem(e) {
  editFlag = true;
  const element = e.target.parentElement.parentElement;
  editID = element.id;
  editItem = e.target.parentElement.previousElementSibling;
  console.log(editID, editItem, editFlag);
  inputEl.value = editItem.innerText;
  btnSubmit.innerText = "Edit";
}

function addItemToLocal(id, value) {
  const obj = { id, value };
  let arrayItems = getLocalStorage();
  arrayItems.push(obj);
  localStorage.setItem("list", JSON.stringify(arrayItems));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeElFromLocal(id) {
  let arrayItems = getLocalStorage();
  arrayItems = arrayItems.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(arrayItems));
}

function editElFromLocal(id, value) {
  let arrayItems = getLocalStorage();
  arrayItems = arrayItems.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });

  localStorage.setItem("list", JSON.stringify(arrayItems));
}
