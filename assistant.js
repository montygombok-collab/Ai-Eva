// assistant.js - المساعد الذكي لفهم اللهجة السودانية
class SudaneseArabicAssistant {
    constructor() {
        this.name = "المساعد الذكي السوداني";
        this.version = "2.0.0";
        this.dialect = "سوداني";
        this.isActive = false;
        
        // قاعدة بيانات الكلمات والعبارات السودانية
        this.sudaneseDictionary = {
            // تحيات وترحيبات
            greetings: {
                "السلام عليكم": "وعليكم السلام",
                "اهلاً": "اهلاً وسهلاً",
                "مرحبا": "مرحبتين",
                "كيفك": "الحمد لله، كيف حالك؟",
                "كيف الحال": "الحمد لله، انت كيفك؟",
                "صباح الخير": "صباح النور",
                "مساء الخير": "مساء النور"
            },
            
            // كلمات سودانية شائعة
            commonWords: {
                "شنو": "ماذا",
                "ليه": "لماذا",
                "وين": "أين",
                "امتى": "متى",
                "كيف": "كيف",
                "قديه": "كم",
                "شكون": "من",
                "فين": "أين (بتفصيل أكثر)",
                "عايز": "أريد",
                "عاوز": "أريد",
                "نفسي": "أرغب",
                "حابة": "أحب (للإناث)",
                "حابب": "أحب (للذكور)",
                "ماشي": "حسناً أو موافق",
                "تمام": "حسناً أو ممتاز",
                "زين": "جيد",
                "كدا": "هكذا",
                "دي": "هذه (مؤنث)",
                "ده": "هذا (مذكر)",
                "دول": "هؤلاء",
                "بتاع": "خاص ب",
                "بتاعت": "خاص ب (مؤنث)",
                "بتوع": "خاص ب (جمع)",
                "شغل": "عمل",
                "شغلة": "شيء",
                "حاجة": "شيء",
                "واش": "ماذا (في بعض المناطق)",
                "اش": "ماذا"
            },
            
            // أفعال سودانية
            verbs: {
                "روح": "اذهب",
                "تعال": "هلم",
                "اجي": "أتي",
                "قوم": "قم",
                "قعد": "اجلس",
                "اكل": "تناول الطعام",
                "شرب": "تناول الشراب",
                "نام": "نم",
                "شوف": "انظر",
                "سمع": "استمع",
                "كلم": "تحدث",
                "سافر": "سافر",
                "جاب": "أحضر",
                "اخد": "أخذ",
                "داق": "تذوق",
                "لف": "دار أو التف",
                "دور": "ابحث"
            },
            
            // مصطلحات تجارية وسوقية
            businessTerms: {
                "سعر": "ثمن",
                "نقود": "مال",
                "فلوس": "أموال",
                "شلن": "ريال (عملة)",
                "جنيه": "عملة سودانية",
                "باكية": "علبة أو طرد",
                "شوال": "كيس كبير",
                "كيس": "حقيبة",
                "دكان": "متجر",
                "سوق": "سوق",
                "بائع": "تاجر",
                "مشتري": "زبون",
                "فاتورة": "إيصال",
                "ربح": "كسب",
                "خسارة": "خسارة",
                "تجارة": "عمل تجاري"
            },
            
            // مصطلحات المخزون والمبيعات
            inventoryTerms: {
                "بضاعة": "سلع",
                "صنف": "منتج",
                "جرد": "جرد المخزون",
                "مخزن": "مستودع",
                "كمية": "عدد",
                "خلص": "انتهى",
                "فاضل": "متبقي",
                "زود": "أضف",
                "قلل": "أنقص",
                "دخل": "إدخال",
                "طلع": "إخراج",
                "دورة": "دورة المخزون",
                "تالف": "معطوب",
                "صالح": "جيد"
            },
            
            // تعابير وعبارات متداولة
            expressions: {
                "الله يكرمك": "شكراً جزيلاً",
                "ما شاء الله": "جميل أو رائع",
                "ربي يوفقك": "أتمنى لك التوفيق",
                "العفو": "عفواً",
                "لو سمحت": "من فضلك",
                "اسف": "آسف",
                "ما عليش": "لا بأس",
                "عادي": "طبيعي",
                "ما في مشكلة": "لا توجد مشكلة",
                "ان شاء الله": "بإذن الله",
                "الحمد لله": "شكراً لله",
                "ربي يستر": "أتمنى أن يحمينا الله",
                "شد حيلك": "بذل جهدك",
                "خليك قوي": "كن قوياً"
            },
            
            // كلمات خاصة باللهجة السودانية فقط
            uniqueSudanese: {
                "تمتم": "تحدث بهدوء",
                "زغرط": "أصدر صوت فرح",
                "عك": "بقي أو مكث",
                "دغري": "مباشر",
                "برشة": "كثير",
                "قرقعة": "ضجة",
                "شخشخة": "تحدث بصوت عال",
                "طق": "اضرب",
                "نق": "اخرج",
                "قرف": "ضجر",
                "عكاز": "أعتمد على",
                "همبي": "كبير",
                "دقن": "لحية",
                "كرشة": "بطن",
                "طبل": "كذب"
            }
        };

        // أنماط الجمل الشائعة
        this.sentencePatterns = {
            questions: [
                /شنو (.*)/,
                /ليه (.*)/,
                /وين (.*)/,
                /امتى (.*)/,
                /كيف (.*)/,
                /قديه (.*)/,
                /شكون (.*)/,
                /فين (.*)/
            ],
            requests: [
                /عايز (.*)/,
                /عاوز (.*)/,
                /نفسي (.*)/,
                /حابة (.*)/,
                /حابب (.*)/,
                /ابغي (.*)/
            ],
            commands: [
                /روح (.*)/,
                /تعال (.*)/,
                /قوم (.*)/,
                /قعد (.*)/,
                /شوف (.*)/,
                /اسمع (.*)/,
                /كلم (.*)/
            ]
        };

        // السياقات المختلفة
        this.contexts = {
            greeting: 'تحية',
            question: 'سؤال',
            request: 'طلب',
            command: 'أمر',
            complaint: 'شكوى',
            appreciation: 'تقدير',
            business: 'عمل',
            inventory: 'مخزون',
            unknown: 'غير معروف'
        };

        this.init();
    }

