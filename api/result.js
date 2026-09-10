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
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://result.sd/'
            },
            body: `seat_number=${encodeURIComponent(seatNo)}`
        });

        const htmlText = await response.text();
        const $ = cheerio.load(htmlText);

        const pageTitle = $('title').text().trim();
        const bodyText = $('body').text();

        if (bodyText.includes('إقبالاً كبيراً') || bodyText.includes('غير متاحة')) {
            return res.json({
                success: false,
                message: 'الموقع الرسمي يشهد ضغطاً عالياً حالياً، جرب مرة أخرى بعد قليل.'
            });
        }

        let studentName = $('.name, #student_name, td').first().text().trim();
        let studentScore = $('.score, #result_score, td').last().text().trim();

        return res.json({
            success: true,
            name: studentName || "متوفر",
            seat: seatNo,
            score: studentScore || "متوفر"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الاتصال بالنظام.' });
    }
};
