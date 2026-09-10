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

        let studentName = "";
        let studentScore = "";

        $('td, th, span, div').each((i, el) => {
            const text = $(el).text().trim();
            if (text.includes('اسم') && !studentName) {
                studentName = $(el).next().text().trim() || text;
            }
            if ((text.includes('المجموع') || text.includes('النتيجة')) && !studentScore) {
                studentScore = $(el).next().text().trim() || text;
            }
        });

        if (!studentName) studentName = $('h4').first().text().trim() || "غير متوفر";
        if (!studentScore) studentScore = $('strong').last().text().trim() || "غير متوفر";

        return res.json({
            success: true,
            name: studentName,
            seat: seatNo,
            score: studentScore
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'خطأ في الاتصال بالخادم.' });
    }
};
