# CRM Admin Panel

Next.js asosida qurilgan zamonaviy CRM admin paneli.

## Texnologiyalar

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Shadcn UI** - UI komponentlar
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Recharts** - Grafiklar

## O'rnatish

```bash
# Dependencies o'rnatish
npm install

# Development server ishga tushirish
npm run dev

# Production build
npm run build

# Production server
npm start
```

## Environment Variables

`.env.local` faylini yarating:

```env
NEXT_PUBLIC_BASE_URL=https://admin-crm.onrender.com
```

## Xususiyatlar

✅ Authentication (Login/Logout)
✅ Protected routes
✅ Token-based authorization
✅ Responsive design
✅ Dark/Light mode
✅ Dashboard statistika
✅ Foydalanuvchilar boshqaruvi (Managers, Admins, Teachers, Students)
✅ Guruhlar va kurslar
✅ To'lovlar tizimi

## Loyiha Strukturasi

```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard sahifalari
│   ├── login/            # Login sahifasi
│   └── layout.tsx        # Root layout
├── components/            # React komponentlar
│   ├── layout/           # Layout komponentlari
│   └── ui/              # UI komponentlar (Shadcn)
├── lib/                  # Utility funksiyalar
│   ├── axios.ts         # Axios konfiguratsiya
│   ├── auth.ts          # Auth funksiyalar
│   └── utils.ts         # Helper funksiyalar
├── hook/                 # Custom hooks
│   └── useAuth.ts       # Authentication hook
└── types/               # TypeScript types
```

## Asosiy Funksiyalar

### Authentication
- Login sahifasi token bilan
- Protected routes
- Auto redirect
- Logout funksiyasi

### Axios Interceptors
- Har bir requestga token qo'shish
- 401 xatolikda avtomatik logout
- Error handling

### Dashboard
- Statistika kartochkalari
- Grafiklar (Recharts)
- Responsive dizayn

## Ishga Tushirish

1. Loyihani clone qiling
2. `npm install` - dependencies o'rnatish
3. `.env.local` faylini yarating
4. `npm run dev` - development server
5. Browser'da `http://localhost:3000` ochiladi

## Muammolarni Hal Qilish

Agar login qilishda muammo bo'lsa:
- `.env.local` faylida `NEXT_PUBLIC_BASE_URL` to'g'ri ekanligini tekshiring
- Browser console'da xatolarni ko'ring
- Network tab'da API so'rovlarni tekshiring

## Litsenziya

MIT
