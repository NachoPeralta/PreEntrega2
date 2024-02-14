const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();



// Devuelve todos los carritos
router.get("/", async (req, res) => {

    try {
        const carts = await cartManager.getCarts();
        res.status(200).send({ status: "success", cart: carts });
    } catch (error) {
        console.log(error);
        res.status(401).send({ status: "error", error: "No se pudieron cargar los carritos" });
    }
})

// Devuelve un carrito por dado su ID
router.get("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);

        if (cart) {
            console.log("**************CART*******************");            
            console.log(cart);
            console.log("**************PRODUCTS***************");
            console.log(cart.products);
            console.log("************************************");

            res.render("cart", {
                status: "success",
                cart: cart,
                products: cart.products,
                title: "Carrito",
                cartInfo: "Esto es un Carrito"
            });
        } else {
            res.status(404).send({ status: "Error", error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({ status: "Error", error: "No se pudo cargar el carrito" });
    }
});



// Crea un carrito y lo devuelve
router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(200).send({ status: "Success", cart: cart });
    } catch (error) {
        res.status(401).send({ status: "Error", error: "No se pudo crear el carrito" });
        console.log(error);
        return;
    }
})

// Agrega un producto al carrito dado su ID de carrito y ID de producto.
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        let cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            res.status(404).send({ status: "Error", error: "Carrito no encontrado" });
            return;
        }

        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            res.status(404).send({ status: "Error", error: "Producto no encontrado" });
            return;
        }

        const { quantity } = req.body;
        cart = await cartManager.addProductToCart(cart, product, quantity);
        if (!cart) {
            res.status(404).send({ status: "Error", error: "No se pudo agregar el producto al carrito" });
            return;
        }
        res.status(200).status(200).send({ status: "Success", cart: cart });

    } catch (error) {
        res.status(401).send({ status: "Error", error: "No se pudo agregar el producto al carrito" });
        console.log(error);
        return;
    }

});

// Elimina todos los productos del carrito dado su ID.
router.delete("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.emptyCart(req.params.cid);
        if (!cart) {
            res.status(404).send({ status: "Error", error: "Carrito no encontrado" });
            return;
        }
        res.status(200).send({ status: "Success", cart: cart });
    } catch (error) {
        res.status(401).send({ status: "Error", error: "No se pudo eliminar el carrito" });
        console.log(error);
        return;
    }
});

// Elimina un producto del carrito dado su ID de carrito y producto.
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
        if (!cart) {
            res.status(404).send({ status: "Error", error: "Carrito no encontrado" });
            return;
        }
        res.status(200).send({ status: "Success", cart: cart });
    } catch (error) {
        res.status(401).send({ status: "Error", error: "No se pudo eliminar el producto del carrito" });
        console.log(error);
        return;
    }
});


module.exports = router;