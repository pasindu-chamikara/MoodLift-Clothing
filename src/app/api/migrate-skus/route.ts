import { NextResponse } from 'next/server';
import { dbService, productService } from '@/services/db';

export async function GET() {
  try {
    const products = await productService.getProducts();
    let updatedCount = 0;

    for (const product of products) {
      if (!product.sku || product.sku.trim() === '') {
        const title = product.title || "";
        const words = title.trim().split(/\s+/);
        let prefix = "";
        if (words.length >= 2) {
          prefix = `${words[0].substring(0, 3).toUpperCase()}-${words[1].substring(0, 3).toUpperCase()}`;
        } else if (words.length === 1 && words[0].length > 0) {
          prefix = words[0].substring(0, 3).toUpperCase();
        } else {
          prefix = "PRD";
        }
        const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
        const newSku = `${prefix}-${randomNum}`;
        
        await dbService.updateDocument('products', product.id!, { sku: newSku });
        updatedCount++;
      }
    }

    return NextResponse.json({ success: true, message: `Updated ${updatedCount} products with new SKUs.` });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