    // تهيئة المساعد
    init() {
        console.log(`🔄 تهيئة ${this.name} - الإصدار ${this.version}`);
        this.isActive = true;
        this.loadUserPreferences();
        this.setupEventListeners();
    }

    // تحميل تفضيلات المستخدم
    loadUserPreferences() {
        this.userPreferences = {
            dialectLevel: 'standard', // standard, strong, mixed
            autoTranslate: true,
            showExplanations: true,
            learningMode: false,
            favoriteWords: []
        };

        try {
            const savedPrefs = localStorage.getItem('sudaneseAssistant_prefs');
            if (savedPrefs) {
                this.userPreferences = { ...this.userPreferences, ...JSON.parse(savedPrefs) };
            }
        } catch (error) {
            console.warn('❌ لا يمكن تحميل التفضيلات المحفوظة:', error);
        }
    }

    // حفظ تفضيلات المستخدم
    saveUserPreferences() {
        try {
            localStorage.setItem('sudaneseAssistant_prefs', JSON.stringify(this.userPreferences));
        } catch (error) {
            console.warn('❌ لا يمكن حفظ التفضيلات:', error);
        }
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // يمكن إضافة مستمعي الأحداث هنا للتفاعل مع الواجهة
        document.addEventListener('DOMContentLoaded', () => {
            this.onAssistantReady();
        });
    }

    // عندما يصبح المساعد جاهزاً
    onAssistantReady() {
        console.log(`✅ ${this.name} جاهز للاستخدام`);
        this.showWelcomeMessage();
    }

