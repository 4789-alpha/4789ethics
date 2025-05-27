const colorLocales = {
  en: {
    map: { red: 'red', green: 'green', blue: 'blue', yellow: 'yellow' },
    qNew: 'Choose a primary color for authentication ({c}):',
    qRepeat: 'Was your last color the same (at last start)? ({c})',
    invalid: 'Only basic colors {c} allowed.',
    confirmed: 'Color confirmed. Welcome back.',
    mismatch: 'Note: wrong user, no confirmation.',
    saved: 'Color saved: {color}'
  },
  de: {
    map: { rot: 'rot', gruen: 'grün', grün: 'grün', blau: 'blau', gelb: 'gelb' },
    qNew: 'Wähle eine Grundfarbe zur Authentifizierung ({c}):',
    qRepeat: 'War deine letzte Farbe gleich (beim letzten Start)? ({c})',
    invalid: 'Nur Grundfarben {c} wählbar.',
    confirmed: 'Farbe bestätigt. Willkommen zurück.',
    mismatch: 'Hinweis: falscher User, keine Bestätigung.',
    saved: 'Farbe gespeichert: {color}'
  },
  fr: {
    map: { rouge: 'rouge', vert: 'vert', bleu: 'bleu', jaune: 'jaune' },
    qNew: "Choisissez une couleur primaire pour l'authentification ({c}):",
    qRepeat: 'Votre dernière couleur était-elle identique (au dernier lancement)? ({c})',
    invalid: 'Seules les couleurs {c} sont autorisées.',
    confirmed: 'Couleur confirmée. Bon retour.',
    mismatch: 'Attention : mauvais utilisateur, aucune confirmation.',
    saved: 'Couleur enregistrée : {color}'
  },
  es: {
    map: { rojo: 'rojo', verde: 'verde', azul: 'azul', amarillo: 'amarillo' },
    qNew: 'Elige un color primario para autenticar ({c}):',
    qRepeat: '¿Tu último color era el mismo (en el último inicio)? ({c})',
    invalid: 'Solo se permiten los colores {c}.',
    confirmed: 'Color confirmado. Bienvenido de nuevo.',
    mismatch: 'Aviso: usuario incorrecto, sin confirmación.',
    saved: 'Color guardado: {color}'
  },
  pt: {
    map: { vermelho: 'vermelho', verde: 'verde', azul: 'azul', amarelo: 'amarelo' },
    qNew: 'Escolha uma cor primária para autenticação ({c}):',
    qRepeat: 'Sua última cor era a mesma (no último início)? ({c})',
    invalid: 'Apenas as cores {c} são permitidas.',
    confirmed: 'Cor confirmada. Bem-vindo de volta.',
    mismatch: 'Aviso: usuário errado, sem confirmação.',
    saved: 'Cor salva: {color}'
  },
  zh: {
    map: { '红': '红', '绿': '绿', '蓝': '蓝', '黄': '黄' },
    qNew: '请选择用于认证的基础颜色（{c}）：',
    qRepeat: '你上次选择的颜色相同吗（上次启动时）？（{c}）',
    invalid: '只允许选择基本颜色：{c}。',
    confirmed: '颜色确认。欢迎回来。',
    mismatch: '提示：用户错误，未确认。',
    saved: '颜色已保存：{color}'
  },
  hi: {
    map: { 'लाल': 'लाल', 'हरा': 'हरा', 'नीला': 'नीला', 'पीला': 'पीला' },
    qNew: 'प्रमाणीकरण के लिए एक प्राथमिक रंग चुनें ({c}):',
    qRepeat: 'क्या पिछली बार यही रंग था? ({c})',
    invalid: 'केवल {c} रंग चुनें।',
    confirmed: 'रंग पुष्टि किया गया। आपका स्वागत है।',
    mismatch: 'ध्यान दें: गलत उपयोगकर्ता, पुष्टि नहीं हुई।',
    saved: 'रंग सहेजा गया: {color}'
  },
  ar: {
    map: { 'أحمر': 'أحمر', 'أخضر': 'أخضر', 'أزرق': 'أزرق', 'أصفر': 'أصفر' },
    qNew: 'اختر لونًا أساسيًا للتوثيق ({c}):',
    qRepeat: 'هل كان لونك الأخير هو نفسه (عند آخر تشغيل)؟ ({c})',
    invalid: 'يُسمح فقط بالألوان {c}.',
    confirmed: 'تم تأكيد اللون. مرحبًا بعودتك.',
    mismatch: 'تنبيه: مستخدم خاطئ، لا يوجد تأكيد.',
    saved: 'تم حفظ اللون: {color}'
  },
  ja: {
    map: { '赤': '赤', '緑': '緑', '青': '青', '黄': '黄' },
    qNew: '認証に使う基本色を選択してください（{c}）:',
    qRepeat: '前回の色は同じでしたか（前回の起動時）？（{c}）',
    invalid: ' {c} のみ選択できます。',
    confirmed: '色が確認されました。お帰りなさい。',
    mismatch: '注意：別のユーザーです。確認されません。',
    saved: '色を保存しました: {color}'
  },
  sw: {
    map: { nyekundu: 'nyekundu', kijani: 'kijani', bluu: 'bluu', njano: 'njano' },
    qNew: 'Chagua rangi kuu kwa uthibitisho ({c}):',
    qRepeat: 'Je, rangi yako ya mwisho ilikuwa sawa? ({c})',
    invalid: 'Rangi zinazokubalika ni {c} pekee.',
    confirmed: 'Rangi imethibitishwa. Karibu tena.',
    mismatch: 'Tahadhari: mtumiaji si sahihi, hakuna uthibitisho.',
    saved: 'Rangi imehifadhiwa: {color}'
  },
  ru: {
    map: { 'красный': 'красный', 'зеленый': 'зеленый', 'синий': 'синий', 'желтый': 'желтый' },
    qNew: 'Выберите основной цвет для аутентификации ({c}):',
    qRepeat: 'Ваш последний цвет был таким же? ({c})',
    invalid: 'Можно использовать только цвета {c}.',
    confirmed: 'Цвет подтвержден. С возвращением.',
    mismatch: 'Замечание: неверный пользователь, подтверждения нет.',
    saved: 'Цвет сохранен: {color}'
  },
  it: {
    map: { rosso: 'rosso', verde: 'verde', blu: 'blu', giallo: 'giallo' },
    qNew: "Scegli un colore primario per l'autenticazione ({c}):",
    qRepeat: 'Il tuo ultimo colore era lo stesso (all\'ultimo avvio)? ({c})',
    invalid: 'Sono consentiti solo {c}.',
    confirmed: 'Colore confermato. Bentornato.',
    mismatch: 'Nota: utente errato, nessuna conferma.',
    saved: 'Colore salvato: {color}'
  },
  ko: {
    map: { '빨간': '빨간', '초록': '초록', '파랑': '파랑', '노랑': '노랑' },
    qNew: '인증을 위해 기본 색상을 선택하세요 ({c}):',
    qRepeat: '마지막 색상이 같았습니까? ({c})',
    invalid: '{c}만 선택 가능합니다.',
    confirmed: '색상이 확인되었습니다. 다시 오신 것을 환영합니다.',
    mismatch: '알림: 잘못된 사용자, 확인되지 않았습니다.',
    saved: '색상이 저장되었습니다: {color}'
  },
  fa: {
    map: { 'قرمز': 'قرمز', 'سبز': 'سبز', 'آبی': 'آبی', 'زرد': 'زرد' },
    qNew: 'برای احراز هویت یک رنگ اصلی انتخاب کنید ({c}):',
    qRepeat: 'آیا رنگ آخرتان همان بود؟ ({c})',
    invalid: 'تنها رنگ‌های {c} مجاز هستند.',
    confirmed: 'رنگ تأیید شد. خوش آمدید.',
    mismatch: 'توجه: کاربر اشتباه، تأیید نشد.',
    saved: 'رنگ ذخیره شد: {color}'
  },
  pl: {
    map: { czerwony: 'czerwony', zielony: 'zielony', niebieski: 'niebieski', żółty: 'żółty' },
    qNew: 'Wybierz podstawowy kolor do uwierzytelnienia ({c}):',
    qRepeat: 'Czy ostatni kolor był taki sam? ({c})',
    invalid: 'Dozwolone są tylko kolory {c}.',
    confirmed: 'Kolor potwierdzony. Witamy ponownie.',
    mismatch: 'Uwaga: zły użytkownik, brak potwierdzenia.',
    saved: 'Kolor zapisany: {color}'
  },
  nl: {
    map: { rood: 'rood', groen: 'groen', blauw: 'blauw', geel: 'geel' },
    qNew: 'Kies een primaire kleur voor authenticatie ({c}):',
    qRepeat: 'Was je laatste kleur hetzelfde (bij de laatste start)? ({c})',
    invalid: 'Alleen de kleuren {c} zijn toegestaan.',
    confirmed: 'Kleur bevestigd. Welkom terug.',
    mismatch: 'Opmerking: verkeerde gebruiker, geen bevestiging.',
    saved: 'Kleur opgeslagen: {color}'
  }
};

