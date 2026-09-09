import { z } from 'zod';

export const ProductOptionSchema = z.object({
  name: z.string().min(1, 'Название модификатора обязательно'),
  price: z.number().min(0, 'Цена модификатора не может быть отрицательной')
});

export const ProductInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Название товара должно быть не менее 2 символов'),
  categoryId: z.string().min(1, 'Категория обязательна'),
  price: z.number().positive('Цена должна быть больше 0'),
  oldPrice: z.number().nullable().optional(),
  weight: z.string().optional(),
  calories: z.string().optional(),
  image: z.string().min(1, 'Изображение обязательно'),
  description: z.string().optional(),
  inStock: z.boolean().default(true),
  isPopular: z.boolean().optional().default(false),
  isChefSpecial: z.boolean().optional().default(false),
  options: z.array(ProductOptionSchema).optional().default([])
});

export const OrderItemInputSchema = z.object({
  productId: z.string().min(1, 'ID товара обязателен'),
  quantity: z.number().int().min(1, 'Количество должно быть не менее 1'),
  selectedOptions: z.array(ProductOptionSchema).optional().default([])
});

export const CreateOrderSchema = z.object({
  customerName: z.string().min(2, 'Укажите ваше имя (минимум 2 символа)'),
  phone: z.string().min(9, 'Укажите корректный номер телефона'),
  address: z.string().min(3, 'Укажите адрес доставки'),
  deliveryType: z.enum(['delivery', 'pickup']).default('delivery'),
  paymentMethod: z.enum(['payme', 'click', 'card', 'cash']).default('cash'),
  comment: z.string().optional().default(''),
  promoCode: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  items: z.array(OrderItemInputSchema).min(1, 'В заказе должен быть хотя бы один товар')
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['new', 'accepted', 'cooking', 'ready', 'completed', 'rejected', 'cancelled']),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'cash_on_delivery']).optional(),
  rejectionReason: z.string().optional()
});

export const RegisterInputSchema = z.object({
  username: z.string().min(3, 'Никнейм должен быть не менее 3 символов').optional().or(z.literal('')),
  firstName: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  lastName: z.string().min(2, 'Фамилия должна содержать не менее 2 символов'),
  phone: z.string().min(9, 'Номер телефона должен быть не менее 9 цифр'),
  birthDate: z.string().optional().default(''),
  email: z.string().email('Укажите корректный адрес электронной почты'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
  confirmPassword: z.string().min(6, 'Подтверждение пароля обязательно'),
  code: z.string().length(6, 'Код подтверждения должен состоять ровно из 6 цифр')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword']
});

export const LoginInputSchema = z.object({
  username: z.string().min(1, 'Введите логин, email или телефон'),
  password: z.string().min(1, 'Введите пароль'),
  rememberMe: z.boolean().optional().default(false)
});

export const SendCodeSchema = z.object({
  email: z.string().email('Укажите корректный Email')
});

export const ResetPasswordSchema = z.object({
  email: z.string().email('Укажите корректный Email'),
  code: z.string().length(6, 'Код должен содержать 6 цифр'),
  newPassword: z.string().min(6, 'Пароль должен быть не менее 6 символов')
});

export const ReviewInputSchema = z.object({
  author: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(5, 'Текст отзыва должен содержать не менее 5 символов'),
  avatar: z.string().optional()
});

export const CafeSettingsInputSchema = z.object({
  cafeName: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  deliveryFee: z.number().min(0),
  freeDeliveryThreshold: z.number().min(0),
  minOrderAmount: z.number().min(0),
  isOpen: z.boolean(),
  workHours: z.string().min(1),
  bannerText: z.string().optional()
});
