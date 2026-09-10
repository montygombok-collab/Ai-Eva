const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/result', async (req, res) => {
    const seatNo = req.query.seat;
    if (!seatNo) {
        return res.status(400).json({ error: 'الرجاء إدخال رقم الجلوس' });
    }

    try {
        // محاكاة إرسال الطلب لموقع النتائج الرسمي (حسب طريقة استقبال الموقع للبيانات)
        // عادة مواقع النتائج السودانية بتقبل POST أو GET بمتغير رقم الجلوس
        const targetUrl = `https://result.sd/`; // أو رابط البحث المباشر لو متوفر
        
        // استخدام fetch لسحب الصفحة أو إرسال رقم الجلوس
        const response = await fetch(targetUrl, {
            method: 'POST', // أو GET حسب بنية الموقع الفعلي
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            body: `seat_number=${encodeURIComponent(seatNo)}` // تعديل اسم الحقل حسب فورم الموقع الأصلي
        });

        const htmlText = await response.text();
        const $ = cheerio.load(htmlText);

        // استخلاص الاسم والنتيجة باستخدام الـ Selectors الخاصة بموقع result.sd
        const studentName = $('#student_name').text().trim() || $('.name').text().trim() || "غير معروف";
        const studentScore = $('#result_score').text().trim() || $('.score').text().trim() || "غير متاح";

        if (studentName === "غير معروف") {
            return res.json({ success: false, message: 'تعذر العثور على النتيجة، تأكد من الرقم.' });
        }

        res.json({
            success: true,
            name: studentName,
            seat: seatNo,
            score: studentScore
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = app;