    // عرض رسالة ترحيب
    showWelcomeMessage() {
        const welcomeMessages = [
            "🕌 السلام عليكم ورحمة الله وبركاته!",
            `🌍 أهلًا وسهلًا في ${this.name}`,
            "🗣️ أنا متخصص في فهم وتفسير اللهجة السودانية",
            "💼 يمكنني مساعدتك في اللغة السودانية للأعمال والتجارة",
            "🔍 اكتب أي جملة سودانية وسأشرحها لك"
        ];

        welcomeMessages.forEach((msg, index) => {
            setTimeout(() => {
                this.displayMessage(msg, 'bot');
            }, index * 1000);
        });
    }

    // المعالجة الرئيسية للرسائل
    processMessage(input) {
        if (!input || typeof input !== 'string') {
            return this.getErrorMessage('الرسالة غير صالحة');
        }

        const cleanedInput = this.cleanInput(input);
        const context = this.detectContext(cleanedInput);
        const response = this.generateResponse(cleanedInput, context);

        return response;
    }

    // تنظيف المدخلات
    cleanInput(input) {
        return input
            .trim()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .replace(/\s{2,}/g, ' ')
            .toLowerCase();
    }

    // كشف سياق الرسالة
    detectContext(input) {
        // كشف التحيات
        if (this.isGreeting(input)) return this.contexts.greeting;
        
        // كشف الأسئلة
        if (this.isQuestion(input)) return this.contexts.question;
        
        // كشف الطلبات
        if (this.isRequest(input)) return this.contexts.request;
        
        // كشف الأوامر
        if (this.isCommand(input)) return this.contexts.command;
        
        // كشف الشكاوى
        if (this.isComplaint(input)) return this.contexts.complaint;
        
        // كشف مصطلحات الأعمال
        if (this.isBusinessRelated(input)) return this.contexts.business;
        
        // كشف مصطلحات المخزون
        if (this.isInventoryRelated(input)) return this.contexts.inventory;

        return this.contexts.unknown;
    }

    // توليد الرد
    generateResponse(input, context) {
        switch (context) {
            case this.contexts.greeting:
                return this.handleGreeting(input);
            
            case this.contexts.question:
                return this.handleQuestion(input);
            
            case this.contexts.request:
                return this.handleRequest(input);
            
            case this.contexts.command:
                return this.handleCommand(input);
            
            case this.contexts.complaint:
                return this.handleComplaint(input);
            
            case this.contexts.business:
                return this.handleBusiness(input);
            
            case this.contexts.inventory:
                return this.handleInventory(input);
            
            default:
                return this.handleUnknown(input);
        }
    }

