import { NextResponse } from 'next/server'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const productData: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(100),
).map((_, index) => ({
  name: `Dark Jean ${index + 1}`,
  contents: `{"blocks":[{"key":"f3kie","text":"This is Dark Jean ${
    index + 1
  }","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":8,"length":9,"style":"BOLD"}],"entityRanges":[],"data":{}}],"entityMap":{}}`,
  category_id: 1,
  image_url: `https://picsum.photos/id/${
    (index + 1) % 10 === 0 ? 10 : (index + 1) % 10
  }/250/150/`,
  price: Math.random() * (100000 - 20000) + 20000,
}))

async function main() {
  await prisma.products.deleteMany({})

  for (const p of productData) {
    const product = await prisma.products.create({
      data: p,
    })
    console.log('product???', `${product.id}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
