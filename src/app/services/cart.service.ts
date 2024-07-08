import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  private getUserId(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.uid : null;
  }

  async getCart() {
    const userId = this.getUserId();
    if (!userId) throw new Error('User not authenticated');

    const cartRef = doc(this.firestore, 'carritos', userId);
    const cartSnapshot = await getDoc(cartRef);

    return cartSnapshot.exists() ? cartSnapshot.data() : { userId, items: [] };
  }

  async addToCart(productId: string, quantity: number) {
    const userId = this.getUserId();
    if (!userId) {
      await this.notificationService.showAlert('Please log in to add products to the cart.');
      this.router.navigate(['/login']);
      return;
    }

    const cartRef = doc(this.firestore, 'carritos', userId);
    const cartSnapshot = await getDoc(cartRef);
    const cartData = cartSnapshot.exists() ? cartSnapshot.data() : { userId, items: [] };

    const items = cartData['items'] as any[];
    const existingItemIndex = items.findIndex((item: any) => item.productId === productId);
    if (existingItemIndex >= 0) {
      items[existingItemIndex].quantity += quantity;
    } else {
      items.push({ productId, quantity });
    }

    await setDoc(cartRef, cartData);

    await this.notificationService.showAlert('Producto agregado exitosamente.');
  }

  async clearCart() {
    const userId = this.getUserId();
    if (!userId) throw new Error('El usuario no está autenticado');

    const cartRef = doc(this.firestore, 'carritos', userId);
    await setDoc(cartRef, { userId, items: [] });
  }
}
