# 🌐 QuizArena Language & Safety Guide

## Quick Start: Switching Languages

### 🔘 Language Button
- **Location:** Top-right corner (English) or top-left corner (Arabic)
- **Appearance:** Orange button with "English 🌐" or "العربية 🌐"
- **How to Use:** Click once to switch language
- **Page Reloads:** Yes - entire interface updates to new language
- **Saved:** Your choice is remembered next visit

### Example
```
Visit QuizArena
  ↓
See English 🌐 button
  ↓
Click the button
  ↓
See العربية 🌐 button (Arabic now default)
  ↓
Come back tomorrow → Arabic will still be showing
```

---

## 📋 Available Languages

### العربية (Arabic)
- **Default Language**
- **Text Direction:** Right-to-Left
- **Includes:** All 327 UI terms, buttons, warnings, and help text
- **Button Shows:** English 🌐

### English
- **Alternative Language**
- **Text Direction:** Left-to-Right
- **Includes:** All 327 UI terms, buttons, warnings, and help text
- **Button Shows:** العربية 🌐

---

## 🔒 Anti-Cheat & Safety Warnings

### You'll See Warnings On:

#### 1. **Home Page** ⚠️
```
🔒 Anti-cheat protection is enabled
Not allowed: copying, pasting, screenshots, 
tab switching, or leaving fullscreen
```

#### 2. **Join Page** ⚠️
```
⚠️ Warning: Cheating will result in 
immediate disqualification
```

#### 3. **Before Quiz Starts** 🚫
```
🔒 Anti-Cheat Active:
  ❌ Screenshots not allowed
  ❌ Copy/Paste disabled
  ❌ Tab switching will trigger warning
  ❌ Leaving fullscreen will trigger warning
  🚫 2 warnings = automatic disqualification
```

#### 4. **During Quiz** 
- Real-time monitoring
- Warnings displayed if you violate rules
- Automatic disqualification after 2 warnings

---

## ⚠️ Important Rules

### ALLOWED ✅
- Answer questions carefully
- Take time to think
- Read each question fully
- Select your best answer
- Answer as quickly as you can (speed = points!)

### NOT ALLOWED ❌
1. **Screenshots** - Cannot capture the screen
2. **Copy/Paste** - Cannot copy questions or paste answers
3. **Tab Switching** - Must stay in the quiz
4. **Leaving Fullscreen** - Must keep quiz maximized
5. **Using Overlays** - Cannot enable circle-to-search or overlays

### PENALTIES 🚫
- **1st Violation:** ⚠️ Warning (must acknowledge)
- **2nd Violation:** 🚫 Automatic Disqualification (GAME OVER)

---

## 🚀 Tips for Success

### As a Contestant
1. **Read Rules First** - Understand anti-cheat requirements
2. **Stay Focused** - Don't switch tabs or minimize
3. **Answer Quickly** - Speed matters for points
4. **Be Accurate** - Correct answer + fast time = max points
5. **No Cheating** - One mistake = warning, two = out

### As an Examiner
1. **Share Code** - Tell contestants the room code
2. **Check Setup** - Verify all questions before starting
3. **Monitor Quiz** - Watch the contestant dashboard
4. **Enable Fullscreen** - Tell contestants to go fullscreen
5. **Record Results** - All scores are automatically tracked

---

## 📱 What You Can't Do

| ❌ Action | What Happens |
|-----------|-------------|
| Take screenshot | Screen capture detected → Warning |
| Copy text | Copy blocked → Silent (no action needed) |
| Paste text | Paste blocked → Silent |
| Switch browser tab | Tab switch detected → Warning |
| Minimize window | Focus lost → Warning |
| Open developer tools | Tools blocked → Prevented |
| Right-click menu | Context menu blocked → Prevented |
| Drag/drop files | Drag blocked → Prevented |

---

## 📊 Scoring System

### Points Awarded
Only **correct answers** earn points.

| Position | Points Example |
|----------|---|
| 🥇 1st (fastest) | 300 points |
| 🥈 2nd | 200 points |
| 🥉 3rd | 100 points |
| Others (correct but slow) | 0 points |
| Wrong answer | 0 points |

