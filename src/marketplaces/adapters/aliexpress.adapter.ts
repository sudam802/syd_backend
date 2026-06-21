import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { ProductResult } from '../interfaces/product-result.interface';

@Injectable()
export class AliExpressAdapter {
  private readonly appKey = process.env.ALI_APP_KEY!;
  private readonly appSecret = process.env.ALI_APP_SECRET!;

  async search(keyword: string): Promise<ProductResult[]> {
    const params = {
      method: 'aliexpress.affiliate.product.query',
      app_key: this.appKey,
      timestamp: this.getTimestamp(),
      format: 'json',
      v: '2.0',
      sign_method: 'md5',

      keywords: keyword,
      target_currency: 'USD',
      target_language: 'EN',
      ship_to_country: 'US',
      page_no: '1',
      page_size: '20',
    };

    const sign = this.generateSign(params);

    const response = await axios.get(
      'https://api.taobao.com/router/rest',
      {
        params: {
          ...params,
          sign,
        },
      },
    );

    console.log(response.data);

    return this.normalize(response.data);
  }

  private getTimestamp() {
    return new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
  }

  private generateSign(params: Record<string, string>) {
    const sortedKeys = Object.keys(params).sort();

    let signString = this.appSecret;

    for (const key of sortedKeys) {
      signString += key + params[key];
    }

    signString += this.appSecret;

    return crypto
      .createHash('md5')
      .update(signString)
      .digest('hex')
      .toUpperCase();
  }

  private normalize(data: any): ProductResult[] {
    const products =
      data?.aliexpress_affiliate_product_query_response
        ?.resp_result?.result?.products?.product || [];

    return products.map((product: any) => ({
      title: product.product_title,
      price: Number(product.target_sale_price),
      currency: 'USD',
      imageUrl: product.product_main_image_url,
      productUrl: product.product_detail_url,
      store: 'AliExpress',
      shippingCost: 0,
      rating: Number(product.evaluate_rate || 0),
    }));
  }
}