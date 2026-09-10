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

        // طباعة النص المستخلص للتأكد من هيكل الموقع
        console.log("HTML Length:", htmlText.length);

        // جرب استخراج الاسم والنتيجة بناءً على العناصر الشائعة أو الجداول
        const studentName = $('td:contains("اسم"), .name, h3, h2').first().text().trim() || "غير متوفر";
        const studentScore = $('td:contains("المجموع"), .score, .total').first().text().trim() || "غير متوفر";

        return res.json({
            success: true,
            name: studentName,
            seat: seatNo,
            score: studentScore
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'خطأ في الاتصال بقاعدة البيانات.' });
    }
};
