from fastapi import APIRouter, Depends
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.utils.database import get_database
from langdetect import detect

# 🚨 Disable transformer-based model (too heavy for your laptop)
# Instead use Rule-based + lightweight fallback

router = APIRouter(prefix="/api/chat", tags=["Chatbot"])


# Request model
class ChatRequest(BaseModel):
    message: str
    session_id: str = "patient123"


# Response model
class ChatResponse(BaseModel):
    reply: str
    lang: str


# -------------------------
# SIMPLE KNOWLEDGE BASE
# -------------------------

knowledge = {
    # ---------------------------------------------------
    # GENERAL COMMUNICATION (ENGLISH)
    # ---------------------------------------------------
    "hi": "Hello! 👋 How can I help you today?",
    "hello": "Hello! 😊 How can I assist you?",
    "hey": "Hey there! How are you feeling today?",
    "good morning": "Good morning! ☀ Hope you're doing well.",
    "good afternoon": "Good afternoon! How can I support your health today?",
    "good evening": "Good evening! How may I assist you?",
    "how are you": "I'm doing great! Thanks for asking. How can I help you?",
    "thank you": "You're welcome! 💚 Let me know if you have more questions.",
    "thanks": "Glad to help! 😊",
    "ok": "Alright! Do you want to know anything about AFI or pregnancy?",
    "who are you": "I am your AFI Health Assistant 🤖 here to help you with pregnancy care and AFI guidance.",
    "what can you do": "I can answer questions about AFI, pregnancy, diet, baby movement, symptoms, and general health tips.",

    # ---------------------------------------------------
    # GENERAL COMMUNICATION (KANNADA)
    # ---------------------------------------------------
    "hi kannada": "ನಮಸ್ಕಾರ! 😊 ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    "hello kannada": "ಹಲೋ! ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರಿಸುವುದಕ್ಕೆ ಸಿದ್ಧ.",
    "namaste": "ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಾ?",
    "good morning kannada": "ಶುಭೋದಯ! ಇಂದು ನಿಮ್ಮ ಆರೋಗ್ಯ ಹೇಗಿದೆ?",
    "good afternoon kannada": "ಶುಭ ಮಧ್ಯಾಹ್ನ! ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    "good evening kannada": "ಶುಭ ಸಂಜೆ! ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಏನು?",
    "thank you kannada": "ಧನ್ಯವಾದಗಳು! ಇನ್ನೇನು ಸಹಾಯ ಬೇಕು?",
    "thanks kannada": "ಸರಿ! ಮತ್ತೆ ಕೇಳಿ.",

    # ---------------------------------------------------
    # BASIC AFI QUESTIONS
    # ---------------------------------------------------
    "what is afi": "AFI (Amniotic Fluid Index) is the measurement of the fluid around your baby using ultrasound.",
    "afi meaning": "AFI means Amniotic Fluid Index—used to measure amniotic fluid levels for fetal health.",
    "afi full form": "AFI stands for Amniotic Fluid Index.",
    "how afi measured": "AFI is measured by dividing the uterus into four quadrants and measuring the deepest pocket of fluid in each.",

    # ---------------------------------------------------
    # AFI RANGES & CONDITIONS
    # ---------------------------------------------------
    "afi normal range": "Normal AFI range is 8 to 24 cm.",
    "low afi": "Low AFI (Oligohydramnios) is when AFI is below 5 cm. It needs monitoring.",
    "high afi": "High AFI (Polyhydramnios) is when AFI is above 24 cm.",
    "reduce high afi": "Avoid sugary foods, stay hydrated, and follow up regularly. Doctor guidance is essential.",
    "increase low afi": "Drink more water, rest on your left side, and monitor regularly with your doctor.",

    # ---------------------------------------------------
    # AFI QUESTIONS IN KANNADA
    # ---------------------------------------------------
    "afi ಅರ್ಥ ಏನು": "AFI ಅಂದರೆ Amniotic Fluid Index — ಗರ್ಭದಲ್ಲಿರುವ ನೀರಿನ ಪ್ರಮಾಣವನ್ನು ಅಳೆಯುವ ವಿಧ.",
    "ಸಾಮಾನ್ಯ afi ಎಷ್ಟು": "ಸಾಮಾನ್ಯ AFI 8cm ರಿಂದ 24cm ನಡುವೆ ಇರುತ್ತದೆ.",
    "ಕಡಿಮೆ afi": "5cm ಕ್ಕಿಂತ ಕಡಿಮೆ ಇದ್ದರೆ ಅದನ್ನು Oligohydramnios ಎಂದು ಕರೆಯುತ್ತಾರೆ.",
    "ಹೆಚ್ಚು afi": "24cm ಕ್ಕಿಂತ ಹೆಚ್ಚು ಇದ್ದರೆ Polyhydramnios ಎಂದು ಕರೆಯುತ್ತಾರೆ.",

    # ---------------------------------------------------
    # BABY MOVEMENT QUESTIONS
    # ---------------------------------------------------
    "when will baby start kicking": "Baby movements start between 18–22 weeks.",
    "why baby not moving": "Less movement should be checked immediately. Drink water and lie on your left side.",
    "baby movement normal": "10 movements in 2 hours is generally normal.",

    # ---------------------------------------------------
    # PREGNANCY DIET & TIPS
    # ---------------------------------------------------
    "pregnancy diet": "Eat iron-rich foods, fruits, vegetables, whole grains, and drink enough water.",
    "foods to avoid": "Avoid raw meat, unpasteurized milk, alcohol, and high caffeine.",
    "best fruits during pregnancy": "Bananas, apples, pomegranates, oranges, avocados, and berries.",
    "water intake": "Pregnant women should drink 8–10 glasses of water daily.",
    "can i exercise": "Yes, light walking and prenatal yoga are safe unless your doctor advises otherwise.",

    # ---------------------------------------------------
    # COMMON PREGNANCY SYMPTOMS
    # ---------------------------------------------------
    "morning sickness": "Nausea and vomiting in early pregnancy is common and usually improves after 12–14 weeks.",
    "back pain pregnancy": "Use warm compress, sleep sideways, and avoid heavy lifting.",
    "swelling in feet": "Mild swelling is normal. Drink water and avoid long standing.",
    "headache during pregnancy": "Due to hormones and dehydration. Drink water and rest.",

    # ---------------------------------------------------
    # MEDICAL CONDITIONS
    # ---------------------------------------------------
    "what is placenta previa": "Placenta previa is when the placenta covers the cervix.",
    "what is preeclampsia": "Preeclampsia includes high BP, swelling, and protein in urine.",
    "what is gestational diabetes": "Gestational diabetes occurs only during pregnancy and needs dietary control.",

    # ---------------------------------------------------
    # DELIVERY & LABOR
    # ---------------------------------------------------
    "signs of labor": "Strong contractions, water breaking, back pressure, and dilation.",
    "normal delivery tips": "Do walking, breathing exercises, pelvic stretches, and stay hydrated.",

    # ---------------------------------------------------
    # NEWBORN CARE
    # ---------------------------------------------------
    "newborn care tips": "Breastfeed every 2–3 hours, keep baby warm, and maintain hygiene.",
    "benefits breastfeeding": "Boosts immunity, improves bonding, and supports brain development.",
}



# -------------------------
# REPLY GENERATOR (RULE BASED)
# -------------------------
def rule_based_reply(text: str) -> str:
    t = text.lower()

    for key in knowledge:
        if key in t:
            return knowledge[key]

    return "Is there something specific you want to know about AFI or pregnancy?"


# -------------------------
# MAIN CHAT ENDPOINT
# -------------------------
@router.post("/", response_model=ChatResponse)
async def chat_endpoint(
    payload: ChatRequest, db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_msg = payload.message.strip()

    # Language detection
    try:
        lang = detect(user_msg)
    except:
        lang = "en"

    lang_map = {"en": "en-IN", "kn": "kn-IN"}
    detected_lang = lang_map.get(lang, "en-IN")

    # Save user message in DB
    await db["chat_history"].insert_one(
        {"sender": "user", "text": user_msg, "session": payload.session_id}
    )

    # Generate reply using rule-based logic
    reply = rule_based_reply(user_msg)

    # Save bot reply
    await db["chat_history"].insert_one(
        {"sender": "bot", "text": reply, "session": payload.session_id}
    )

    return ChatResponse(reply=reply, lang=detected_lang)