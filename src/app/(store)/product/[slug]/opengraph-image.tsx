import { ImageResponse } from 'next/server'
import colors from 'tailwindcss/colors'

import { api } from '@/data/api'
import { Product } from '@/data/types/product'
import { env } from '@/env'
import Image from 'next/image'

export const runtime = 'edge'

export const alt = ''

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

async function getProduct(slug: string): Promise<Product> {
  const response = await api(`/products/${slug}`, {
    next: {
      revalidate: 60, // 1 minutes
    },
  })

  const product = await response.json()

  return product
}

export default async function OgImage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug)

  const productImageURL = new URL(product.image, env.APP_URL).toString()

  return new ImageResponse(
    (
      <div
        style={{
          background: colors.zinc[950],
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Image
          src={productImageURL}
          alt=""
          width={1920}
          height={1920}
          quality={100}
          priority
          style={{ width: '100%' }}
        />
      </div>
    ),
    {
      ...size,
    },
  )
}
