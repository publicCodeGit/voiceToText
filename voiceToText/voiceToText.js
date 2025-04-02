export class SpeechToText {
    constructor(inputElement, micIcon) {
        this.inputElement = inputElement;
        this.micIcon = micIcon;
        this.recognition = null;
        this.isRecording = false;
        this.finalTranscript = ""; // משתנה לשמירת טקסט סופי
        this.initSpeechRecognition();
    } 

    initSpeechRecognition() {
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.recognition.continuous = false;
            this.recognition.interimResults = true; // תוצאות בזמן אמת
            this.recognition.lang = "he-IL";

            this.recognition.onstart = () => {
                this.isRecording = true;
                this.micIcon.classList.add("recording");
                this.micIcon.classList.replace('fa-microphone', 'fa-microphone-slash');
                this.inputElement.disabled = true;
            };

            this.recognition.onresult = (event) => {
                let interimTranscript = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        this.finalTranscript += " " + event.results[i][0].transcript; // שמירת טקסט סופי
                    } else {
                        interimTranscript = event.results[i][0].transcript; // עדכון טקסט זמני
                    }
                }

                // הצגת הטקסט הסופי + טקסט ביניים
                this.inputElement.value = (this.finalTranscript + " " + interimTranscript).trim();

                // הגדלת כמות השורות ב-TextArea אם קיים
                if (this.inputElement.tagName.toLowerCase() === "textarea") {
                    this.auto_grow(this.inputElement);
                }
            };

            this.recognition.onend = () => {
                this.isRecording = false;
                this.micIcon.classList.remove("recording");
                this.micIcon.classList.replace('fa-microphone-slash', 'fa-microphone');
                this.inputElement.disabled = false;
            };

            this.recognition.onerror = (event) => {
                console.error("Speech recognition error", event);
                this.micIcon.classList.remove("recording");
                this.micIcon.classList.replace('fa-microphone-slash', 'fa-microphone');
                this.inputElement.disabled = false;
            };
        } else {
            alert("Your browser does not support speech recognition");
            this.micIcon.disabled = true;
        }

        this.micIcon.addEventListener("click", () => this.toggleSpeechRecognition());
    }

    toggleSpeechRecognition() {
        if (this.isRecording) {
            this.recognition.stop();
        } else {
            this.finalTranscript = this.inputElement.value.trim(); // שמירת מה שהיה קודם
            this.recognition.start();
        }
    }

    auto_grow(element) {
        element.style.height = "5px";
        element.style.height = (element.scrollHeight) + "px";
    }

    // פונקציה לטעינת SpeechToText מחדש
    reloadSpeechToText() {
        const micIcons = document.querySelectorAll('.microphone-btn');
        micIcons.forEach((micIcon) => {
            const inputId = micIcon.getAttribute("data-input-id");
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                new SpeechToText(inputElement, micIcon);
            }
        });
    }
}

// יצירת אובייקטים עבור כל שדה טקסט עם אייקון המיקרופון
document.addEventListener("DOMContentLoaded", function () {
    const micIcons = document.querySelectorAll('.microphone-btn');

    micIcons.forEach((micIcon) => {
        const inputId = micIcon.getAttribute("data-input-id");
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            new SpeechToText(inputElement, micIcon);
        }
    });
});

// ייצוא הפונקציה כך שנוכל לקרוא לה מתוך קוד חיצוני
export function initializeSpeechToText() {
    const micIcons = document.querySelectorAll('.microphone-btn');
    micIcons.forEach((micIcon) => {
        const inputId = micIcon.getAttribute("data-input-id");
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            new SpeechToText(inputElement, micIcon);
        }
    });
}

export function reloadSpeechToText() {
    const micIcons = document.querySelectorAll('.microphone-btn');
    micIcons.forEach((micIcon) => {
        const inputId = micIcon.getAttribute("data-input-id");
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            new SpeechToText(inputElement, micIcon);
        }
    });
}
