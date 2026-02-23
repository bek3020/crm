# CRM Project

Admin CRM tizimi - Next.js 16 va TypeScript bilan qurilgan.

## Texnologiyalar

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Recharts** - Data visualization
- **Lucide React** - Icons

## O'rnatish

1. Loyihani klonlash:
```bash
git clone <repository-url>
cd crm_projekt
```

2. Paketlarni o'rnatish:
```bash
npm install
```

3. Environment fayllarini sozlash:

`.env.local` (Development):
```
NEXT_PUBLIC_BASE_URL=http://localhost:7070
```

`.env.production` (Production):
```
NEXT_PUBLIC_BASE_URL=https://admin-crm.onrender.com
```

## Ishga tushirish

Development rejimida:
```bash
npm run dev
```

Loyiha http://localhost:3000 da ochiladi.

Production build:
```bash
npm run build
npm start
```

## Sahifalar

- `/` - Asosiy sahifa (redirect to dashboard yoki login)
- `/login` - Login sahifasi
- `/dashboard` - Dashboard (statistika)
- `/dashboard/managers` - Menejerlar ro'yxati
- `/dashboard/admins` - Adminlar ro'yxati
- `/dashboard/teachers` - Ustozlar ro'yxati
- `/dashboard/students` - Studentlar ro'yxati
- `/dashboard/groups` - Guruhlar
- `/dashboard/courses` - Kurslar
- `/dashboard/payments` - To'lovlar
- `/dashboard/profile` - Profil
- `/dashboard/settings` - Sozlamalar

## API Endpoints

### Authentication
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/logout` - Logout

### Staff (Managers & Admins)
- `GET /api/staff/all-managers` - Barcha menejerlar
- `POST /api/staff/create-manager` - Meneger qo'shish
- `POST /api/staff/edited-manager` - Meneger tahrirlash
- `DELETE /api/staff/deleted-admin` - O'chirish
- `POST /api/staff/leave-staff` - Ta'tilga chiqarish

- `GET /api/staff/all-admins` - Barcha adminlar
- `POST /api/staff/create-admin` - Admin qo'shish
- `POST /api/staff/edited-admin` - Admin tahrirlash

### Teachers
- `GET /api/teacher/get-all-teachers` - Barcha ustozlar
- `POST /api/teacher/create-teacher` - Ustoz qo'shish
- `DELETE /api/teacher/fire-teacher` - Ishdan bo'shatish
- `POST /api/teacher/return-teacher` - Qaytarish

### Students
- `GET /api/student/get-all-students` - Barcha studentlar
- `POST /api/student/create-student` - Student qo'shish
- `DELETE /api/student/delete-student` - O'chirish
- `POST /api/student/leave-student` - Ta'tilga chiqarish
- `POST /api/student/return-student` - Qaytarish

## Xususiyatlar

✅ Authentication (Token-based)
✅ Protected routes
✅ CRUD operations (Managers, Admins, Teachers, Students)
✅ Search va filter
✅ Dark/Light mode
✅ Responsive design
✅ Toast notifications
✅ Loading states
✅ Error handling

## Loyiha strukturasi

```
crm_projekt/
├── app/
│   ├── dashboard/
│   │   ├── admins/
│   │   ├── managers/
│   │   ├── teachers/
│   │   ├── students/
│   │   ├── groups/
│   │   ├── courses/
│   │   ├── payments/
│   │   ├── profile/
│   │   └── settings/
│   ├── login/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── SidebarApp.tsx
│   │   └── ProtectedLayout.tsx
│   └── ui/
├── hook/
│   └── useAuth.ts
├── lib/
│   ├── axios.ts
│   ├── auth.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── public/
```

## Muammolarni hal qilish

### "Ma'lumotlarni yuklashda xatolik!" xatosi

Bu xato quyidagi sabablarga ko'ra chiqishi mumkin:

#### 1. Backend ishlamayapti
**Tekshirish:**
```bash
# Backend portini tekshiring
curl http://localhost:7070/api/staff/all-admins
```

**Yechim:**
- Backend serverni ishga tushiring
- Backend 7070 portda ishlayotganini tekshiring

#### 2. CORS muammosi
**Belgilari:**
- Console da "CORS policy" xatosi
- Network Error

**Yechim:**
Backend da CORS sozlamalarini tekshiring:
```javascript
// Backend da
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

#### 3. Token muammosi
**Belgilari:**
- 401 yoki 403 xato
- "Token topilmadi" console da

**Yechim:**
1. Qayta login qiling: `/login`
2. Browser console ni oching (F12)
3. Application > Local Storage > token borligini tekshiring
4. Agar token bo'lmasa, qayta login qiling

#### 4. Noto'g'ri API endpoint
**Tekshirish:**
Console da quyidagilarni qidiring:
- `📛 Error status: 404` - API endpoint topilmadi
- `🌐 Base URL:` - Base URL to'g'ri ekanligini tekshiring

**Yechim:**
- `.env.local` faylida `NEXT_PUBLIC_BASE_URL` to'g'ri ekanligini tekshiring
- Backend API endpointlari to'g'ri ekanligini tekshiring

#### 5. Network timeout
**Belgilari:**
- "Request timeout" xatosi
- So'rov 10 soniyadan ko'p davom etadi

**Yechim:**
`lib/axios.ts` da timeout ni oshiring:
```typescript
export const api = axios.create({
  baseURL: baseURL,
  timeout: 30000, // 30 soniya
});
```

### Debug qilish

Browser console ni oching (F12) va quyidagilarni tekshiring:

1. **Request ma'lumotlari:**
   - `📤 Request: GET /api/staff/all-admins`
   - `🔑 Token yuborildi: ...`

2. **Response ma'lumotlari:**
   - `✅ Response: 200 /api/staff/all-admins`
   - `✅ Backend response: [...]`

3. **Error ma'lumotlari:**
   - `❌ API Error: ...`
   - `📛 Error status: 404/403/401`
   - `📛 Error data: ...`

### Token muammosi
Agar 403 xato olsangiz, qayta login qiling:
1. `/login` ga o'ting
2. Email va parolni kiriting
3. Token avtomatik saqlanadi

### Port band bo'lsa
Agar 3000 port band bo'lsa:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Yoki boshqa portda ishga tushiring
npm run dev -- -p 3001
```

## Litsenziya

MIT
