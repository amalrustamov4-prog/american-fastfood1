import { prisma } from './prisma';
import { CAFE_SETTINGS, INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_REVIEWS } from './initialData';
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

    // 6. Seed initial reviews
    const reviewsCount = await prisma.review.count();
    if (reviewsCount === 0) {
      for (const rev of INITIAL_REVIEWS) {
        await prisma.review.create({
          data: {
            author: rev.author,
            avatar: rev.avatar,
            rating: rev.rating,
            text: rev.text,
            date: rev.date,
            status: 'approved'
          }
        });
      }
      console.log('✅ Reviews seeded');
    }

    // 7. Seed initial performers & couriers (from Yandex Fleet)
    const employeeCount = await prisma.employee.count();
    if (employeeCount === 0) {
      const initialEmployees = [
        {
          lastName: 'Xamrayev',
          firstName: 'Ogabek',
          middleName: 'Alisher o\'g\'li',
          phone: '+998901234567',
          role: 'kuryer',
          courierType: 'avto',
          status: 'busy',
          hasGps: false,
          balance: 43981.88,
          vehiclePlate: '30J976RB',
          vehicleModel: 'Chevrolet Spark',
          lat: 39.6582,
          lng: 66.9620,
          completedOrdersCount: 24,
          workCondition: '1,4% (Standart)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
        },
        {
          lastName: 'Annaqulov',
          firstName: 'Bekzod',
          middleName: 'O\'tkir o\'g\'li',
          phone: '+998902345678',
          role: 'kuryer',
          courierType: 'avto',
          status: 'busy',
          hasGps: false,
          balance: 19235.36,
          vehiclePlate: '30O416SB',
          vehicleModel: 'Chevrolet Nexia 3',
          lat: 39.6450,
          lng: 66.9530,
          completedOrdersCount: 18,
          workCondition: '1,4% (Standart)',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80'
        },
        {
          lastName: 'Abdumajitov',
          firstName: 'Mirzohid',
          middleName: 'Nodir o\'g\'li',
          phone: '+998903456789',
          role: 'kuryer',
          courierType: 'avto',
          status: 'busy',
          hasGps: false,
          balance: 14722.66,
          vehiclePlate: '30K120KA',
          vehicleModel: 'Chevrolet Cobalt',
          lat: 39.6620,
          lng: 66.9740,
          completedOrdersCount: 12,
          workCondition: '1,4% (Standart)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
        },
        {
          lastName: 'Xoliqov',
          firstName: 'Ogabek',
          middleName: 'Bobir o\'g\'li',
          phone: '+998904567890',
          role: 'kuryer',
          courierType: 'moto',
          status: 'busy',
          hasGps: false,
          balance: 6343.96,
          vehiclePlate: '30A251OB',
          vehicleModel: 'Honda Moto',
          lat: 39.6515,
          lng: 66.9410,
          completedOrdersCount: 7,
          workCondition: '1,4% (Standart)',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
        },
        {
          lastName: 'Fozilov',
          firstName: 'Bobonur',
          middleName: 'Azamat o\'g\'li',
          phone: '+998905678901',
          role: 'kuryer',
          courierType: 'avto',
          status: 'busy',
          hasGps: false,
          balance: 20558.23,
          vehiclePlate: '30Z424RA',
          vehicleModel: 'Chevrolet Lacetti',
          lat: 39.6380,
          lng: 66.9680,
          completedOrdersCount: 15,
          workCondition: '1,4% (Standart)',
          avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80'
        },
        {
          lastName: 'Hasanov',
          firstName: 'Sunnatjon',
          middleName: 'Ilhom o\'g\'li',
          phone: '+998906789012',
          role: 'kuryer',
          courierType: 'avto',
          status: 'busy',
          hasGps: false,
          balance: 95701.88,
          vehiclePlate: '30E832SB',
          vehicleModel: 'Chevrolet Gentra',
          lat: 39.6700,
          lng: 66.9550,
          completedOrdersCount: 41,
          workCondition: '1,4% (Standart)',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80'
        },
        {
          lastName: 'Axmadov',
          firstName: 'Shohzod',
          middleName: 'Karim o\'g\'li',
          phone: '+998907890123',
          role: 'kuryer',
          courierType: 'piyoda',
          status: 'on_order',
          hasGps: true,
          balance: 51400.0,
          vehiclePlate: null,
          vehicleModel: 'Piyoda kuryer',
          lat: 39.6540,
          lng: 66.9590,
          completedOrdersCount: 30,
          workCondition: '1,4% (Standart)',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
        },
        {
          lastName: 'Rustamov',
          firstName: 'Jasur',
          middleName: 'Mansur o\'g\'li',
          phone: '+998908901234',
          role: 'kuryer',
          courierType: 'avto',
          status: 'free',
          hasGps: true,
          balance: 112000.0,
          vehiclePlate: '30B777BA',
          vehicleModel: 'Chevrolet Onix',
          lat: 39.6590,
          lng: 66.9690,
          completedOrdersCount: 52,
          workCondition: '1,4% (Standart)',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80'
        },
        {
          lastName: 'Karimov',
          firstName: 'Sardor',
          middleName: 'Umar o\'g\'li',
          phone: '+998909012345',
          role: 'kuryer',
          courierType: 'moto',
          status: 'free',
          hasGps: true,
          balance: 34000.0,
          vehiclePlate: '30M999AA',
          vehicleModel: 'Yamaha Scooter',
          lat: 39.6480,
          lng: 66.9610,
          completedOrdersCount: 19,
          workCondition: '1,4% (Standart)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
        },
        {
          lastName: 'Mansurov',
          firstName: 'Eldor',
          middleName: 'Qodir o\'g\'li',
          phone: '+998901112233',
          role: 'ish_boshqaruvchi',
          courierType: null,
          status: 'free',
          hasGps: true,
          balance: 0,
          vehiclePlate: null,
          lat: 39.6542,
          lng: 66.9597,
          completedOrdersCount: 0,
          workCondition: 'Oklad 6 500 000 UZS',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
        },
        {
          lastName: 'Qosimov',
          firstName: 'Farhod',
          middleName: 'Rustam o\'g\'li',
          phone: '+998902223344',
          role: 'povar',
          courierType: null,
          status: 'free',
          hasGps: true,
          balance: 0,
          vehiclePlate: null,
          lat: 39.6542,
          lng: 66.9597,
          completedOrdersCount: 0,
          workCondition: 'Oklad 5 000 000 UZS',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80'
        },
        {
          lastName: 'Saidov',
          firstName: 'Sherzod',
          middleName: 'Bahrom o\'g\'li',
          phone: '+998903334455',
          role: 'povar_yordamchisi',
          courierType: null,
          status: 'free',
          hasGps: true,
          balance: 0,
          vehiclePlate: null,
          lat: 39.6542,
          lng: 66.9597,
          completedOrdersCount: 0,
          workCondition: 'Oklad 3 500 000 UZS',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
        },
        {
          lastName: 'Alimova',
          firstName: 'Diyora',
          middleName: 'Anvar qizi',
          phone: '+998904445566',
          role: 'ofitsiant',
          courierType: null,
          status: 'free',
          hasGps: true,
          balance: 0,
          vehiclePlate: null,
          lat: 39.6542,
          lng: 66.9597,
          completedOrdersCount: 0,
          workCondition: 'Oklad 3 000 000 UZS + %',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
        }
      ];

      for (const emp of initialEmployees) {
        await prisma.employee.upsert({
          where: { phone: emp.phone },
          update: {},
          create: emp
        });
      }
      console.log('✅ Initial performers seeded');
    }

  } catch (error) {
    console.error('Error during database seed:', error);
  }
}
