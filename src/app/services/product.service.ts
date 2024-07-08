import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private firestore: Firestore) {}

  async addProduct(nombre: string, precio: number, idProveedor: string, fotoUrl: string) {
    try {
      const productRef = collection(this.firestore, 'productos');
      await addDoc(productRef, { nombre, precio, idProveedor, fotoUrl });
    } catch (error) {
      console.error('Error adding product: ', error);
    }
  }

  async getProducts() {
    try {
      const productRef = collection(this.firestore, 'productos');
      const productSnapshot = await getDocs(productRef);
      return productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting products: ', error);
      return [];
    }
  }
}