    // معالجة التحيات
    handleGreeting(input) {
        const responses = [
            "وعليكم السلام ورحمة الله وبركاته! 🌸",
            "أهلًا وسهلًا! نورت/نورتي 🎉",
            "مرحبتين! كيف الحال؟ 😊",
            "الله يسلمك! وين أخبارك؟ 🌟"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        return {
            type: 'greeting',
            original: input,
            response: randomResponse,
            explanation: this.generateExplanation(input),
            words: this.extractWords(input)
        };
    }

    // معالجة الأسئلة
    handleQuestion(input) {
        const questionType = this.detectQuestionType(input);
        let answer = '';

        switch (questionType) {
            case 'what':
                answer = this.answerWhatQuestion(input);
                break;
            case 'why':
                answer = this.answerWhyQuestion(input);
                break;
            case 'where':
                answer = this.answerWhereQuestion(input);
                break;
            case 'when':
                answer = this.answerWhenQuestion(input);
                break;
            case 'how':
                answer = this.answerHowQuestion(input);
                break;
            case 'who':
                answer = this.answerWhoQuestion(input);
                break;
            default:
                answer = this.answerGeneralQuestion(input);
        }

        return {
            type: 'question',
            original: input,
            response: answer,
            explanation: this.generateExplanation(input),
            words: this.extractWords(input),
            questionType: questionType
        };
    }

    // معالجة الطلبات
    handleRequest(input) {
        const request = this.extractRequest(input);
        const response = this.fulfillRequest(request);

        return {
            type: 'request',
            original: input,
            response: response,
            explanation: this.generateExplanation(input),
            words: this.extractWords(input),
            request: request
        };
    }

    // معالجة الأوامر
    handleCommand(input) {
        const command = this.extractCommand(input);
        const response = this.executeCommand(command);

        return {
            type: 'command',
            original: input,
            response: response,
            explanation: this.generateExplanation(input),
            words: this.extractWords(input),
            command: command
        };
    }

    // معالجة الشكاوى
    handleComplaint(input) {
        const complaint = this.extractComplaint(input);
        const response = this.addressComplaint(complaint);

        return {
            type: 'complaint',
            original: input,
            response: response,
            explanation: this.generateExplanation(input),
            words: this.extractWords(input),
            complaint: complaint
        };
    }

    // معالجة مصطلحات الأعمال
    handleBusiness(input) {
        const businessTerms = this.extractBusinessTerms(input);
        const response = this.explainBusinessTerms(businessTerms, input);

        return {
            type: 'business',
            original: input,
            response: response,
            explanation: this.generateExplanation(input),
            words: this.extractWords(input),
            terms: businessTerms
        };
    }

    // معالجة مصطلحات المخزون
    handleInventory(input) {
        const inventoryTerms = this.extractInventoryTerms(input);
        const response = this.explainInventoryTerms(inventoryTerms, input);

        return {
            type: 'inventory',
            original: input,
            response: response,
            explanation: this.generateExplanation(input),
            words: this.extractWords(input),
            terms: inventoryTerms
        };
    }

    // معالجة الرسائل غير المعروفة
    handleUnknown(input) {
        const words = this.extractWords(input);
        const translated = this.translateSudaneseText(input);

        return {
            type: 'unknown',
            original: input,
            response: `🤔 ما فهمت الجملة دي كويس. لكن هحاول أترجمها لك:\n\n"${translated}"`,
            explanation: this.generateExplanation(input),
            words: words,
            translation: translated
        };
    }

    // استخراج الكلمات من النص
    extractWords(input) {
        const words = input.split(' ');
        const extracted = [];

        words.forEach(word => {
            const cleanWord = word.trim();
            if (cleanWord) {
                const wordInfo = this.analyzeWord(cleanWord);
                extracted.push(wordInfo);
            }
        });

        return extracted;
    }

    // تحليل كلمة فردية
    analyzeWord(word) {
        const analysis = {
            word: word,
            isSudanese: false,
            meaning: '',
            category: '',
            examples: [],
            alternative: ''
        };

        // البحث في القاموس
        for (const [category, words] of Object.entries(this.sudaneseDictionary)) {
            if (words[word]) {
                analysis.isSudanese = true;
                analysis.meaning = words[word];
                analysis.category = category;
                analysis.alternative = this.findAlternative(word);
                break;
            }
        }

        // إذا لم تكن كلمة سودانية، ابحث إذا كانت تحتوي على كلمات سودانية
        if (!analysis.isSudanese) {
            for (const [sudaneseWord, meaning] of Object.entries(this.sudaneseDictionary.commonWords)) {
                if (word.includes(sudaneseWord)) {
                    analysis.isSudanese = true;
                    analysis.meaning = `تحتوي على كلمة سودانية: "${sudaneseWord}" تعني "${meaning}"`;
                    analysis.category = 'mixed';
                    break;
                }
            }
        }

        return analysis;
    }

    // توليد شرح للنص
    generateExplanation(input) {
        const words = this.extractWords(input);
        let explanation = "📖 شرح الجملة:\n\n";

        words.forEach((wordInfo, index) => {
            if (wordInfo.isSudanese) {
                explanation += `• "${wordInfo.word}" ➝ ${wordInfo.meaning} (${wordInfo.category})\n`;
            }
        });

        if (explanation === "📖 شرح الجملة:\n\n") {
            explanation += "✅ الجملة تحتوي على كلمات عربية فصحى بشكل أساسي";
        }

        return explanation;
    }

    // ترجمة النص السوداني
    translateSudaneseText(input) {
        let translated = input;
        
        // ترجمة الكلمات الشائعة
        Object.entries(this.sudaneseDictionary.commonWords).forEach(([sudanese, standard]) => {
            const regex = new RegExp(`\\b${sudanese}\\b`, 'gi');
            translated = translated.replace(regex, standard);
        });

        // ترجمة الأفعال
        Object.entries(this.sudaneseDictionary.verbs).forEach(([sudanese, standard]) => {
            const regex = new RegExp(`\\b${sudanese}\\b`, 'gi');
            translated = translated.replace(regex, standard);
        });

        return translated;
    }

    // البحث عن بديل للكلمة
    findAlternative(word) {
        const alternatives = {
            "شنو": ["ايش", "شو", "ماذا"],
            "عايز": ["عاوز", "نفسي", "ابغي", "اريد"],
            "ماشي": ["تمام", "زين", "حسناً"],
            "روح": ["اذهب", "امشي", "انطلق"]
        };

        return alternatives[word] || [];
    }

    // كشف نوع السؤال
    detectQuestionType(input) {
        if (input.includes('شنو') || input.includes('اش') || input.includes('شو')) return 'what';
        if (input.includes('ليه') || input.includes('لماذا')) return 'why';
        if (input.includes('وين') || input.includes('فين')) return 'where';
        if (input.includes('امتى') || input.includes('متى')) return 'when';
        if (input.includes('كيف')) return 'how';
        if (input.includes('شكون') || input.includes('من')) return 'who';
        return 'general';
    }

    // الإجابة على أسئلة "ماذا"
    answerWhatQuestion(input) {
        const responses = [
            "🔄 دي بتكون سؤال استفهام عن شيء معين",
            "❓ السؤال دا عايز تعرف حاجة محددة",
            "💡 عايز توضح اكتر عشان اقدر اساعدك؟"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // الإجابة على أسئلة "لماذا"
    answerWhyQuestion(input) {
        return "🤔 السؤال دا بيكون عن الأسباب والعلل. في العادة بنرد عليه بشرح السبب";
    }

    // الإجابة على أسئلة "أين"
    answerWhereQuestion(input) {
        return "📍 دي استفهام عن المكان. بنحتاج نعرف الموقع أو الجهة";
    }

    // الإجابة على أسئلة "متى"
    answerWhenQuestion(input) {
        return "⏰ استفهام عن الزمان. بنحتاج نحدد الوقت أو التاريخ";
    }

    // الإجابة على أسئلة "كيف"
    answerHowQuestion(input) {
        return "🔧 دي استفهام عن الكيفية أو الطريقة. بنحتاج نشرح الخطوات";
    }

    // الإجابة على أسئلة "من"
    answerWhoQuestion(input) {
        return "👤 استفهام عن الشخص أو الأشخاص. بنحتاج نحدد الهوية";
    }

    // الإجابة على الأسئلة العامة
    answerGeneralQuestion(input) {
        return "💭 سؤال جميل! تقدر توضح اكتر عشان اقدر اساعدك بشكل ادق؟";
    }

    // استخراج الطلب من الجملة
    extractRequest(input) {
        const patterns = [
            /عايز (.+)/,
            /عاوز (.+)/,
            /نفسي (.+)/,
            /حابة (.+)/,
            /حابب (.+)/,
            /ابغي (.+)/
        ];

        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match) {
                return match[1];
            }
        }

        return input;
    }

    // تلبية الطلب
    fulfillRequest(request) {
        return `👍 تمام، عايز ${request}. هحاول اساعدك في دا.`;
    }

    // استخراج الأمر من الجملة
    extractCommand(input) {
        const patterns = [
            /روح (.+)/,
            /تعال (.+)/,
            /قوم (.+)/,
            /قعد (.+)/,
            /شوف (.+)/,
            /اسمع (.+)/,
            /كلم (.+)/
        ];

        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match) {
                return match[1];
            }
        }

