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
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2070&auto=format&fit=crop'
];

let currentBgIndex = 0;
const bgLayer1 = document.getElementById('bg-layer-1');
const bgLayer2 = document.getElementById('bg-layer-2');
let isLayer1Active = true;

async function iniciarFondoDinamico() {
    const docRef = db.collection("configuracion").doc("datos");

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
            ambientImages = datosUnsplash.map(foto => foto.urls.regular);

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
    
    setInterval(changeAmbientBackground, 120000);
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
    
    let todasVacias = (v_gf1 === "" && v_gp1 === "" && v_ex1 === "" && v_gf2 === "" && v_gp2 === "" && v_ex2 === "");
    let todasLlenas = (v_gf1 !== "" && v_gp1 !== "" && v_ex1 !== "" && v_gf2 !== "" && v_gp2 !== "" && v_ex2 !== "");

    if (todasVacias) {
        promSemestreElement.innerText = "---";
        promSemestreElement.style.color = "#888888";
        recupElement.innerText = "Ingrese sus notas";
        recupElement.style.color = "#888888";
    } else if (!todasLlenas) {
        promSemestreElement.innerText = "En espera...";
        promSemestreElement.style.color = "#888888";
        recupElement.innerText = "Faltan notas por ingresar";
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
            recupElement.innerText = "Aprobado";
            recupElement.style.color = "#4caf50"; 
        } else if (promSemestre < 3) {
            recupElement.innerText = "Reprobado (Prom. < 3)";
            recupElement.style.color = "#f44336"; 
        } else if (recuperacion > 10) {
            recupElement.innerText = "Reprobado (Req. > 10)";
            recupElement.style.color = "#f44336"; 
        } else {
            recupElement.innerText = recuperacion.toFixed(2);
            recupElement.style.color = "#ff9800"; 
        }
    }
}

calcularNotas();

const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;
let primeraInteraccion = false;

bgMusic.volume = 0.3; 

document.body.addEventListener('click', (event) => {
    if (!primeraInteraccion && event.target.id !== 'music-btn') {
        bgMusic.play().then(() => {
            isPlaying = true;
            primeraInteraccion = true;
            musicBtn.innerText = "Pausar Musica";
            musicBtn.style.backgroundColor = "#4da6ff";
            musicBtn.style.color = "#000";
        }).catch(error => {
        });
    }
});

musicBtn.addEventListener('click', () => {
    primeraInteraccion = true; 
    
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.innerText = "Reproducir Musica";
        musicBtn.style.backgroundColor = "rgba(30, 30, 30, 0.7)";
        musicBtn.style.color = "#4da6ff";
    } else {
        bgMusic.play();
        musicBtn.innerText = "Pausar Musica";
        musicBtn.style.backgroundColor = "#4da6ff";
        musicBtn.style.color = "#000";
    }
    isPlaying = !isPlaying;
});