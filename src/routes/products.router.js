
const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();


// Devuelve todos los productos o la cantidad de productos que se le pase como limit
router.get("/", async (req, res) => {
    try {
        let limit = parseInt(req.query.limit);
        let page = req.query.page || 1;
        let sort = req.query.sort;
        let query = req.query.query;

        const products = await productManager.getProducts();

        if (limit) {
            res.status(200).send({ status: "success", product: products.slice(0, limit) });
        } else {
            res.status(200).send({ status: "success", product: products });
        }
    } catch (error) {
        console.log("Error al traer los productos", error);
        res.status(401).send({ status: "error", error: "Error al traer los productos" });
    }

})

// Devuelve el producto dado un ID
router.get("/:pid", async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);

    if (product) {
        res.status(200).send({ status: "Success", product: product });
    } else {
        res.status(404).send({ message: "Product not found" })
    }
})

// Crea un producto nuevo y lo devuelve
router.post("/", async (req, res) => {
    try {
        const product = req.body;

        console.log("Producto Nuevo:" + product);

        const newProduct = await productManager.addProduct(product);
        if (!newProduct) {
            res.status(401).send({ status: "Error", error: "No se pudo agregar el producto, verifique los datos ingresados" });
            return;
        }
        res.status(200).send({ status: "Success", product: { newProduct } });

    } catch (error) {
        res.status(401).send({ status: "Error", error: "No se pudo agregar el producto" });
        console.log(error);
        return;
    }
})


// Actualiza un producto y lo devuelve
router.put("/:pid", async (req, res) => {
    try {
        const product = req.body;
        const updatedProduct = await productManager.updateProduct(req.params.pid, product);
        if (!updatedProduct) {
            res.status(404).send({ status: "Error", error: "Producto no encontrado" });
            return;
        }
        res.status(200).send({ status: "Success", product: { updatedProduct } });

    } catch (error) {
        res.status(401).send({ status: "Error", error: "No se pudo actualizar el producto" });
        console.log(error);
        return;
    }
})

// Elimina un producto y devuelve la lista completa de productos
router.delete("/:pid", async (req, res) => {
    try {
        const products = await productManager.deleteProduct(req.params.pid);
        if (!products) {
            res.status(404).send({ status: "Error", error: "Producto no encontrado" });
            return;
        }
        res.status(200).send({ status: "Success", products: products });
    } catch (error) {
        res.status(401).send({ status: "Error", error: "No se pudo eliminar el producto" });
        console.log(error);
        return;
    }
})

module.exports = router;