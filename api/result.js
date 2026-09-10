const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    const seatNo = req.query.seat;
    if (!seatNo) {
        return res.status(400).json({ success: false, message: 'الرجاء إدخال رقم الجلوس' });
    }

    try {
        const targetUrl = `https://result.sd/`;
        
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            body: `seat_number=${encodeURIComponent(seatNo)}`
        });

        const htmlText = await response.text();
        const $ = cheerio.load(htmlText);

        // البحث في الجداول أو العناصر النصية الشائعة داخل النتيجة
        let studentName = "";
        let studentScore = "";

        // محاولة استخراج كافة النصوص من الجداول أو الكروت في الصفحة الراجعَة
        $('td, th, span, div').each((i, el) => {
            const text = $(el).text().trim();
            if (text.includes('اسم') && !studentName) {
                studentName = $(el).next().text().trim() || text;
            }
            if ((text.includes('المجموع') || text.includes('النتيجة') || text.includes('المجموع الكلي')) && !studentScore) {
                studentScore = $(el).next().text().trim() || text;
            }
        });

        // لو ما اتلقو بالطريقة دي، جرب نقرأ أي عنصر هيدر أو براجراف
        if (!studentName) studentName = $('h4').first().text().trim() || "غير متوفر";
        if (!studentScore) studentScore = $('strong').last().text().trim() || "غير متوفر";

        return res.json({
            success: true,
            name: studentName || "اسم الطالب (يحتاج ضبط)",
            seat: seatNo,
            score: studentScore || "النتيجة (يحتاج ضبط)"
        });

    } data (error) {
        return res.status(500).json({ success: false, message: 'خطأ في الاتصال.' });
    }
};