function getLang() {
  if (typeof getLanguage === 'function') return getLanguage();
  return (navigator.language || 'en').slice(0, 2);
}

function verifyColorAuth(locale) {
  const lastTime = parseInt(localStorage.getItem('ethicom_color_time') || '0', 10);
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (now - lastTime < twentyFourHours) return;

  localStorage.setItem('ethicom_color_time', String(now));

  const sig = JSON.parse(localStorage.getItem('ethicom_signature') || '{}');
  const stored =
    (sig.private && sig.private.color) || localStorage.getItem('ethicom_color');
  const colors = Object.keys(locale.map);
  const list = colors.join(', ');
  const question = stored
    ? locale.qRepeat.replace('{c}', list)
    : locale.qNew.replace('{c}', list);
  const input = prompt(question);
  if (!input) return;
  const value = input.trim().toLowerCase();
  if (!locale.map[value]) {
    alert(locale.invalid.replace('{c}', list));
    return;
  }
  const normalized = locale.map[value];
  if (stored) {
    if (normalized === stored) {
      alert(locale.confirmed);
    } else {
      alert(locale.mismatch);
    }
  } else {
    if (!sig.private) sig.private = {};
    sig.private.color = normalized;
    localStorage.setItem('ethicom_signature', JSON.stringify(sig));
    localStorage.removeItem('ethicom_color');
    alert(locale.saved.replace('{color}', normalized));
  }
}

function initColorAuth() {
  const level =
    typeof getStoredOpLevel === 'function' ? getStoredOpLevel() : null;
  if (!level || opLevelToNumber(level) < 1) return;
  const lang = getLang();
  const locale = colorLocales[lang] || colorLocales.en;
  verifyColorAuth(locale);
}

window.addEventListener('DOMContentLoaded', initColorAuth);
