// In-App Purchase utilities

import {
  initConnection,
  endConnection,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  requestPurchase,
  getProducts,
  Purchase,
  PurchaseError,
} from 'react-native-iap';

const PREMIUM_SKU = 'cycletrack_premium';

let purchaseUpdateSubscription: any = null;
let purchaseErrorSubscription: any = null;

export const initIAP = async () => {
  try {
    await initConnection();
    console.log('IAP connection established');

    // Set up purchase listeners
    purchaseUpdateSubscription = purchaseUpdatedListener((purchase: Purchase) => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        // Verify receipt with your server if needed
        finishTransaction({ purchase, isConsumable: false });
        console.log('Purchase successful:', purchase);
      }
    });

    purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
      console.warn('Purchase error:', error);
    });

    // Get product info
    await getProducts({ skus: [PREMIUM_SKU] });
  } catch (error) {
    console.error('Error initializing IAP:', error);
  }
};

export const purchasePremium = async (): Promise<boolean> => {
  try {
    await requestPurchase({ sku: PREMIUM_SKU });
    return true;
  } catch (error) {
    console.error('Purchase failed:', error);
    return false;
  }
};

export const cleanupIAP = () => {
  if (purchaseUpdateSubscription) {
    purchaseUpdateSubscription.remove();
    purchaseUpdateSubscription = null;
  }

  if (purchaseErrorSubscription) {
    purchaseErrorSubscription.remove();
    purchaseErrorSubscription = null;
  }

  endConnection();
};
