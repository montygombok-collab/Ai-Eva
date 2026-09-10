const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    // منع التخزين المؤقت تماماً في السيرفر
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const seatNo = req.query.seat;
    if (!seatNo) {
        return res.status(400).json({ success: false, message: 'الرجاء إدخال رقم الجلوس' });
    }

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        attempt++;
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
            const bodyText = $('body').text();

            if ((bodyText.includes('إقبالاً كبيراً') || bodyText.includes('غير متاحة')) && attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 800));
                continue;
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
            if (attempt >= maxRetries) {
                return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الاتصال بالنظام.' });
            }
        }
    }

    return res.json({
        success: false,
        message: 'الضغط عالي جداً حالياً، جرب مرة أخرى.'
    });
};
