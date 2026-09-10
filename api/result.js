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

        // البحث الدقيق عن حقول النتيجة بناءً على النصوص الظاهرة في الموقع الرسمي
        let studentName = "";
        let studentScore = "";
        let studentStatus = "";

        // فحص كل العناصر لاستخراج البيانات المحددة
        $('div, p, span, td').each((i, el) => {
            const text = $(el).text().trim();
            
            // لو العبارة بتحتوي على الاسم الرباعي أو البيانات
            if (text.includes('الاسم الرباعي')) {
                studentName = $(el).next().text().trim() || $(el).text().replace('الاسم الرباعي', '').trim();
            }
            if (text.includes('النسبة')) {
                studentScore = $(el).next().text().trim() || $(el).text().replace('النسبة', '').trim();
            }
            if (text.includes('النتيجة') && !text.includes('خدمة النتائج')) {
                studentStatus = $(el).next().text().trim() || $(el).text().replace('النتيجة', '').trim();
            }
        });

        // لو ما لقى البيانات بالطريقة العادية، نجرب نبحث في الـ Body مباشرة أو نتحقق هل هي صفحة ضغط حقاً
        if (!studentName || studentName.length < 3 || studentName.includes('إقبالاً')) {
            // فحص لو الصفحة لسة عارضة رسالة الضغط
            if ($('body').text().includes('إقبالاً كبيراً') || $('body').text().includes('غير متاحة')) {
                return res.json({
                    success: false,
                    message: 'الخدمة تشهد إقبالاً كبيراً، حاول مرة أخرى.'
                });
            }
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
