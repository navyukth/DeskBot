  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
  import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
  } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
  import {
    getDatabase,
    ref,
    set,
    onValue
  } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

  //  Replace With YOUR Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDF7yVtCgEu7B8IDWk7vpWCfJOadE7Cr9c",
  authDomain: "deskbot-7b3da.firebaseapp.com",
  databaseURL: "https://deskbot-7b3da-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "deskbot-7b3da",
  storageBucket: "deskbot-7b3da.firebasestorage.app",
  messagingSenderId: "635165295595",
  appId: "1:635165295595:web:07f07a89f2f556e28bcfae"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db = getDatabase(app);

  // UI elements
  const authBox = document.getElementById("authBox");
  const controlBox = document.getElementById("controlBox");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const authMsg = document.getElementById("authMsg");
  const badge = document.getElementById("statusBadge");


  const servoSlider = document.getElementById("servoSlider");
  const angleLabel = document.getElementById("servoAngle");

  // Login
  loginBtn.onclick = async () => {
    authMsg.textContent = "";
    try {
      await signInWithEmailAndPassword(
        auth,
        document.getElementById("emailField").value,
        document.getElementById("passwordField").value
      );
    } catch (e) {
      authMsg.textContent = e.message;
    }
  };

  logoutBtn.onclick = () => signOut(auth);

  // Auth state monitor
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authBox.style.display = "none";
      controlBox.style.display = "block";
      badge.className = "status-badge online";
      badge.textContent = "Online";
      startListener();
    } else {
      authBox.style.display = "block";
      controlBox.style.display = "none";
      badge.className = "status-badge offline";
      badge.textContent = "Offline";
    }
  });

  // Listen to DB
 function startListener() {
  const servoRef = ref(db, "/gpio8");

  onValue(servoRef, (snapshot) => {
    const angle = snapshot.val() ?? 90;
    servoSlider.value = angle;
    angleLabel.textContent = `Angle: ${angle}°`;
  });

  servoSlider.oninput = () => {
    const angle = Number(servoSlider.value);
    angleLabel.textContent = `Angle: ${angle}°`;
    set(servoRef, angle);
  };
}
