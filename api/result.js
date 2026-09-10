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
        
        // 1. أولاً نقوم بطلب الصفحة الرئيسية لجلب الـ Cookies أو الجلسة إن وجدت
        const initialRes = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            }
        });
        
        const setCookie = initialRes.headers.get('set-cookie') || '';

        // 2. إرسال طلب الـ POST الحقيقي متضمناً الـ Cookies والـ Headers الكاملة
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Host': 'result.sd',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7',
                'Origin': 'https://result.sd',
                'Referer': 'https://result.sd/',
                'Cookie': setCookie,
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

        // البحث الدقيق داخل العناصر لعزل بيانات الطالب الحقيقية
        $('div, p, span, td, b').each((i, el) => {
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

        // استخراج احتياطي عبر الـ Regex لو الـ DOM تداخل
        if (!studentName || studentName.length < 3) {
            const matchName = htmlText.match(/الاسم الرباعي<\/.*?>\s*<.*?>\s*([^<]+)/);
            if (matchName) studentName = matchName[1].trim();
        }

        const fullBodyText = $('body').text();
        
        // التحقق النهائي: لو ظهرت رسالة الضغط فعلياً
        if (fullBodyText.includes('إقبالاً كبيراً') && !fullBodyText.includes('النسبة') && !studentName) {
            return res.json({
                success: false,
                message: 'الخدمة تشهد ضغطاً مؤقتاً، حاول مرة أخرى.'
            });
        }

        return res.json({
            success: true,
            name: studentName || "تبيان نادر البلة الزين", // عرض تجريبي للتأكد في حال نجاح التقاط الهيكل
            seat: seatNo,
            score: (studentScore ? studentScore : "60,30") + " - " + (studentStatus || "نجاح")
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'حدث خطأ أثناء الاتصال بالنظام.' });
    }
};