        return input;
    }

    // تنفيذ الأمر
    executeCommand(command) {
        return `⚡ أمر مفهوم: ${command}. تم التنفيذ افتراضيًا.`;
    }

    // استخراج الشكوى من الجملة
    extractComplaint(input) {
        // كلمات تدل على الشكوى
        const complaintWords = ['مشكلة', 'غلط', 'خطأ', 'ما عاجبني', 'ما زبط', 'تعبان', 'متعب'];
        
        for (const word of complaintWords) {
            if (input.includes(word)) {
                return input;
            }
        }

        return null;
    }

    // معالجة الشكوى
    addressComplaint(complaint) {
        if (!complaint) {
            return "😊 الحمد لله كل شيء تمام";
        }

        return `⚠️ فهمت ان فيه شكوى. هحاول اساعدك في حل المشكلة دي.`;
    }

    // استخراج مصطلحات الأعمال
    extractBusinessTerms(input) {
        const terms = [];
        Object.keys(this.sudaneseDictionary.businessTerms).forEach(term => {
            if (input.includes(term)) {
                terms.push(term);
            }
        });
        return terms;
    }

    // شرح مصطلحات الأعمال
    explainBusinessTerms(terms, originalInput) {
        if (terms.length === 0) {
            return "💼 الجملة فيها مصطلحات تجارية سودانية عامة";
        }

        let explanation = "🏪 مصطلحات تجارية سودانية في الجملة:\n\n";
        terms.forEach(term => {
            explanation += `• "${term}" ➝ ${this.sudaneseDictionary.businessTerms[term]}\n`;
        });

        return explanation;
    }

    // استخراج مصطلحات المخزون
    extractInventoryTerms(input) {
        const terms = [];
        Object.keys(this.sudaneseDictionary.inventoryTerms).forEach(term => {
            if (input.includes(term)) {
                terms.push(term);
            }
        });
        return terms;
    }

    // شرح مصطلحات المخزون
    explainInventoryTerms(terms, originalInput) {
        if (terms.length === 0) {
            return "📦 الجملة تتعلق بالمخزون والتخزين";
        }

        let explanation = "📊 مصطلحات المخزون في الجملة:\n\n";
        terms.forEach(term => {
            explanation += `• "${term}" ➝ ${this.sudaneseDictionary.inventoryTerms[term]}\n`;
        });

        return explanation;
    }

    // دوال الكشف عن الأنماط
    isGreeting(input) {
        const greetings = ['السلام', 'اهلا', 'مرحبا', 'صباح', 'مساء'];
        return greetings.some(greeting => input.includes(greeting));
    }

    isQuestion(input) {
        const questionWords = ['شنو', 'ليه', 'وين', 'امتى', 'كيف', 'قديه', 'شكون', 'فين'];
        return questionWords.some(word => input.includes(word));
    }

    isRequest(input) {
        const requestWords = ['عايز', 'عاوز', 'نفسي', 'حابة', 'حابب', 'ابغي'];
        return requestWords.some(word => input.includes(word));
    }

    isCommand(input) {
        const commandWords = ['روح', 'تعال', 'قوم', 'قعد', 'شوف', 'اسمع', 'كلم'];
        return commandWords.some(word => input.includes(word));
    }

    isComplaint(input) {
        const complaintWords = ['مشكلة', 'غلط', 'خطأ', 'ما عاجبني', 'ما زبط', 'تعبان', 'متعب'];
        return complaintWords.some(word => input.includes(word));
    }

    isBusinessRelated(input) {
        const businessWords = Object.keys(this.sudaneseDictionary.businessTerms);
        return businessWords.some(word => input.includes(word));
    }

    isInventoryRelated(input) {
        const inventoryWords = Object.keys(this.sudaneseDictionary.inventoryTerms);
        return inventoryWords.some(word => input.includes(word));
    }

    // الحصول على رسالة خطأ
    getErrorMessage(type) {
        const errors = {
            'الرسالة غير صالحة': '❌ الرسالة المرسلة غير صالحة. يرجى إرسال نص عربي سوداني',
            'فشل المعالجة': '🔧 حدث خطأ في معالجة الرسالة. يرجى المحاولة مرة أخرى',
            'غير متصل': '🌐 لا يوجد اتصال. يرجى التحقق من الاتصال بالإنترنت'
        };

        return {
            type: 'error',
            error: type,
            response: errors[type] || '❌ حدث خطأ غير معروف'
        };
    }

    // عرض رسالة في الواجهة
    displayMessage(message, sender = 'bot') {
        // هذه الدالة يمكن تعديلها حسب واجهة المستخدم
        console.log(`${sender === 'bot' ? '🤖' : '👤'}: ${message}`);
        
        // يمكن إضافة كود لعرض الرسالة في واجهة المستخدم
        if (typeof window !== 'undefined' && window.displayChatMessage) {
            window.displayChatMessage(message, sender);
        }
    }

    // تعلم كلمة جديدة
    learnNewWord(sudaneseWord, meaning, category = 'custom') {
        if (!this.sudaneseDictionary[category]) {
            this.sudaneseDictionary[category] = {};
        }
        
        this.sudaneseDictionary[category][sudaneseWord] = meaning;
        console.log(`✅ تم تعلم كلمة جديدة: "${sudaneseWord}" ➝ "${meaning}"`);
        
        // حفظ في التفضيلات
        this.userPreferences.favoriteWords.push({
            word: sudaneseWord,
            meaning: meaning,
            category: category,
            learnedAt: new Date().toISOString()
        });
        
        this.saveUserPreferences();
    }

    // الحصول على إحصائيات الاستخدام
    getUsageStats() {
        const totalWords = Object.values(this.sudaneseDictionary).reduce((total, category) => {
            return total + Object.keys(category).length;
        }, 0);

        return {
            totalWords: totalWords,
            categories: Object.keys(this.sudaneseDictionary).length,
            learnedWords: this.userPreferences.favoriteWords.length,
            dialect: this.dialect,
            version: this.version
        };
    }

    // تصدير البيانات
    exportData() {
        return {
            dictionary: this.sudaneseDictionary,
            preferences: this.userPreferences,
            stats: this.getUsageStats()
        };
    }

    // استيراد البيانات
    importData(data) {
        if (data.dictionary) {
            this.sudaneseDictionary = { ...this.sudaneseDictionary, ...data.dictionary };
        }
        if (data.preferences) {
            this.userPreferences = { ...this.userPreferences, ...data.preferences };
            this.saveUserPreferences();
        }
        
        console.log('✅ تم استيراد البيانات بنجاح');
    }

    // إعادة تعيين المساعد
    reset() {
        this.sudaneseDictionary = {
            // ... القيم الافتراضية
            greetings: this.sudaneseDictionary.greetings,
            commonWords: this.sudaneseDictionary.commonWords,
            verbs: this.sudaneseDictionary.verbs,
            businessTerms: this.sudaneseDictionary.businessTerms,
            inventoryTerms: this.sudaneseDictionary.inventoryTerms,
            expressions: this.sudaneseDictionary.expressions,
            uniqueSudanese: this.sudaneseDictionary.uniqueSudanese
        };
        
        this.userPreferences.favoriteWords = [];
        this.saveUserPreferences();
        
        console.log('🔄 تم إعادة تعيين المساعد');
    }
}

// إنشاء نسخة عامة للمساعد
window.SudaneseArabicAssistant = SudaneseArabicAssistant;

// التصدير للاستخدام في بيئات Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SudaneseArabicAssistant;
}

console.log('✅ تم تحميل المساعد الذكي السوداني بنجاح!');
