const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

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
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Origin': 'https://result.sd',
                'Referer': 'https://result.sd/'
            },
            body: `seat_number=${encodeURIComponent(seatNo)}`
        });

        const htmlText = await response.text();
        const $ = cheerio.load(htmlText);

        // استخراج النص الكامل أو تنظيفه قليلاً ليعرضه التطبيق
        // سنقوم بإزالة السكربتات والستايلات وجلب النص العام
        $('script, style').remove();
        const fullText = $('body').text().replace(/\s+/g, ' ').trim();

        return res.json({
            success: true,
            name: "النص الكامل للصفحة المسترجعة:",
            seat: seatNo,
            score: fullText.substring(0, 300) + (fullText.length > 300 ? "..." : "") // عرض أول 300 حرف للتأكد
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الاتصال بالنظام.' });
    }
};
