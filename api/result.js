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

        const studentName = $('#student_name').text().trim() || $('.name').text().trim() || "";
        const studentScore = $('#result_score').text().trim() || $('.score').text().trim() || "";

        if (!studentName) {
            return res.json({ success: false, message: 'تعذر العثور على نتيجة لهذا الرقم في الموقع الرسمي.' });
        }

        return res.json({
            success: true,
            name: studentName,
            seat: seatNo,
            score: studentScore
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'خطأ في الاتصال بقاعدة البيانات.' });
    }
};
