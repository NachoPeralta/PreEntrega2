const socket = io();
// const ProductManager = require("../dao/db/product-manager-db.js");
// const productManager = new ProductManager();

// renderProducts(productManager.getProducts());

// const renderProducts = (data) => {
    
//     console.log(data);

//     const table = document.getElementById("productsContainer");
//     const tableHeader = document.getElementById("productsHeader");
//     const tableBody = document.getElementById("productsBody");


//     table.innerHTML = "";
//     tableHeader.innerHTML = "";
//     tableBody.innerHTML = "";

//     const row = document.createElement("tr");
//     row.className = "table-header-row";
//     row.style.backgroundColor = "black";
//     row.style.color = "white";
//     row.style.fontWeight = "bold";
//     row.style.fontSize = "20px";
//     row.style.textAlign = "left";

//     const cellCode = document.createElement("th");
//     cellCode.textContent = "Código";
//     const cellTitle = document.createElement("th");
//     cellTitle.textContent = "Nombre";
//     const cellDescription = document.createElement("th");
//     cellDescription.textContent = "Descripcion";
//     const cellStock = document.createElement("th");
//     cellStock.textContent = "Stock";
//     const cellPrice = document.createElement("th");
//     cellPrice.textContent = "Precio";
//     const cellActions = document.createElement("th");
//     cellActions.textContent = "";

//     row.appendChild(cellCode);
//     row.appendChild(cellTitle);
//     row.appendChild(cellDescription);
//     row.appendChild(cellStock);
//     row.appendChild(cellPrice);
//     row.appendChild(cellActions);

//     tableHeader.appendChild(row);
//     table.appendChild(tableHeader);

//     data.forEach((product) => {
//         const row = document.createElement("tr");
//         row.className = "table-row";
//         row.style.border = "1";

//         const cellCode = document.createElement("td");
//         cellCode.textContent = product.code;

//         const cellTitle = document.createElement("td");
//         cellTitle.textContent = product.title;

//         const cellDescription = document.createElement("td");
//         cellDescription.textContent = product.description;

//         const cellStock = document.createElement("td");
//         cellStock.textContent = product.stock;

//         const cellPrice = document.createElement("td");
//         cellPrice.textContent = product.price;

//         const cellActions = document.createElement("td");
//         const deleteButton = document.createElement("button");
//         deleteButton.className = "btn btn-danger";
//         deleteButton.textContent = "Eliminar";
//         deleteButton.onclick = () => deleteProduct(product.id);
//         cellActions.appendChild(deleteButton);

//         row.appendChild(cellCode);
//         row.appendChild(cellTitle);
//         row.appendChild(cellDescription);
//         row.appendChild(cellStock);
//         row.appendChild(cellPrice);
//         row.appendChild(cellActions);

//         tableBody.appendChild(row);
//     });
//     table.appendChild(tableBody);
// };

// const deleteProduct = (id) => {
//     socket.emit("deleteProduct", id);
// }

// document.getElementById("btnSend").addEventListener("click", () => {
//     addProduct();
// });

// const addProduct = () => {
//     const product = {
//         title: document.getElementById("title").value,
//         description: document.getElementById("description").value,
//         price: document.getElementById("price").value,
//         img: document.getElementById("img").value,
//         code: document.getElementById("code").value,
//         stock: document.getElementById("stock").value,
//         category: document.getElementById("category").value,
//         status: document.getElementById("status").value === "true"
//     };

//     socket.emit("addProduct", product);
// };
//SE COMENTA EL CÓDIGO ANTERIOR YA QUE NO SERÁ EVALUADO EN ESTE DESAFÍO


let user; 
const chatBox = document.getElementById("chatBox");

Swal.fire({
    title: "Ingresa tu Nombre", 
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat", 
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre para continuar"
    }, 
    allowOutsideClick: false,
}).then( result => {
    user = result.value;
})


chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("message", {user: user, message: chatBox.value}); 
            chatBox.value = "";
        }
    }
})

socket.on("message", data => {
    let log = document.getElementById("messagesLogs");
    let messages = "";

    data.forEach( message => {
        messages = messages + `${message.user} dice: ${message.message} <br>`
    })

    log.innerHTML = messages;
})