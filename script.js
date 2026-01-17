/* التنقل بين الأقسام */
function showSection(sectionId) {
    // إخفاء جميع الأقسام
    document.getElementById('story-section').classList.remove('active-section');
    document.getElementById('story-section').classList.add('hidden-section');
    
    document.getElementById('quiz-section').classList.remove('active-section');
    document.getElementById('quiz-section').classList.add('hidden-section');

    // إظهار القسم المطلوب
    const target = document.getElementById(sectionId);
    target.classList.remove('hidden-section');
    target.classList.add('active-section');
    
    // سكرول لأعلى الصفحة
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* نافذة الفيديو */
function toggleVideoModal() {
    const modal = document.getElementById('video-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

/* الكلمة المخفية (إكمال الفراغ) */
function revealWord(element) {
    if (!element.classList.contains('revealed')) {
        element.classList.add('revealed');
        // يمكن إضافة صوت تشجيعي هنا
    }
}

/* منطق التوصيل (Matching Game) */
let selectedSource = null;

// إضافة مستمعي الأحداث للعناصر
document.querySelectorAll('.col-a .match-item').forEach(item => {
    item.addEventListener('click', function() {
        if (this.classList.contains('solved')) return;

        // إزالة التحديد السابق
        document.querySelectorAll('.col-a .match-item').forEach(i => i.classList.remove('selected'));
        
        this.classList.add('selected');
        selectedSource = this;
    });
});

document.querySelectorAll('.col-b .match-item').forEach(item => {
    item.addEventListener('click', function() {
        if (!selectedSource || this.classList.contains('solved')) return;

        const sourceId = selectedSource.getAttribute('data-id');
        const targetMatch = this.getAttribute('data-match');

        if (sourceId === targetMatch) {
            // إجابة صحيحة
            handleCorrectMatch(selectedSource, this);
            selectedSource = null;
        } else {
            // إجابة خاطئة
            this.style.animation = "shake 0.5s";
            setTimeout(() => this.style.animation = "", 500);
        }
    });
});
// نظام تصحيح الاختيار من متعدد
document.querySelectorAll('.options input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const parentLabel = this.parentElement;
        const allLabelsInGroup = parentLabel.parentElement.querySelectorAll('.option-label');

        // إعادة الشكل الطبيعي لكل الخيارات في نفس السؤال أولاً
        allLabelsInGroup.forEach(label => {
            label.classList.remove('correct-selected', 'wrong-selected');
        });

        // فحص القيمة
        if (this.value === 'correct') {
            parentLabel.classList.add('correct-selected');
            // صوت تشجيعي بسيط (اختياري)
            console.log("إجابة صحيحة!");
        } else {
            parentLabel.classList.add('wrong-selected');
            // إضافة اهتزاز عند الخطأ
            parentLabel.style.animation = "shake 0.5s";
            setTimeout(() => parentLabel.style.animation = "", 500);
        }
    });
});

function handleCorrectMatch(source, target) {
    source.classList.remove('selected');
    source.classList.add('solved');
    target.classList.add('solved');
    
    drawLine(source, target);
}

// رسم الخط بين العنصرين
function drawLine(startElem, endElem) {
    const svg = document.getElementById('lines-svg');
    const svgRect = svg.getBoundingClientRect();
    const startRect = startElem.getBoundingClientRect();
    const endRect = endElem.getBoundingClientRect();

    // حساب إحداثيات النقاط بالنسبة للـ SVG
    const x1 = startRect.left - svgRect.left + 10; // من اليسار (لأن الاتجاه RTL)
    const y1 = startRect.top - svgRect.top + (startRect.height / 2);
    
    const x2 = endRect.right - svgRect.left - 10; // إلى يمين العنصر في العمود الثاني
    const y2 = endRect.top - svgRect.top + (endRect.height / 2);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#2ecc71"); // لون أخضر للنجاح
    line.setAttribute("stroke-width", "3");
    
    svg.appendChild(line);
}

// إضافة انيميشن للاهتزاز عند الخطأ في CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}`;
document.head.appendChild(styleSheet);