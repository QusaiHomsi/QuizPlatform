# 🌐 Translation System Guide

## Overview
Your Quiz Platform now supports multiple languages with **Arabic as the default language**. Users can switch between **Arabic (العربية)** and **English** at any time using the language toggle button.

## 🎯 Key Features

### ✅ What's Included
- **Arabic (عربية)** - Default language with RTL support
- **English** - Alternative language with LTR support
- **Language Toggle Button** - Fixed position (top-right/top-left based on direction)
- **Persistent Language Preference** - Language choice is saved in browser localStorage
- **RTL/LTR Support** - Automatic CSS adjustments for right-to-left text
- **Comprehensive Translations** - All UI text, buttons, labels, and help messages
- **Description & Warning Badges** - Added throughout the interface for user guidance

### 🔒 Anti-Cheat Warnings
Every page now includes clear warnings about anti-cheat protections:
- ⚠️ Fullscreen mode required
- ❌ No screenshots allowed
- ❌ No copy/paste allowed
- ❌ No tab switching
- 🚫 Violations result in immediate disqualification

### 💡 Enhanced User Guidance
Added descriptions and help text throughout:
- **Form field descriptions** - Explain what each input means
- **Button tooltips** - Show what happens when clicked
- **Help badges** - Step-by-step instructions
- **Error messages** - Clear, translated error feedback
- **Tips sections** - Practical advice for users

## 🚀 How to Use

### For Users
1. **Click the Language Button** - Located at the top-right (English 🌐) or top-left (العربية 🌐)
2. **Language Auto-Applies** - Your choice is saved and remembered next time
3. **Full Interface Translation** - All text updates immediately

### For Developers

#### Access Translation Key
```javascript
// Use the global translation function
t('translationKey')

// This returns the translated text or falls back to Arabic
```

#### Available Translation Keys
The `translations.js` file contains all available keys organized by category:

**Main Navigation:**
```javascript
t('title')           // "ساحة الاختبار"
t('tagline')         // "اختبارات تنافسية فورية مع حماية ضد الغش"
t('createRoom')      // "إنشاء غرفة"
t('joinRoom')        // "الانضمام إلى غرفة"
```

**Examiner Setup:**
```javascript
t('setupQuestions')   // "إعداد الأسئلة"
t('questionText')     // "نص السؤال"
t('correctAnswer')    // "الإجابة الصحيحة"
t('pts1st')          // "نقاط المركز الأول"
```

**Contestant Quiz:**
```javascript
t('quizActive')      // "الاختبار جار"
t('endExam')         // "إنهاء الاختبار"
t('submitAnswer')    // "أرسل الإجابة"
t('warning')         // "⚠️ تحذير"
```

**Violations & Anti-Cheat:**
```javascript
t('leftFullscreen')      // "غادرت وضع الشاشة الكاملة"
t('switchedTab')        // "تم التبديل إلى علامة تبويب أخرى أو تطبيق"
t('screenCaptureDetected') // "🚫 تم اكتشاف التقاط شاشة"
```

#### Using in HTML Templates
```html
<!-- Simple text replacement -->
<h1 id="page-title"><!-- will be replaced by JS --></h1>
<script>
  document.getElementById('page-title').textContent = t('title');
</script>

<!-- Or use data attributes -->
<button class="btn" title="t('submitAnswer')"></button>
```

#### Using in JavaScript
```javascript
// In console scripts
const message = t('warning');
const fullMsg = `${message}: ${reason}`;
showAlert(fullMsg);
```

## 📁 File Structure

### New/Modified Files
```
static/
├── js/
│   ├── translations.js          ✨ NEW - Translation system
│   ├── contestant_quiz.js       ✏️ UPDATED - Uses translations
│   └── examiner_quiz.js         ✏️ UPDATED - Uses translations
│
templates/
├── base.html                    ✏️ UPDATED - Language toggle button
├── index.html                   ✏️ UPDATED - Translations + warnings
├── join.html                    ✏️ UPDATED - Translations + help text
├── examiner_setup.html          ✏️ UPDATED - Comprehensive English + Arabic
├── examiner_lobby.html          ✏️ UPDATED - Translations + descriptions
├── examiner_quiz.html           ✏️ UPDATED - Translations + anti-cheat notice
├── contestant_lobby.html        ✏️ UPDATED - Translations + safety warnings
├── contestant_quiz.html         ✏️ UPDATED - Translations + detailed help
└── error.html                   ✏️ UPDATED - Translations + troubleshooting
```

