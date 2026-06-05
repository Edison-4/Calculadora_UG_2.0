const firebaseConfig = {
  apiKey: "AIzaSyCPQ-xLQiEva-FVItxkpq8Ajmks34LQfoM",
  authDomain: "calculadora-ug.firebaseapp.com",
  projectId: "calculadora-ug",
  storageBucket: "calculadora-ug.firebasestorage.app",
  messagingSenderId: "583361267783",
  appId: "1:583361267783:web:4feda2c2a6771a542a0962",
  measurementId: "G-LM7TVEL7HV"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const UNSPLASH_ACCESS_KEY = "Mrl1smh3LOgNLla3sO7Vjo2lqFjgHR9lMTqMxM75_dM"; 
const API_URL = `https://api.unsplash.com/photos/random?count=25&query=nature,landscape,mountain&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;

let ambientImages = [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3840&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=3840&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=3840&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=3840&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=3840&auto=format&fit=crop'
];

let currentBgIndex = 0;
const bgLayer1 = document.getElementById('bg-layer-1');
const bgLayer2 = document.getElementById('bg-layer-2');
let isLayer1Active = true;

const translations = {
    es: {
        title: "Calculadora de Notas UG",
        parcial1: "1er Parcial",
        parcial2: "2do Parcial",
        gf: "Gestión Formativa",
        gp: "Gestión Práctica",
        ex: "Examen",
        prom1: "Promedio 1er Parcial:",
        prom2: "Promedio 2do Parcial:",
        resultados: "Resultados Finales",
        promSemestre: "Promedio Semestre",
        notaMinima: "Nota Mínima Recuperación",
        msgIngreso: "Ingrese sus notas",
        msgFaltan: "Faltan notas por ingresar",
        msgEspera: "En espera...",
        msgAprobado: "Aprobado",
        msgReprobadoProm: "Reprobado (Prom. < 3)",
        msgReprobadoReq: "Reprobado (Req. > 10)",
        footer: "Desarrollado por Edison Plaza & Gemini"
    },
    en: {
        title: "UG Grade Calculator",
        parcial1: "1st Term",
        parcial2: "2nd Term",
        gf: "Formative Assessment",
        gp: "Practical Assessment",
        ex: "Exam",
        prom1: "1st Term Average:",
        prom2: "2nd Term Average:",
        resultados: "Final Results",
        promSemestre: "Semester Average",
        notaMinima: "Minimum Recovery Grade",
        msgIngreso: "Enter your grades",
        msgFaltan: "Missing grades",
        msgEspera: "Waiting...",
        msgAprobado: "Passed",
        msgReprobadoProm: "Failed (Avg < 3)",
        msgReprobadoReq: "Failed (Req > 10)",
        footer: "Developed by Edison Plaza & Gemini"
    },
    fr: {
        title: "Calculatrice de Notes UG",
        parcial1: "1er Trimestre",
        parcial2: "2ème Trimestre",
        gf: "Évaluation Formative",
        gp: "Évaluation Pratique",
        ex: "Examen",
        prom1: "Moyenne 1er Trim:",
        prom2: "Moyenne 2ème Trim:",
        resultados: "Résultats Finaux",
        promSemestre: "Moyenne Semestrielle",
        notaMinima: "Note de Rattrapage",
        msgIngreso: "Entrez vos notes",
        msgFaltan: "Notes manquantes",
        msgEspera: "En attente...",
        msgAprobado: "Admis",
        msgReprobadoProm: "Échoué (Moy < 3)",
        msgReprobadoReq: "Échoué (Req > 10)",
        footer: "Développé par Edison Plaza & Gemini"
    },
    de: {
        title: "UG Notenrechner",
        parcial1: "1. Semesterhälfte",
        parcial2: "2. Semesterhälfte",
        gf: "Formative Bewertung",
        gp: "Praktische Bewertung",
        ex: "Prüfung",
        prom1: "Durchschnitt 1. Hälfte:",
        prom2: "Durchschnitt 2. Hälfte:",
        resultados: "Endergebnisse",
        promSemestre: "Semesterdurchschnitt",
        notaMinima: "Minimale Nachholnote",
        msgIngreso: "Noten eingeben",
        msgFaltan: "Fehlende Noten",
        msgEspera: "Warten...",
        msgAprobado: "Bestanden",
        msgReprobadoProm: "Durchgefallen (Durch. < 3)",
        msgReprobadoReq: "Durchgefallen (Erf. > 10)",
        footer: "Entwickelt von Edison Plaza & Gemini"
    },
    pt: {
        title: "Calculadora de Notas UG",
        parcial1: "1º Bimestre",
        parcial2: "2º Bimestre",
        gf: "Avaliação Formativa",
        gp: "Avaliação Prática",
        ex: "Exame",
        prom1: "Média 1º Bimestre:",
        prom2: "Média 2º Bimestre:",
        resultados: "Resultados Finais",
        promSemestre: "Média do Semestre",
        notaMinima: "Nota de Recuperação",
        msgIngreso: "Insira suas notas",
        msgFaltan: "Faltam notas",
        msgEspera: "Aguardando...",
        msgAprobado: "Aprovado",
        msgReprobadoProm: "Reprovado (Média < 3)",
        msgReprobadoReq: "Reprovado (Req > 10)",
        footer: "Desenvolvido por Edison Plaza & Gemini"
    },
    ja: {
        title: "UG 成績計算機",
        parcial1: "第1学期",
        parcial2: "第2学期",
        gf: "形成的評価",
        gp: "実践的評価",
        ex: "試験",
        prom1: "第1学期平均:",
        prom2: "第2学期平均:",
        resultados: "最終結果",
        promSemestre: "学期平均",
        notaMinima: "最低追試成績",
        msgIngreso: "成績を入力",
        msgFaltan: "未入力の成績",
        msgEspera: "待機中...",
        msgAprobado: "合格",
        msgReprobadoProm: "不合格 (平均 < 3)",
        msgReprobadoReq: "不合格 (必要 > 10)",
        footer: "エジソン・プラザ ＆ Gemini が開発"
    }
};

const langSelector = document.getElementById('lang-selector');

langSelector.addEventListener('change', (event) => {
    const lang = event.target.value;
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerText = translations[lang][key];
            }
        }
    });
    
    calcularNotas();
});

async function iniciarFondoDinamico() {
    const docRef = db.collection("configuracion").doc("datos_hd");

    try {
        const doc = await docRef.get();
        const now = new Date().getTime();
        const unaHoraEnMilisegundos = 60 * 60 * 1000;

        if (doc.exists) {
            const datosFirebase = doc.data();
            const tiempoGuardado = datosFirebase.timestamp;

            if (now - tiempoGuardado < unaHoraEnMilisegundos) {
                ambientImages = datosFirebase.imagenes;
                iniciarRotacion();
                return;
            }
        }

        const respuesta = await fetch(API_URL);
        
        if (respuesta.ok) {
            const datosUnsplash = await respuesta.json();
            ambientImages = datosUnsplash.map(foto => foto.urls.full);

            await docRef.set({
                timestamp: now,
                imagenes: ambientImages
            });
        } else if (doc.exists) {
            ambientImages = doc.data().imagenes;
        }

    } catch (error) {
    }

    iniciarRotacion();
}

function iniciarRotacion() {
    for (let i = ambientImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ambientImages[i], ambientImages[j]] = [ambientImages[j], ambientImages[i]];
    }

    bgLayer1.style.backgroundImage = `url('${ambientImages[0]}')`;
    
    setInterval(changeAmbientBackground, 30000);
}

function changeAmbientBackground() {
    currentBgIndex = (currentBgIndex + 1) % ambientImages.length;
    const nextImageUrl = `url('${ambientImages[currentBgIndex]}')`;

    if (isLayer1Active) {
        bgLayer2.style.backgroundImage = nextImageUrl;
        bgLayer2.classList.add('active');
        bgLayer1.classList.remove('active');
    } else {
        bgLayer1.style.backgroundImage = nextImageUrl;
        bgLayer1.classList.add('active');
        bgLayer2.classList.remove('active');
    }
    isLayer1Active = !isLayer1Active;
}

iniciarFondoDinamico();

const inputs = document.querySelectorAll('input[type="number"]');

inputs.forEach(input => {
    input.addEventListener('input', (event) => {
        let valorIngresado = parseFloat(event.target.value);
        let valorMaximo = parseFloat(event.target.getAttribute('max'));

        if (valorIngresado < 0) {
            event.target.value = 0;
        } 
        else if (valorMaximo && valorIngresado > valorMaximo) {
            event.target.value = valorMaximo;
        }
        calcularNotas();
    });
});

function calcularNotas() {
    let v_gf1 = document.getElementById('gf1').value;
    let v_gp1 = document.getElementById('gp1').value;
    let v_ex1 = document.getElementById('ex1').value;
    
    let v_gf2 = document.getElementById('gf2').value;
    let v_gp2 = document.getElementById('gp2').value;
    let v_ex2 = document.getElementById('ex2').value;

    let gf1 = parseFloat(v_gf1) || 0;
    let gp1 = parseFloat(v_gp1) || 0;
    let ex1 = parseFloat(v_ex1) || 0;
    
    let gf2 = parseFloat(v_gf2) || 0;
    let gp2 = parseFloat(v_gp2) || 0;
    let ex2 = parseFloat(v_ex2) || 0;

    let prom1 = (gf1 * 0.33) + (gp1 * 0.33) + (ex1 * 0.34); 
    let prom2 = (gf2 * 0.33) + (gp2 * 0.33) + (ex2 * 0.34);

    document.getElementById('prom1').innerText = (v_gf1 !== "" || v_gp1 !== "" || v_ex1 !== "") ? prom1.toFixed(2) : "0.00";
    document.getElementById('prom2').innerText = (v_gf2 !== "" || v_gp2 !== "" || v_ex2 !== "") ? prom2.toFixed(2) : "0.00";

    let promSemestre = (prom1 + prom2) / 2;
    const promSemestreElement = document.getElementById('prom-semestre');
    const recupElement = document.getElementById('nota-recuperacion');
    const currentLang = langSelector.value;
    
    let todasVacias = (v_gf1 === "" && v_gp1 === "" && v_ex1 === "" && v_gf2 === "" && v_gp2 === "" && v_ex2 === "");
    let todasLlenas = (v_gf1 !== "" && v_gp1 !== "" && v_ex1 !== "" && v_gf2 !== "" && v_gp2 !== "" && v_ex2 !== "");

    if (todasVacias) {
        promSemestreElement.innerText = "---";
        promSemestreElement.style.color = "#888888";
        recupElement.innerText = translations[currentLang].msgIngreso;
        recupElement.style.color = "#888888";
    } else if (!todasLlenas) {
        promSemestreElement.innerText = translations[currentLang].msgEspera;
        promSemestreElement.style.color = "#888888";
        recupElement.innerText = translations[currentLang].msgFaltan;
        recupElement.style.color = "#888888";
    } else {
        promSemestreElement.innerText = promSemestre.toFixed(2);
        
        if (promSemestre >= 7) {
            promSemestreElement.style.color = "#4caf50";
        } else {
            promSemestreElement.style.color = "#f44336";
        }
        
        let recuperacion = 0;

        if (promSemestre < 7 && promSemestre >= 3) {
            recuperacion = (7 - (0.4 * promSemestre)) / 0.6;
        }

        if (promSemestre >= 7) {
            recupElement.innerText = translations[currentLang].msgAprobado;
            recupElement.style.color = "#4caf50"; 
        } else if (promSemestre < 3) {
            recupElement.innerText = translations[currentLang].msgReprobadoProm;
            recupElement.style.color = "#f44336"; 
        } else if (recuperacion > 10) {
            recupElement.innerText = translations[currentLang].msgReprobadoReq;
            recupElement.style.color = "#f44336"; 
        } else {
            recupElement.innerText = recuperacion.toFixed(2);
            recupElement.style.color = "#ff9800"; 
        }
    }
}

calcularNotas();