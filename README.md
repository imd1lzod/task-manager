# Task Manager

## Loyihaning maqsadi

Ushbu loyiha foydalanuvchilarga shaxsiy vazifalarini (tasklarini) boshqarishda yordam berish uchun ishlab chiqilgan. Har bir foydalanuvchi o‘z tasklarini yaratishi, ko‘rishi, tahrirlashi va holatini boshqarishi mumkin. Admin foydalanuvchilar va tasklarni umumiy nazorat qiladi.

---

## Texnologiyalar

- **Backend:** Node.js (NestJS)
- **Ma'lumotlar bazasi:** PostgreSQL
- **ORM:** Prisma
- **Frontend:** 
- **Autentifikatsiya:** JWT Token

---

## Funksional imkoniyatlar

### Foydalanuvchi (User)

- Ro‘yxatdan o‘tish
- Tizimga kirish (Login)
- Profilni ko‘rish va tahrirlash
- Parolni yangilash
- Task yaratish
- Taskni ko‘rish, o‘zgartirish, o‘chirish
- Task holatini `pending`, `in-progress`, `done` ga o‘zgartirish
- Faqat o‘z tasklarini ko‘rish

### Admin

- Barcha foydalanuvchilarni ko‘rish
- Foydalanuvchini bloklash yoki faollashtirish
- Barcha tasklarni ko‘rish va o‘chirish
- Sistemani umumiy nazorat qilish

---

## Ma'lumotlar strukturasi

### User

 id Unique  
 name String Foydalanuvchi ismi  
 email String Email manzili  
 password String Hashed parol  
 age Number Yoshi  
 gender String Jinsi (`male`, `female`, `other`)
role String `user` yoki `admin`  
 isActive Boolean Faollik holati  
 createdAt Date Yaratilgan vaqt  
 updatedAt Date Yangilangan vaqt

### Task
 
 id Unique  
 title String Vazifa sarlavhasi  
 description String Vazifa tavsifi  
 status String `pending`, `in-progress`, `done`  
 deadline Date Tugash muddati  
 userId UUID Egasi bo‘lgan foydalanuvchi IDsi  
 createdAt Date Yaratilgan vaqt  
 updatedAt Date Yangilangan vaqt