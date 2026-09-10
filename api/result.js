export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { serial_number } = req.body;
    if (!serial_number) {
        return res.status(400).json({ success: false, message: 'الرجاء إدخال رقم الجلوس' });
    }

    try {
        // الخطوة 1: جلب الصفحة الرئيسية لسحب الـ CSRF Token والـ Cookie
        const getRes = await fetch('https://result.sd/', {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const setCookieHeader = getRes.headers.get('set-cookie');
        const htmlText = await getRes.text();

        const tokenMatch = htmlText.match(/name="csrfmiddlewaretoken" value="([^"]+)"/);
        if (!tokenMatch) {
            return res.status(500).json({ success: false, message: 'فشل في جلب رمز الحماية من الموقع الرسمي' });
        }
        const csrfToken = tokenMatch[1];

        // الخطوة 2: إرسال طلب النتيجة POST
        const formData = new URLSearchParams();
        formData.append('csrfmiddlewaretoken', csrfToken);
        formData.append('serial_number', serial_number);

        const postRes = await fetch('https://result.sd/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': setCookieHeader || '',
                'Referer': 'https://result.sd/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            body: formData.toString()
        });

        const resultHtml = await postRes.text();

        // إرجاع الـ HTML الخام للواجهة الأمامية عشان نعرضه بالستايل النظيف
        return res.status(200).json({ success: true, html: resultHtml });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'حدث خطأ في الاتصال بالسيرفر الخارجي' });
    }
}
