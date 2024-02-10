const CartModel = require("../../models/cart.model.js");

class CartManager {
    async createCart() {
        try {
            const newCart = CartModel({products: []});
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear carrito", error);
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id);
            if (!cart) {
                console.log("Carrito no encontrado");
                return null;
            }
            return cart;
        } catch (error) {
            console.log("Error al traer el carrito", error);
        }
    }

    async updateCart(id, cart) {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate(id, cart, { new: true });
            return updatedCart;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteCart(id) {
        try {
            const deletedCart = await CartModel.findByIdAndDelete(id);
            return deletedCart;
        } catch (error) {
            console.log(error);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                console.log("Carrito no encontrado");
                return null;
            }
            
            const productExist = cart.products.find(product => product.product.toString() === productId.id);
            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({
                    product: productId,
                    quantity: quantity
                });
            }

            cart.markModified('products');
            await cart.save();
            return cart;

        } catch (error) {
            console.log("Error al agregar producto al carrito",error);
        }
    }

    async getCarts() {
        try {
            const carts = await CartModel.find();
            return carts;
        } catch (error) {
            console.log("Error al traer los carritos", error);
        }
    }
}

module.exports = CartManager;