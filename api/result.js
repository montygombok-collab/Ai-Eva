export default async function handler(req, res) {
    // السماح بالطلبات من موقعك فقط
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { serial_number } = req.body;

    if (!serial_number) {
        return res.status(400).json({ error: 'رقم الجلوس مطلوب' });
    }

    try {
        // 1. جلب الصفحة الرئيسية للموقع الخارجي لسحب الكوكي والـ CSRF Token
        const getRes = await fetch('https://result.sd/', {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        
        const setCookieHeader = getRes.headers.get('set-cookie');
        const htmlText = await getRes.text();

        // استخراج الـ CSRF Token بالـ Regex السريع من الـ HTML
        const tokenMatch = htmlText.match(/name="csrfmiddlewaretoken" value="([^"]+)"/);
        if (!tokenMatch) {
            return res.status(500).json({ error: 'فشل في استخراج رمز الحماية' });
        }
        const csrfToken = tokenMatch[1];

        // 2. إرسال طلب POST للموقع الخارجي بالتوكن ورقم الجلوس
        const formData = new URLSearchParams();
        formData.append('csrfmiddlewaretoken', csrfToken);
        formData.append('serial_number', serial_number);

        const postRes = await fetch('https://result.sd/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': setCookieHeader || '',
                'Referer': 'https://result.sd/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            body: formData.toString()
        });

        const resultHtml = await postRes.text();

        // إرجاع HTML النتيجة للواجهة الأمامية لعرضها
        return res.status(200).send(resultHtml);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'حدث خطأ أثناء الاتصال بسيرفر النتيجة الخارجي' });
    }
}
