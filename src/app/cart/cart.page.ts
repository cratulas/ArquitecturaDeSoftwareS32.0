import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: any[] = [];
  products: any[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  async loadCart() {
    try {
      const cart = await this.cartService.getCart();
      if (cart && cart['items']) {
        this.cartItems = cart['items'];
        await this.loadProductDetails();
        this.calculateTotal();
      }
    } catch (error) {
      console.error('Error loading cart', error);
    }
  }

  async loadProductDetails() {
    try {
      const allProducts = await this.productService.getProducts();
      this.products = allProducts.filter(product => this.cartItems.some(item => item.productId === product.id));
    } catch (error) {
      console.error('Error loading product details', error);
    }
  }

  getProductById(productId: string) {
    return this.products.find(product => product.id === productId);
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => {
      const product = this.getProductById(item.productId);
      return acc + (product ? product.precio * item.quantity : 0);
    }, 0);
  }

  async clearCart() {
    try {
      await this.cartService.clearCart();
      this.cartItems = [];
      this.products = [];
      this.total = 0;
    } catch (error) {
      console.error('Error limpiando el carro', error);
    }
  }

  goToPayment() {
    this.router.navigate(['/payment']);
  }
}
