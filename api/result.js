function handleResultSubmission(seatNo) {
    if (!seatNo) {
        alert('الرجاء إدخال رقم الجلوس');
        return;
    }

    // إنشاء نموذج وهمي (Form) مخفي وإرساله مباشرة من متصفح المستخدم للموقع الأصلي
    // دي الطريقة الوحيدة البيقبلها السيرفر الخارجي لأنها بتطلع من IP وم 
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://result.sd/';
    form.target = '_blank'; // لفتح النتيجة في تبويب جديد أو عرضها

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'seat_number';
    input.value = seatNo;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