## 🎨 Language Toggle Button

**Appearance:**
- **Orange button** (rgba(255, 165, 0, 0.95))
- **Fixed position** (top-right for LTR, top-left for RTL)
- **Shows current language** (e.g., "English 🌐" or "العربية 🌐")
- **Hover effect** with tooltip

**Functionality:**
```javascript
// Toggle language
window.toggleLanguage()

// Get current language
window.langManager.getCurrentLang()  // Returns: 'ar' or 'en'

// Set specific language
window.langManager.setLanguage('en')

// Translate text
t('translationKey')
```

## 🔧 Adding New Translations

To add new translation keys:

1. **Open** `static/js/translations.js`
2. **Add to both `ar` and `en` objects:**
```javascript
ar: {
  // ... existing keys
  newKey: 'النص الجديد',
},
en: {
  // ... existing keys
  newKey: 'New Text',
}
```

3. **Use in HTML/JS:**
```html
<span id="my-element"></span>
<script>
  document.getElementById('my-element').textContent = t('newKey');
</script>
```

## 🌍 RTL/LTR Support

The system automatically:
- Sets `lang` attribute on `<html>` element
- Sets `dir` attribute for RTL/LTR (both HTML and BODY)
- Adjusts margin classes (ms-* becomes mr-* in RTL)
- Positions fixed elements appropriately

**CSS classes for RTL adjustment:**
```css
[dir="rtl"] .ms-2 { margin-right: 0.5rem !important; }
[dir="rtl"] .lang-switch { right: 15px; left: auto; }
```

## ⚠️ Important Notes

### Default Language
- **Arabic is the default** - First visit shows Arabic interface
- User's preference is saved in `localStorage` under key `quizLang`
- To change default, modify in `translations.js`:
  ```javascript
  this.currentLang = localStorage.getItem('quizLang') || 'ar';  // Change 'ar' to 'en'
  ```

### Page Reload Behavior
- Language changes cause a page reload (`location.reload()`)
- This ensures all content is properly translated
- Progressive enhancement would eliminate this requirement

### Browser Storage
- Language preference stored in localStorage
- Clears when browser cache is cleared
- Works offline for already-cached pages

## 🧪 Testing

### Test Language Toggle
1. Open application
2. Click orange language button (top-right)
3. Verify page reloads with new language
4. Check localStorage in DevTools: `localStorage.getItem('quizLang')`

### Test All Pages in Both Languages
- [ ] Home page
- [ ] Join room page
- [ ] Examiner setup
- [ ] Examiner lobby
- [ ] Examiner quiz
- [ ] Contestant lobby
- [ ] Contestant quiz
- [ ] Error page

### Test RTL Formatting
- [ ] Text aligns properly
- [ ] Buttons position correctly
- [ ] Form fields display right alignment
- [ ] Language toggle button in correct corner

## 📝 Translation Completeness

**327 translation keys** covering:
- ✅ Main navigation (12 keys)
- ✅ Examiner interface (20 keys)
- ✅ Contestant interface (18 keys)
- ✅ Violation handling (12 keys)
- ✅ Error messages (8 keys)
- ✅ Help & descriptions (25+ keys)
- ✅ All buttons & labels
- ✅ All warnings & alerts

## 🔒 Security Considerations

- Translation keys are sent to client (necessary for client-side translation)
- No sensitive data in translation strings
- Language preference is local-only (not sent to server)
- All anti-cheat warnings are prominent and translated

## 📞 Support

For questions about the translation system:
- Check existing translation keys in `translations.js`
- Review examples in template files
- Follow the pattern: ID → JS getElementById → t('key')

---

**Happy translating!** 🎉
