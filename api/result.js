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
        
        // محاكاة متصفح حقيقي بالكامل لتجاوز أي حظر أو توجيه خاطئ
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Host': 'result.sd',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7',
                'Origin': 'https://result.sd',
                'Referer': 'https://result.sd/',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            body: `seat_number=${encodeURIComponent(seatNo)}`
        });

        const htmlText = await response.text();
        const $ = cheerio.load(htmlText);

        let studentName = "";
        let studentScore = "";
        let studentStatus = "";

        // استخراج البيانات بناءً على الهيكل الفعلي الظاهر في صور النتيجة السليمة
        // عادة النص بيجي تحت العناصر التي تحمل اسم الحقل
        $('div, p, span').each((i, el) => {
            const txt = $(el).text().trim();
            
            if (txt === 'الاسم الرباعي') {
                studentName = $(el).next().text().trim() || $(el).parent().text().replace('الاسم الرباعي', '').trim();
            }
            if (txt === 'النسبة') {
                studentScore = $(el).next().text().trim() || $(el).parent().text().replace('النسبة', '').trim();
            }
            if (txt === 'النتيجة') {
                studentStatus = $(el).next().text().trim() || $(el).parent().text().replace('النتيجة', '').trim();
            }
        });

        // طريقة بديلة لو الـ DOM متداخل: البحث بالـ Regex المباشر داخل الـ HTML الخام
        if (!studentName || studentName.length < 3) {
            const nameMatch = htmlText.match(/الاسم الرباعي\s*<\/.*?>\s*<.*?>\s*([أ-ي\s]+)/);
            if (nameMatch) studentName = nameMatch[1].trim();
        }

        const fullBodyText = $('body').text();
        // لو الصفحة لسه مصرة تعرض رسالة الضغط رغم الـ Headers
        if (fullBodyText.includes('إقبالاً كبيراً') && !fullBodyText.includes('النسبة')) {
            return res.json({
                success: false,
                message: 'الخدمة تشهد ضغطاً مؤقتاً، حاول مرة أخرى.'
            });
        }

        return res.json({
            success: true,
            name: studentName || "لم يتم العثور على الاسم",
            seat: seatNo,
            score: (studentScore ? studentScore + " - " : "") + (studentStatus || "متوفر")
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الاتصال بالنظام.' });
    }
};
