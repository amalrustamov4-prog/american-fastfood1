import { prisma } from './prisma';
import { CAFE_SETTINGS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from './initialData';
import { hashPassword } from './auth';

export async function ensureDatabaseSeeded() {
  try {
    // 1. Check if admin exists
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    if (adminCount === 0) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin_secure_password_2026';
      const passwordHash = await hashPassword(defaultPassword);
      await prisma.user.create({
        data: {
          username: process.env.ADMIN_USERNAME || 'admin',
          name: 'Главный Администратор',
          passwordHash,
          role: 'ADMIN',
          email: 'admin@american-fastfood.uz',
          phone: '+998908220101'
        }
      });
      console.log('✅ Admin user created');
    }

    // 2. Check if categories exist
    const categoryCount = await prisma.category.count();
    if (categoryCount === 0) {
      for (let i = 0; i < INITIAL_CATEGORIES.length; i++) {
        const cat = INITIAL_CATEGORIES[i];
        if (cat.id === 'all') continue;
        await prisma.category.upsert({
          where: { id: cat.id },
          update: { name: cat.name, icon: cat.icon, sortOrder: i },
          create: { id: cat.id, name: cat.name, icon: cat.icon, sortOrder: i }
        });
      }
      console.log('✅ Categories seeded');
    }

    // 3. Check if products exist
    const productCount = await prisma.product.count();
    if (productCount === 0) {
      for (const prod of INITIAL_PRODUCTS) {
        // Ensure category exists
        const catExists = await prisma.category.findUnique({ where: { id: prod.category } });
        if (!catExists) {
          await prisma.category.create({
            data: { id: prod.category, name: prod.category, sortOrder: 99 }
          });
        }

        await prisma.product.upsert({
          where: { id: prod.id },
          update: {},
          create: {
            id: prod.id,
            name: prod.name,
            categoryId: prod.category,
            price: prod.price,
            oldPrice: prod.oldPrice,
            weight: prod.weight || null,
            calories: prod.calories || null,
            image: prod.image,
            description: prod.description || null,
            inStock: prod.inStock,
            optionsJson: JSON.stringify(prod.options || [])
          }
        });
      }
      console.log(`✅ ${INITIAL_PRODUCTS.length} Products seeded`);
    }

    // 4. Check if settings exist
    const settingsCount = await prisma.cafeSettings.count();
    if (settingsCount === 0) {
      await prisma.cafeSettings.create({
        data: {
          id: 'default',
          cafeName: CAFE_SETTINGS.name,
          phone: CAFE_SETTINGS.phone,
          address: CAFE_SETTINGS.address,
          deliveryFee: CAFE_SETTINGS.deliveryFee,
          freeDeliveryThreshold: CAFE_SETTINGS.freeDeliveryThreshold,
          minOrderAmount: 30000,
          isOpen: true,
          workHours: CAFE_SETTINGS.workHours,
          bannerText: 'Бесплатная доставка от 150 000 сум! 🔥'
        }
      });
      console.log('✅ Cafe settings seeded');
    }

    // 5. Seed initial promo codes
    const promoCount = await prisma.promoCode.count();
    if (promoCount === 0) {
      await prisma.promoCode.createMany({
        data: [
          { code: 'AMERICAN10', discountPercent: 10, discountAmount: 0, minOrder: 50000, isActive: true },
          { code: 'BURGERVIP', discountPercent: 15, discountAmount: 0, minOrder: 100000, isActive: true },
          { code: 'CHEEZ20', discountPercent: 20, discountAmount: 0, minOrder: 120000, isActive: true }
        ]
      });
      console.log('✅ Promo codes seeded');
    }

    // Reviews and employees are NOT auto-seeded.
    // Real orders come from real customers.
    // Real reviews go through admin moderation.
    // Couriers/employees are registered manually by admin.

  } catch (error) {
    console.error('Error during database seed:', error);
  }
}
