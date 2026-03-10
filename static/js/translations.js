/**
 * Translation System for QuizArena
 * Supports: Arabic (default) and English
 */

const translations = {
  ar: {
    // ── Main Menu & Navigation ──
    title: 'ساحة الاختبار',
    copyCode : 'نسخ الرمز',
    tagline: 'اختبارات تنافسية فورية مع حماية ضد الغش',
    createRoom: 'إنشاء غرفة',
    joinRoom: 'الانضمام إلى غرفة',
    createRoomDesc: 'قم بإعداد الأسئلة والتحكم في الاختبار وتتبع النتائج.',
    joinRoomDesc: 'أدخل رمز الغرفة والمنافسة مع الآخرين.',
    yourName: 'اسمك',
    yourNameDesc: 'أدخل اسمك الكامل أو لقبك',
    examinerName: 'اسم المراقب',
    examinerNameDesc: 'سيظهر لجميع المتنافسين',
    roomCode: 'رمز الغرفة',
    roomCodeDesc: 'رمز فريد من 6 أحرف لكل غرفة',
    lang: 'اللغة',
    langDesc: 'اختر لغة الواجهة',

    // ── Examiner Setup ──
    setupQuestions: 'إعداد الأسئلة',
    addQuestion: '+ إضافة سؤال',
    questionText: 'نص السؤال',
    questionType: 'النوع',
    openText: 'نص مفتوح',
    multipleChoice: 'اختيار متعدد',
    correctAnswer: 'الإجابة الصحيحة',
    correctAnswerDesc: 'يجب أن تطابق تماماً أحد الخيارات (للاختيار المتعدد)',
    options: 'الخيارات (واحد لكل سطر)',
    optionsDesc: 'أضف كل خيار في سطر منفصل',
    note: 'ملاحظة / شرح (اختياري)',
    noteDesc: 'سيتم عرضه بعد الكشف عن الإجابة الصحيحة',
    pts1st: 'نقاط المركز الأول',
    pts2nd: 'نقاط المركز الثاني',
    pts3rd: 'نقاط المركز الثالث',
    remove: '✕ حذف',
    question: 'سؤال',
    saveGo: 'حفظ والذهاب إلى الردهة →',
    saveGoDesc: 'حفظ جميع الأسئلة والانتقال إلى واجهة المراقب',

    // ── Examiner Lobby ──
    examinerLobby: 'ردهة المراقب',
    contestants: 'المتنافسون',
    startQuiz: 'ابدأ الاختبار',
    startQuizDesc: 'انقر لبدء الاختبار لجميع المتنافسين',
    waitingForContestants: 'بانتظار المتنافسين...',
    noContestants: 'لا توجد متنافسون حتى الآن',
    disqualify: 'استبعد',
    disqualifyDesc: 'حذف المتنافس من الاختبار',

    // ── Examiner Quiz ──
    examinerQuiz: 'واجهة المراقب',
    nextQuestion: 'السؤال التالي',
    nextQuestionDesc: 'انتقل إلى السؤال التالي',
    showAnswers: 'اعرض الإجابات',
    showAnswersDesc: 'اكشف الإجابات الصحيحة',
    finalResults: 'النتائج النهائية',
    finalResultsDesc: 'عرض ترتيب جميع المتنافسين',

    // ── Contestant Quiz ──
    quizActive: 'الاختبار جار',
    endExam: 'إنهاء الاختبار',
    endExamDesc: 'انقر لإنهاء الاختبار الخاص بك',
    submitAnswer: 'أرسل الإجابة',
    submitAnswerDesc: 'أرسل إجابتك الآن',
    waitingForOthers: '⏳ بانتظار الآخرين...',
    correct: '✅ صحيح!',
    incorrect: '❌ خاطئ',
    topThisRound: 'أفضل 3 في هذا الجولة:',
    finalBoard: '🏆 الترتيب النهائي',

    // ── Violations & Warnings ──
    warning: '⚠️ تحذير',
    warningDesc: 'لقد تم تسجيل التحذير - التحذير التالي = الاستبعاد',
    disqualified: 'تم استبعادك من الاختبار',
    disqualifiedDesc: 'لم تعد قادراً على المشاركة',
    leftFullscreen: 'غادرت وضع الشاشة الكاملة',
    switchedTab: 'تم التبديل إلى علامة تبويب أخرى أو تطبيق',
    screenCaptureDetected: '🚫 تم اكتشاف التقاط شاشة',
    screenCaptureRecorded: 'تم تسجيل هذا الحادث',
    copyDetected: '❌ محاولة نسخ تم اكتشافها',
    pasteDetected: '❌ محاولة لصق تم اكتشافها',
    rightClickDetected: '❌ تم اكتشاف الضغط على زر اليمين',
    screenshotDetected: '❌ محاولة لقطة شاشة تم اكتشافها',

    // ── Error Messages ──
    error: 'خطأ',
    invalidCode: 'رمز الغرفة غير صحيح',
    roomNotFound: 'الغرفة غير موجودة أو مغلقة',
    alreadyAnswered: 'لقد أجبت على هذا السؤال بالفعل',
    invalidAnswer: 'إجابة غير صحيحة',
    required: 'هذا الحقل مطلوب',
    minLength: 'يجب أن يكون الطول 3 أحرف على الأقل',

    // ── Descriptions & Help ──
    fullscreenWarning: '⚠️ يجب أن تكون في وضع الشاشة الكاملة',
    antiCheatWarning: '🔒 تم تفعيل حماية مضادة للغش',
    antiCheatDesc: 'لا يُسمح بـ: نسخ، لصق، لقطات شاشة، تبديل علامات التبويب، أو مغادرة الشاشة الكاملة',
    quizRules: 'قواعد الاختبار',
    quizRulesDesc: 'يرجى قراءة القواعد بعناية قبل البدء',
    plagiarismWarning: '⚠️ تحذير: الغش سيؤدي إلى الاستبعاد الفوري',
    practiceTest: 'اختبار تدريبي - لا تقلق!',
    realExam: 'اختبار حقيقي - كن حذراً!',
  },
  en: {
    // ── Main Menu & Navigation ──
    title: 'QuizArena',
    copyCode : 'Copy Code ',
    tagline: 'Real-time competitive quizzes with anti-cheat protection',
    createRoom: 'Create a Room',
    joinRoom: 'Join a Room',
    createRoomDesc: 'Set up questions, control the quiz, and track results.',
    joinRoomDesc: 'Enter a room code and compete against others.',
    yourName: 'Your Name',
    yourNameDesc: 'Enter your full name or nickname',
    examinerName: 'Examiner Name',
    examinerNameDesc: 'Will be displayed to all contestants',
    roomCode: 'Room Code',
    roomCodeDesc: 'Unique 6-character code for each room',
    lang: 'Language',
    langDesc: 'Choose interface language',

    // ── Examiner Setup ──
    setupQuestions: 'Setup Questions',
    addQuestion: '+ Add Question',
    questionText: 'Question Text',
    questionType: 'Type',
    openText: 'Open Text',
    multipleChoice: 'Multiple Choice',
    correctAnswer: 'Correct Answer',
    correctAnswerDesc: 'Must match exactly one option (for MCQ)',
    options: 'Options (one per line)',
    optionsDesc: 'Add each option on a separate line',
    note: 'Note / Explanation (optional)',
    noteDesc: 'Shown after correct answer is revealed',
    pts1st: '1st Place Points',
    pts2nd: '2nd Place Points',
    pts3rd: '3rd Place Points',
    remove: '✕ Remove',
    question: 'Question',
    saveGo: 'Save & Go to Lobby →',
    saveGoDesc: 'Save all questions and proceed to examiner interface',

    // ── Examiner Lobby ──
    examinerLobby: 'Examiner Lobby',
    contestants: 'Contestants',
    startQuiz: 'Start Quiz',
    startQuizDesc: 'Click to start the quiz for all contestants',
    waitingForContestants: 'Waiting for contestants...',
    noContestants: 'No contestants yet',
    disqualify: 'Disqualify',
    disqualifyDesc: 'Remove contestant from the quiz',

    // ── Examiner Quiz ──
    examinerQuiz: 'Examiner Quiz',
    nextQuestion: 'Next Question',
    nextQuestionDesc: 'Move to the next question',
    showAnswers: 'Show Answers',
    showAnswersDesc: 'Reveal correct answers',
    finalResults: 'Final Results',
    finalResultsDesc: 'Display final rankings',

    // ── Contestant Quiz ──
    quizActive: 'Quiz Active',
    endExam: 'End Exam',
    endExamDesc: 'Click to end your exam',
    submitAnswer: 'Submit Answer',
    submitAnswerDesc: 'Submit your answer now',
    waitingForOthers: '⏳ Waiting for others...',
    correct: '✅ Correct!',
    incorrect: '❌ Incorrect',
    topThisRound: 'Top 3 this round:',
    finalBoard: '🏆 Final Rankings',

    // ── Violations & Warnings ──
    warning: '⚠️ Warning',
    warningDesc: 'Warning has been recorded - next warning = disqualification',
    disqualified: 'You have been disqualified',
    disqualifiedDesc: 'You can no longer participate',
    leftFullscreen: 'Left fullscreen mode',
    switchedTab: 'Switched to another tab or app',
    screenCaptureDetected: '🚫 Screen capture detected',
    screenCaptureRecorded: 'This incident has been recorded',
    copyDetected: '❌ Copy attempt detected',
    pasteDetected: '❌ Paste attempt detected',
    rightClickDetected: '❌ Right-click detected',
    screenshotDetected: '❌ Screenshot attempt detected',

    // ── Error Messages ──
    error: 'Error',
    invalidCode: 'Invalid room code',
    roomNotFound: 'Room not found or closed',
    alreadyAnswered: 'You already answered this question',
    invalidAnswer: 'Invalid answer',
    required: 'This field is required',
    minLength: 'Must be at least 3 characters',

    // ── Descriptions & Help ──
    fullscreenWarning: '⚠️ You must be in fullscreen mode',
    antiCheatWarning: '🔒 Anti-cheat protection is enabled',
    antiCheatDesc: 'Not allowed: copying, pasting, screenshots, tab switching, or leaving fullscreen',
    quizRules: 'Quiz Rules',
    quizRulesDesc: 'Please read the rules carefully before starting',
    plagiarismWarning: '⚠️ Warning: Cheating will result in immediate disqualification',
    practiceTest: 'Practice Test - No Worries!',
    realExam: 'Real Exam - Be Careful!',
  }
};

// ── Initialize Language System ──
class LanguageManager {
  constructor() {
    // Default to Arabic, or check localStorage
    this.currentLang = localStorage.getItem('quizLang') || 'ar';
    this.applyLanguage(this.currentLang);
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('quizLang', lang);
      this.applyLanguage(lang);
      // Dispatch custom event for other scripts
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
      // Reload page to apply language change
      location.reload();
    }
  }

  applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  t(key) {
    return translations[this.currentLang][key] || translations.ar[key] || key;
  }

  getCurrentLang() {
    return this.currentLang;
  }
}

// ── Global language manager instance ──
window.langManager = new LanguageManager();

// ── Helper function for translation in templates ──
function t(key) {
  return window.langManager.t(key);
}
