# GODMYEGXO Clan Website

เว็บไซต์แสดงรายชื่อสมาชิกแก๊ง พร้อม Admin Panel แยกต่างหาก

## โครงสร้างไฟล์

```
godmyegxo-site/
├── index.html          ← หน้า Gate (หน้าแรก)
├── members.html        ← หน้าแสดงสมาชิก
├── admin/
│   ├── index.html      ← Dashboard
│   ├── members.html    ← จัดการสมาชิก
│   ├── applications.html
│   └── settings.html   ← ตั้งค่าเว็บ + เพลง + ธีม
├── css/
│   ├── style.css
│   └── admin.css
└── js/
    ├── config.js
    ├── gate.js
    ├── members.js
    ├── admin.js
    ├── admin-members.js
    └── admin-settings.js
```

## วิธีใช้งาน (ทดสอบในเครื่อง)

1. เปิดโฟลเดอร์นี้ด้วย Live Server หรือดับเบิลคลิก `index.html`
2. เข้า Admin ได้ที่ `/admin/index.html`
3. เพิ่มสมาชิก + ตั้งค่าธีม/เพลง ได้เลย
4. ข้อมูลเก็บใน localStorage ของเบราว์เซอร์

## Deploy ฟรี + ใช้โดเมน .com

### แนะนำ: Cloudflare Pages (ดีที่สุด)

1. สมัคร Cloudflare (ฟรี)
2. ไปที่ **Pages** → Create project → Upload assets
3. อัปโหลดโฟลเดอร์ `godmyegxo-site` ทั้งก้อน
4. ได้ลิงก์ฟรีทันที เช่น `your-project.pages.dev`
5. ซื้อโดเมน `.com` (Namecheap / Porkbun / Cloudflare Registrar)
6. ไปที่ Custom domains ใน Cloudflare Pages แล้วใส่โดเมนของคุณ
7. ตั้ง DNS ตามที่ Cloudflare บอก (ปกติแค่ CNAME หรือ A record)

### ทางเลือกอื่น
- **Netlify** → ลากโฟลเดอร์วางที่ netlify.com/drop ได้เลย
- **Vercel** → ใช้ได้ดี (แต่ Hobby ห้ามใช้เชิงพาณิชย์)
- **GitHub Pages** → push ขึ้น GitHub แล้วเปิด Pages

## ฟีเจอร์ที่มี

### หน้าเว็บหลัก
- หน้า Gate สวย ๆ มีปุ่ม ENTER
- หน้า Members แยกยศ Founders / Leaders / Members
- ค้นหาสมาชิก
- ลิงก์ Facebook กดได้
- เพลงพื้นหลัง + Mini Player

### Admin Panel
- Dashboard แสดงจำนวนสมาชิก
- เพิ่ม / แก้ไข / ลบสมาชิก
- ตั้งชื่อเว็บ, คำโปรย, สีหลัก
- เลือกธีม (Default, Neon, Crimson, Aurora, Gold, Ocean)
- ตั้งเพลง YouTube / ไฟล์เสียง
- ระดับเสียง + Auto play
- Danger Zone ลบข้อมูลทั้งหมด

## หมายเหตุ

- ตอนนี้ข้อมูลเก็บใน **localStorage** (เหมาะกับทดสอบ / ใช้คนเดียว)
- ถ้าอยากให้หลายคนใช้ร่วมกัน + ข้อมูลไม่หายเมื่อล้างแคช  
  → แนะนำย้ายไปใช้ **Firebase / Supabase** (ฟรี) ภายหลังได้ง่าย

สร้างโดย Grok สำหรับ GODMYEGXO
