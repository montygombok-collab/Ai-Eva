async function fetchResult() {
    const serial = document.getElementById('serialInput').value.trim();
    const resultArea = document.getElementById('resultArea');
    
    if (!serial) {
        alert('الرجاء إدخال رقم الجلوس أولاً');
        return;
    }

    resultArea.innerHTML = 'جاري تجاوز الحصار وجلب النتيجة... ⏳';

    try {
        // نستخدم بروكسي مجاني للالتفاف على قيود الـ CORS من متصفح المستخدم
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://result.sd/');
        
        const getRes = await fetch(proxyUrl);
        const htmlText = await getRes.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const csrfToken = doc.querySelector('input[name="csrfmiddlewaretoken"]')?.value;

        if (!csrfToken) {
            resultArea.innerHTML = '<span style="color:red;">عفواً، لم نتمكن من جلب رمز الحماية.</span>';
            return;
        }

        // إرسال البيانات عبر نفس البروكسي أو فتح الرابط مباشرة بـ POST لو متاح
        const formData = new URLSearchParams();
        formData.append('csrfmiddlewaretoken', csrfToken);
        formData.append('serial_number', serial);

        const postRes = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://result.sd/'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        const resultHtml = await postRes.text();
        const resultDoc = parser.parseFromString(resultHtml, 'text/html');
        const resultCard = resultDoc.querySelector('.result') || resultDoc.querySelector('.errorlist');

        if (resultCard) {
            resultArea.innerHTML = resultCard.outerHTML;
        } else {
            resultArea.innerHTML = '<span style="color:red;">عفواً، الموقع الخارجي رد برسالة الضغط ولم يُرجع النتيجة.</span>';
        }

    } catch (error) {
        console.error(error);
        resultArea.innerHTML = '<span style="color:red;">حدث خطأ في الاتصال.</span>';
    }
}
