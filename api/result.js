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

        // جلب أول 200 حرف من نص الصفحة لنرى هل رجعت صفحة خطأ أم صفحة نتيجة
        const pageTitle = $('title').text().trim();
        const bodySnippet = $('body').text().substring(0, 150).trim();

        return res.json({
            success: false,
            message: `عنوان الصفحة: ${pageTitle} | عينة النص: ${bodySnippet}`
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'خطأ في الاتصال بالخادم.' });
    }
};
