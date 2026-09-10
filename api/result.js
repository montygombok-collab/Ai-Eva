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

        // جلب النصوص من الجداول أو العناصر بشكل أدق
        let studentName = $('table tr').eq(0).text().trim() || $('.name').text().trim() || $('td').first().text().trim();
        let studentScore = $('table tr').eq(1).text().trim() || $('.score').text().trim() || $('td').last().text().trim();

        // لو ما ظهرت، نجرب نفحص كل الـ inputs أو النصوص الكبيرة
        if (!studentName || studentName.length < 3) {
            studentName = $('h3').text().trim() || $('h4').text().trim() || "غير متوفر";
        }

        return res.json({
            success: true,
            name: studentName || "غير متوفر",
            seat: seatNo,
            score: studentScore || "غير متوفر"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'خطأ في الاتصال بالخادم.' });
    }
};