**Speed = Points:** Being fast & correct beats being slow & correct!

---

## 🎯 Fullscreen Mode

### Why Required?
Fullscreen prevents:
- Alt-tabbing to other windows
- Opening overlays (like Circle to Search)
- Seeing browser tabs
- Accessing other apps

### How to Enable Fullscreen
1. **Auto-Request:** Quiz may ask permission
2. **Manual:** Press `F11` or browser fullscreen button
3. **On Demand:** Examiner can require before starting

### Left Fullscreen?
- ⚠️ You'll get a warning
- 📛 Alt-tab back to the quiz
- 🚫 2 warnings = disqualified

---

## 🆘 If You Get Disqualified

### What Happens
- 🚫 Large "DISQUALIFIED" message appears
- 📝 Reason for disqualification shown
- ⏹️ Quiz ends immediately
- 0️⃣ Scores are zeroed out

### Reasons
- Screen capture attempt
- Tab switching (2nd time)
- Leaving fullscreen (2nd time)
- Copy/paste attempt
- Other violations

### Appeal?
- Contact your examiner
- Explain the situation
- Examiner has final say

---

## 💬 Language Features

### Available Everywhere
- All buttons & menus
- All error messages
- All warnings & alerts
- All form labels & descriptions
- All help text & tips

### Form Descriptions
Every field has helpful descriptions:
```
Room Code
Unique 6-character code for each room
💡 Ask your examiner for this code
```

### Button Tooltips
Hover over buttons to see what they do:
```
Start Quiz (hover)
↓
"Click to begin the quiz for all contestants"
```

### Help Badges
Instructions appear on every page:
```
💡 Help: Setup Instructions
1. Add questions below
2. Choose type (Text or Multiple Choice)
3. Set correct answer & points
4. Click "Save & Go to Lobby"
```

---

## 🔧 Troubleshooting

### "Language Won't Switch"
1. Click orange button (top-right or top-left)
2. Wait for page to reload (5-10 seconds)
3. Check if language changed
4. Clear browser cache if still stuck

### "I Can't See the Language Button"
- Refresh the page
- Check top-right corner (English) or top-left (Arabic)
- If still missing, check browser console for errors

### "Quiz Won't Start in Arabic"
- Set Arabic as default
- Click language button → go to العربية
- Refresh the quiz page
- All content should now be in Arabic

### "Got Disqualified Unfairly"
1. Take screenshot of the warning (before it disappears)
2. Note the exact reason
3. Contact your examiner immediately
4. Explain what happened
5. Examiner can override and restart

---

## 📞 Support

### For Contestants
- Ask your examiner about:
  - Room code
  - Quiz rules
  - Technical problems
  - Disqualification appeals

### For Examiners
- Check TRANSLATION_GUIDE.md for technical details
- Check IMPLEMENTATION_SUMMARY.md for features

### Common Questions

**Q: Can I change language during the quiz?**
A: Yes, but the quiz will pause while page reloads.

**Q: Does Arabic support right-to-left text?**
A: Yes, fully. All text, buttons, and layouts automatically adjust.

**Q: Will my language choice be remembered?**
A: Yes, it's saved in your browser. Next visit will show the same language.

**Q: Can I use multiple languages in questions?**
A: Yes, translations only affect the interface, not question content.

**Q: What if my language isn't supported?**
A: Currently support Arabic & English. More can be added by administrators.

---

## 🎓 Quiz Etiquette

### Good Practice ✅
- Study beforehand
- Answer honestly
- Stay focused
- Respect the rules
- Help others understand the system

### Bad Practice ❌
- Try to cheat (will fail!)
- Use reference materials
- Open other windows
- Share answers
- Attempt to bypass security

---

Remember:
> **The quiz system monitors everything. Play fair, answer fast, and win!**

---

**Last Updated:** March 9, 2026
**Language Support:** Arabic (العربية) + English (English)
**Status:** Ready to use! ✅
