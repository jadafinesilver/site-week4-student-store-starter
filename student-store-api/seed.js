const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')
const path = require('path')

async function seed() {
  try {
    console.log('🌱 Seeding database...\n')

    // Clear existing data (order matters due to relations)
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()

    // Load JSON data
    const productsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, './data/products.json'), 'utf8')
    )

    const ordersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, './data/orders.json'), 'utf8')
    )

    // Seed products
    for (const product of productsData.products) {
      await prisma.product.create({
        data: {
          product_id: product.product_id,  
          name: product.name,
          description: Array.isArray(product.description)
            ? product.description
            : [product.description],  
          price: product.price,
          image_url: product.image_url,
          category: product.category,
        },
      })
    }

    // Seed orders and orderItems
    for (const order of ordersData.orders) {
      const createdOrder = await prisma.order.create({
        data: {
          customer_id: order.customer_id,
          totalPrice: order.totalPrice,
          status: order.status,
          createdAt: new Date(order.createdAt),
          orderItems: {
            create: (order.orderItems || []).map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      })

      console.log(`✅ Created order #${createdOrder.order_id}`)
    }

    console.log('\n🎉 Seeding complete!')
  } catch (err) {
    console.error('❌ Error seeding:', err)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
