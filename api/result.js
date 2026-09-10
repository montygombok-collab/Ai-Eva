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

            // استخراج النصوص الحقيقية من الجداول أو العناصر المخصصة للنتيجة
            let studentName = "";
            let studentScore = "";

            // البحث الذكي داخل الجداول والعناصر النصية
            $('td, th, span, div, h3, h4, p').each((i, el) => {
                const txt = $(el).text().trim();
                // التقط النص إذا كان مميزاً ولا يحتوي على كلمات عامة
                if (txt.length > 3 && !txt.includes('النتيجة') && !txt.includes('رقم الجلوس') && !studentName) {
                    // افتراض أن اسم الطالب يأتي في أول العناصر النصية البارزة
                    if ($(el).hasClass('name') || $(el).attr('id')?.includes('name') || i < 15) {
                        // ممكن نلتقط النص لو بدا وكأنه اسم (أكثر من كلمة عربية)
                        if (txt.split(' ').length >= 2 && !studentName) {
                            studentName = txt;
                        }
                    }
                }
            });

            // طريقة بديلة مباشرة لجلب أول نص داخل الجداول أو الكلاسات المحتملة
            if (!studentName) {
                studentName = $('.student-name, #name, td.name, .result-name').first().text().trim() || $('table tr td').eq(1).text().trim() || "اسم الطالب غير محدد";
            }
            if (!studentScore) {
                studentScore = $('.total-score, #score, td.score, .result-total').first().text().trim() || $('table tr td').eq(3).text().trim() || "النتيجة غير محددة";
            }

            return res.json({
                success: true,
                name: studentName,
                seat: seatNo,
                score: studentScore
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
