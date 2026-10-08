const TKI_APPEARANCE_KEY = "tki_appearance";
const input = document.querySelector("#messageInput");
const sendButton = document.querySelector("#sendButton");
const messages = document.querySelector("#messages");
const welcomeMessage = document.querySelector("#welcomeMessage");

const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector("#sidebar");
const newChatButton = document.querySelector("#newChatButton");
const conversationList = document.querySelector("#conversationList");

const profileButton = document.querySelector("#profileButton");
const profilePanel = document.querySelector("#profilePanel");

const appearanceButton = document.querySelector("#appearanceButton");
const appearanceMenu = document.querySelector("#appearanceMenu");

const lightTheme = document.querySelector("#lightTheme");
const darkTheme = document.querySelector("#darkTheme");


/* =========================
   CHARGER LE THÈME MÉMORISÉ
========================= */

const savedTheme =
  localStorage.getItem(
    TKI_APPEARANCE_KEY
  );


if (
  savedTheme === "dark"
) {

  document.body.classList.add(
    "dark-mode"
  );

} else {

  document.body.classList.remove(
    "dark-mode"
  );

}


const languageButton = document.querySelector("#languageButton");
const languageMenu = document.querySelector("#languageMenu");

const notificationButton = document.querySelector("#notificationButton");
const notificationMenu = document.querySelector("#notificationMenu");

const settingsButton = document.querySelector("#settingsButton");
const settingsMenu = document.querySelector("#settingsMenu");

const textSize = document.querySelector("#textSize");
const resetSettings = document.querySelector("#resetSettings");


/* =========================
   AJOUT IMAGE
========================= */

const imageButton =
  document.querySelector("#imageButton");

const imageInput =
  document.querySelector("#imageInput");

const imagePreviewContainer =
  document.querySelector("#imagePreviewContainer");

const imagePreview =
  document.querySelector("#imagePreview");

const removeImageButton =
  document.querySelector("#removeImageButton");

let selectedImage = null;


imageButton.addEventListener(
  "click",
  function() {
    imageInput.click();
  }
);


imageInput.addEventListener(
  "change",
  function() {

    const file =
      imageInput.files[0];

    if (!file) {
      return;
    }

    const maxImageSize =
      6 * 1024 * 1024;

    if (
      file.size >
      maxImageSize
    ) {

      alert(
        "L'image est trop grande. La taille maximale est de 6 Mo."
      );

      imageInput.value = "";

      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif"
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      alert(
        "Ce format d'image n'est pas pris en charge."
      );

      imageInput.value = "";

      return;
    }

    const reader =
      new FileReader();

    reader.onload =
      function(event) {

        selectedImage = {

          mimeType:
            file.type,

          data:
            event.target.result
              .split(",")[1],

          preview:
            event.target.result

        };

        imagePreview.src =
          selectedImage.preview;

        imagePreviewContainer.classList.add(
          "show"
        );

      };

    reader.onerror =
      function() {

        alert(
          "Impossible de lire cette image."
        );

      };

    reader.readAsDataURL(
      file
    );

  }
);


removeImageButton.addEventListener(
  "click",
  function() {

    selectedImage = null;

    imageInput.value = "";

    imagePreview.src = "";

    imagePreviewContainer.classList.remove(
      "show"
    );

  }
);


/* =========================
   RECHERCHE INTERNET
========================= */

const webSearchButton =
  document.querySelector(
    "#webSearchButton"
  );

let webSearchEnabled =
  false;


webSearchButton.addEventListener(
  "click",
  function(event) {

    event.stopPropagation();

    webSearchEnabled =
      !webSearchEnabled;

    webSearchButton.classList.toggle(
      "active",
      webSearchEnabled
    );

    if (
      webSearchEnabled
    ) {

      webSearchButton.title =
        "Recherche Internet activée";

    } else {

      webSearchButton.title =
        "Recherche Internet désactivée";

    }

  }
);


/* =========================
   FIREBASE AUTH
   FIREBASE = CONNEXION GOOGLE
========================= */

const googleLoginButton =
  document.querySelector("#googleLoginButton");

const profileName =
  document.querySelector("#profileName");

const profileEmail =
  document.querySelector("#profileEmail");

const profileAvatar =
  document.querySelector("#profileAvatar");


const firebaseConfig = {

  apiKey:
    "AIzaSyB9s5-gvfGtDUhUiQTGnBI_HG29NM_S1Ko",

  authDomain:
    "tki-protection-2.firebaseapp.com",

  projectId:
    "tki-protection-2",

  storageBucket:
    "tki-protection-2.firebasestorage.app",

  messagingSenderId:
    "105777475845",

  appId:
    "1:105777475845:web:6fe709f19655a2ab4ac76c"

};


firebase.initializeApp(
  firebaseConfig
);


const auth =
  firebase.auth();


const googleProvider =
  new firebase.auth.GoogleAuthProvider();


/* =========================
   RENDER / SUPABASE API
========================= */

const API_BASE_URL =
  "https://tki-backend.onrender.com";


function getApiHeaders(
  extraHeaders = {}
) {

  const headers = {

    "Content-Type":
      "application/json",

    ...extraHeaders

  };


  if (
    auth.currentUser
  ) {

    headers["x-user-id"] =
      auth.currentUser.uid;

  }


  return headers;

}


async function apiFetch(
  endpoint,
  options = {}
) {

  if (
    !auth.currentUser
  ) {

    throw new Error(
      "Utilisateur non connecté."
    );

  }


  const response =
    await fetch(

      API_BASE_URL +
      endpoint,

      {

        ...options,

        headers:
          getApiHeaders(
            options.headers ||
            {}
          )

      }

    );


  let data = {};


  try {

    data =
      await response.json();

  } catch (error) {

    data = {};

  }


  if (
    !response.ok
  ) {

    const apiError =
      new Error(

        data.error ||
        data.message ||
        `Erreur API (${response.status})`

      );


    apiError.status =
      response.status;


    apiError.code =
      data.code ||
      null;


    apiError.used =
      data.used ??
      null;


    apiError.limit =
      data.limit ??
      null;


    throw apiError;

  }


  return data;

}


/* =========================
   TKI FREE
========================= */

const TKI_FREE_DEFAULT_LIMIT =
  30;


let tkiFreeUsed =
  0;


let tkiFreeLimit =
  TKI_FREE_DEFAULT_LIMIT;


let tkiPlan =
  "free";

let tkiPlanIndicator =
  null;



/* =========================
   PERSONNALISATION TKI
========================= */

const customizationButton =
  document.querySelector("#customizationButton");

const customizationModal =
  document.querySelector("#customizationModal");

const closeCustomizationButton =
  document.querySelector("#closeCustomizationButton");

const customizationDoneButton =
  document.querySelector("#closeCustomizationButtonBottom");

const resetCustomizationButton =
  document.querySelector("#resetCustomizationButton");

const wallpaperButton =
  document.querySelector("#wallpaperButton");

const wallpaperInput =
  document.querySelector("#wallpaperInput");

const removeWallpaperButton =
  document.querySelector("#removeWallpaperButton");

const userBubbleColor =
  document.querySelector("#userBubbleColor");

const aiBubbleColor =
  document.querySelector("#aiBubbleColor");

const accentColor =
  document.querySelector("#accentColor");

const imageIconSelect =
  document.querySelector("#imageIconSelect");

const webIconSelect =
  document.querySelector("#webIconSelect");


const TKI_PERSONALIZATION_KEY =
  "tki_personalization";


const DEFAULT_PERSONALIZATION = {
  theme: "default",
  themeBackgrounds: {
    default: false,
    halloween: false,
    christmas: false,
    newyear: false,
    aid: false
  },
  userBubbleColor: "",
  aiBubbleColor: "",
  accentColor: "",
  wallpaper: "",
  imageIcon: "🖼️",
  webIcon: "🌐"
};


const TKI_BUBBLE_COLORS = {
  gold: "#C9A227",
  blue: "#4A90E2",
  green: "#43A047",
  purple: "#8E5BD9",
  red: "#E05252"
};


let tkiPersonalization = {
  ...DEFAULT_PERSONALIZATION
};


function isTKIPro() {
  return tkiPlan === "pro";
}


function isValidColor(value) {
  if (!value || typeof value !== "string") {
    return false;
  }

  const test = document.createElement("div");
  test.style.color = value;

  return test.style.color !== "";
}


function loadTKIPersonalization() {
  try {
    const saved =
      localStorage.getItem(TKI_PERSONALIZATION_KEY);

    if (!saved) {
      tkiPersonalization = {
        ...DEFAULT_PERSONALIZATION
      };
      return;
    }

    const parsed = JSON.parse(saved);

    tkiPersonalization = {
      ...DEFAULT_PERSONALIZATION,
      ...(parsed || {})
    };

    /*
      MIGRATION :

      L'ancien thème "Pâques" est remplacé
      définitivement par "Nouvelle année".

      Si un ancien réglage "easter" existe
      encore dans le navigateur, il devient
      automatiquement "newyear".
    */

    if (
      tkiPersonalization.theme === "easter"
    ) {
      tkiPersonalization.theme =
        "newyear";
    }

    if (
      ![
        "default",
        "halloween",
        "christmas",
        "newyear",
        "aid"
      ].includes(
        tkiPersonalization.theme
      )
    ) {
      tkiPersonalization.theme = "default";
    }

    /*
      FONDS D'ÉCRAN DES THÈMES

      Chaque thème possède son propre réglage ON/OFF.
      Les réglages sont conservés séparément du thème choisi.
    */
    const savedThemeBackgrounds =
      tkiPersonalization.themeBackgrounds;

    tkiPersonalization.themeBackgrounds = {
      ...DEFAULT_PERSONALIZATION.themeBackgrounds,
      ...(
        savedThemeBackgrounds &&
        typeof savedThemeBackgrounds === "object"
          ? savedThemeBackgrounds
          : {}
      )
    };

    [
      "default",
      "halloween",
      "christmas",
      "newyear",
      "aid"
    ].forEach(function(theme) {
      tkiPersonalization.themeBackgrounds[theme] =
        tkiPersonalization.themeBackgrounds[theme] === true;
    });

    if (
      !["🖼️", "📷", "🎨", "🌄", "🔍"].includes(
        tkiPersonalization.imageIcon
      )
    ) {
      tkiPersonalization.imageIcon = "🖼️";
    }

    if (
      !["🌐", "🔎", "🛰️", "🌍", "📡"].includes(
        tkiPersonalization.webIcon
      )
    ) {
      tkiPersonalization.webIcon = "🌐";
    }

  } catch (error) {
    console.error(
      "Erreur chargement personnalisation :",
      error
    );

    tkiPersonalization = {
      ...DEFAULT_PERSONALIZATION
    };
  }
}


function saveTKIPersonalization() {
  try {
    localStorage.setItem(
      TKI_PERSONALIZATION_KEY,
      JSON.stringify(tkiPersonalization)
    );
  } catch (error) {
    console.error(
      "Impossible de sauvegarder la personnalisation :",
      error
    );

    if (tkiPersonalization.wallpaper) {
      tkiPersonalization.wallpaper = "";

      try {
        localStorage.setItem(
          TKI_PERSONALIZATION_KEY,
          JSON.stringify(tkiPersonalization)
        );
      } catch (secondError) {
        console.error(
          "Impossible de sauvegarder les réglages :",
          secondError
        );
      }
    }
  }
}


function applyTKIPersonalization() {
  const body = document.body;

  if (!body) {
    return;
  }

  body.classList.remove(
    "tki-theme-halloween",
    "tki-theme-christmas",
    "tki-theme-newyear",
    "tki-theme-aid"
  );

  const themeClass = {
    halloween: "tki-theme-halloween",
    christmas: "tki-theme-christmas",
    newyear: "tki-theme-newyear",
    aid: "tki-theme-aid"
  }[tkiPersonalization.theme];

  if (themeClass) {
    body.classList.add(themeClass);
  }

  /* FONDS D'ÉCRAN DES THÈMES */
  body.classList.remove(
    "tki-theme-background-halloween",
    "tki-theme-background-christmas",
    "tki-theme-background-newyear",
    "tki-theme-background-aid"
  );

  const activeTheme =
    tkiPersonalization.theme;

  if (
    activeTheme &&
    activeTheme !== "default" &&
    tkiPersonalization.themeBackgrounds &&
    tkiPersonalization.themeBackgrounds[activeTheme] === true
  ) {
    body.classList.add(
      "tki-theme-background-" +
      activeTheme
    );
  }

  if (isValidColor(tkiPersonalization.userBubbleColor)) {
    body.style.setProperty(
      "--tki-user-bubble",
      tkiPersonalization.userBubbleColor
    );
  } else {
    body.style.removeProperty("--tki-user-bubble");
  }

  if (isValidColor(tkiPersonalization.aiBubbleColor)) {
    body.style.setProperty(
      "--tki-ai-bubble",
      tkiPersonalization.aiBubbleColor
    );
  } else {
    body.style.removeProperty("--tki-ai-bubble");
  }

  if (isValidColor(tkiPersonalization.accentColor)) {
    body.style.setProperty(
      "--tki-accent",
      tkiPersonalization.accentColor
    );
  } else {
    body.style.removeProperty("--tki-accent");
  }

  if (
    isTKIPro() &&
    tkiPersonalization.wallpaper
  ) {
    body.classList.add("tki-custom-wallpaper");
    body.style.setProperty(
      "--tki-wallpaper",
      `url("${tkiPersonalization.wallpaper}")`
    );
  } else {
    body.classList.remove("tki-custom-wallpaper");
    body.style.removeProperty("--tki-wallpaper");
  }

  if (imageButton) {
    imageButton.textContent =
      tkiPersonalization.imageIcon || "🖼️";
  }

  if (webSearchButton) {
    webSearchButton.textContent =
      tkiPersonalization.webIcon || "🌐";
  }
}


function syncCustomizationControls() {
  document
    .querySelectorAll(".custom-theme-option")
    .forEach(function(button) {
      const theme =
        button.dataset.customTheme ||
        button.dataset.theme ||
        "default";

      button.classList.toggle(
        "selected",
        theme === tkiPersonalization.theme
      );
    });

  document
    .querySelectorAll(".custom-bubble-color, .bubble-color-option")
    .forEach(function(button) {
      const colorKey =
        button.dataset.bubbleColor ||
        button.dataset.color ||
        "";

      const colorValue =
        TKI_BUBBLE_COLORS[colorKey] ||
        colorKey;

      button.classList.toggle(
        "selected",
        colorValue === tkiPersonalization.userBubbleColor
      );
    });

  /* SYNCHRONISER LES BOUTONS FOND D'ÉCRAN DES THÈMES */
  document
    .querySelectorAll(".theme-background-toggle")
    .forEach(function(button) {
      const theme =
        button.dataset.themeBackground ||
        "";

      const isEnabled =
        !!(
          tkiPersonalization.themeBackgrounds &&
          tkiPersonalization.themeBackgrounds[theme] === true
        );

      button.classList.toggle(
        "active",
        isEnabled
      );

      button.textContent =
        isEnabled ? "ON" : "OFF";
    });

  if (userBubbleColor) {
    userBubbleColor.value =
      isValidColor(tkiPersonalization.userBubbleColor)
        ? tkiPersonalization.userBubbleColor
        : "#C9A227";
  }

  if (aiBubbleColor) {
    aiBubbleColor.value =
      isValidColor(tkiPersonalization.aiBubbleColor)
        ? tkiPersonalization.aiBubbleColor
        : "#e0e0e0";
  }

  if (accentColor) {
    accentColor.value =
      isValidColor(tkiPersonalization.accentColor)
        ? tkiPersonalization.accentColor
        : "#111111";
  }

  if (imageIconSelect) {
    imageIconSelect.value =
      tkiPersonalization.imageIcon || "🖼️";
  }

  if (webIconSelect) {
    webIconSelect.value =
      tkiPersonalization.webIcon || "🌐";
  }

  updateCustomizationProUI();
}


function updateCustomizationProUI() {
  const proElements =
    document.querySelectorAll(
      ".custom-pro-option, .pro-only"
    );

  proElements.forEach(function(element) {
    if (isTKIPro()) {
      element.classList.remove("locked");
      element.style.opacity = "";
      element.removeAttribute("aria-disabled");
    } else {
      element.classList.add("locked");
      element.style.opacity = "0.55";
      element.setAttribute("aria-disabled", "true");
    }
  });

  document
    .querySelectorAll(".custom-pro-badge, .pro-badge")
    .forEach(function(label) {
      label.textContent = "⭐ PRO";
    });
}


function openCustomization() {
  if (!customizationModal) {
    return;
  }

  syncCustomizationControls();
  customizationModal.classList.add("open");
  customizationModal.setAttribute("aria-hidden", "false");
}


function closeCustomization() {
  if (!customizationModal) {
    return;
  }

  customizationModal.classList.remove("open");
  customizationModal.setAttribute("aria-hidden", "true");
}


/* THÈMES FREE */
document
  .querySelectorAll(".custom-theme-option")
  .forEach(function(button) {
    button.addEventListener("click", function() {
      tkiPersonalization.theme =
        button.dataset.customTheme ||
        button.dataset.theme ||
        "default";

      saveTKIPersonalization();
      applyTKIPersonalization();
      syncCustomizationControls();
    });
  });


/* COULEURS PRÉDÉFINIES FREE */
document
  .querySelectorAll(".custom-bubble-color, .bubble-color-option")
  .forEach(function(button) {
    button.addEventListener("click", function() {
      const key =
        button.dataset.bubbleColor ||
        button.dataset.color ||
        "";

      const color =
        TKI_BUBBLE_COLORS[key] || key;

      if (!color) {
        return;
      }

      tkiPersonalization.userBubbleColor = color;
      saveTKIPersonalization();
      applyTKIPersonalization();
      syncCustomizationControls();
    });
  });


/* COULEURS PERSONNALISÉES PRO */
if (userBubbleColor) {
  userBubbleColor.addEventListener("input", function() {
    if (!isTKIPro()) {
      syncCustomizationControls();
      alert(
        "Cette personnalisation est réservée à TKI Pro."
      );
      return;
    }

    tkiPersonalization.userBubbleColor =
      userBubbleColor.value;

    saveTKIPersonalization();
    applyTKIPersonalization();
  });
}


if (aiBubbleColor) {
  aiBubbleColor.addEventListener("input", function() {
    if (!isTKIPro()) {
      syncCustomizationControls();
      alert(
        "Cette personnalisation est réservée à TKI Pro."
      );
      return;
    }

    tkiPersonalization.aiBubbleColor =
      aiBubbleColor.value;

    saveTKIPersonalization();
    applyTKIPersonalization();
  });
}


if (accentColor) {
  accentColor.addEventListener("input", function() {
    if (!isTKIPro()) {
      syncCustomizationControls();
      alert(
        "La couleur d'accent personnalisée est réservée à TKI Pro."
      );
      return;
    }

    tkiPersonalization.accentColor =
      accentColor.value;

    saveTKIPersonalization();
    applyTKIPersonalization();
  });
}


/* FOND D'ÉCRAN PRO */
if (wallpaperButton && wallpaperInput) {
  wallpaperButton.addEventListener("click", function() {
    if (!isTKIPro()) {
      alert(
        "Le fond d'écran personnalisé est réservé à TKI Pro."
      );
      return;
    }

    wallpaperInput.click();
  });

  wallpaperInput.addEventListener("change", function() {
    if (!isTKIPro()) {
      wallpaperInput.value = "";
      return;
    }

    const file = wallpaperInput.files[0];

    if (!file) {
      return;
    }

    const maxWallpaperSize =
      2 * 1024 * 1024;

    if (file.size > maxWallpaperSize) {
      alert(
        "Le fond d'écran est trop grand. La taille maximale est de 2 Mo."
      );
      wallpaperInput.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image.");
      wallpaperInput.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
      tkiPersonalization.wallpaper =
        event.target.result;

      saveTKIPersonalization();
      applyTKIPersonalization();
    };

    reader.onerror = function() {
      alert("Impossible de lire le fond d'écran.");
    };

    reader.readAsDataURL(file);
  });
}


if (removeWallpaperButton) {
  removeWallpaperButton.addEventListener("click", function() {
    if (!isTKIPro()) {
      alert(
        "La personnalisation du fond est réservée à TKI Pro."
      );
      return;
    }

    tkiPersonalization.wallpaper = "";

    if (wallpaperInput) {
      wallpaperInput.value = "";
    }

    saveTKIPersonalization();
    applyTKIPersonalization();
  });
}


/* ICÔNES PRO */
if (imageIconSelect) {
  imageIconSelect.addEventListener("change", function() {
    if (!isTKIPro()) {
      syncCustomizationControls();
      alert(
        "Le changement d'icône est réservé à TKI Pro."
      );
      return;
    }

    tkiPersonalization.imageIcon =
      imageIconSelect.value || "🖼️";

    saveTKIPersonalization();
    applyTKIPersonalization();
  });
}


if (webIconSelect) {
  webIconSelect.addEventListener("change", function() {
    if (!isTKIPro()) {
      syncCustomizationControls();
      alert(
        "Le changement d'icône est réservé à TKI Pro."
      );
      return;
    }

    tkiPersonalization.webIcon =
      webIconSelect.value || "🌐";

    saveTKIPersonalization();
    applyTKIPersonalization();
  });
}


/* FONDS D'ÉCRAN DES THÈMES */
document
  .querySelectorAll(".theme-background-toggle")
  .forEach(function(button) {
    button.addEventListener("click", function(event) {
      event.stopPropagation();

      const theme =
        button.dataset.themeBackground ||
        "";

      if (
        !theme ||
        !Object.prototype.hasOwnProperty.call(
          DEFAULT_PERSONALIZATION.themeBackgrounds,
          theme
        )
      ) {
        return;
      }

      if (!tkiPersonalization.themeBackgrounds) {
        tkiPersonalization.themeBackgrounds = {
          ...DEFAULT_PERSONALIZATION.themeBackgrounds
        };
      }

      tkiPersonalization.themeBackgrounds[theme] =
        !tkiPersonalization.themeBackgrounds[theme];

      saveTKIPersonalization();
      applyTKIPersonalization();
      syncCustomizationControls();
    });
  });


/* BOUTON PERSONNALISATION */
if (customizationButton) {
  customizationButton.addEventListener("click", function(event) {
    event.stopPropagation();

    if (profilePanel) {
      profilePanel.classList.remove("open");
    }

    if (appearanceMenu) {
      appearanceMenu.classList.remove("open");
    }

    if (languageMenu) {
      languageMenu.classList.remove("open");
    }

    if (notificationMenu) {
      notificationMenu.classList.remove("open");
    }

    if (settingsMenu) {
      settingsMenu.classList.remove("open");
    }

    openCustomization();
  });
}


if (closeCustomizationButton) {
  closeCustomizationButton.addEventListener("click", function() {
    closeCustomization();
  });
}


if (customizationDoneButton) {
  customizationDoneButton.addEventListener("click", function() {
    saveTKIPersonalization();
    applyTKIPersonalization();
    closeCustomization();
  });
}


if (resetCustomizationButton) {
  resetCustomizationButton.addEventListener("click", function() {
    const confirmed = confirm(
      "Réinitialiser toute la personnalisation de TKI ?"
    );

    if (!confirmed) {
      return;
    }

    tkiPersonalization = {
      ...DEFAULT_PERSONALIZATION,
      themeBackgrounds: {
        ...DEFAULT_PERSONALIZATION.themeBackgrounds
      }
    };


    /* RETOUR AU MODE CLAIR */
    document.body.classList.remove(
      "dark-mode"
    );

    localStorage.setItem(
      TKI_APPEARANCE_KEY,
      "light"
    );


    if (wallpaperInput) {
      wallpaperInput.value = "";
    }

    saveTKIPersonalization();
    applyTKIPersonalization();
    syncCustomizationControls();
  });
}


if (customizationModal) {
  customizationModal.addEventListener("click", function(event) {
    if (event.target === customizationModal) {
      closeCustomization();
    }
  });
}


loadTKIPersonalization();


function createTKIPlanIndicator() {

  if (
    tkiPlanIndicator
  ) {

    return;

  }


  tkiPlanIndicator =
    document.createElement(
      "div"
    );


  tkiPlanIndicator.id =
    "tkiPlanIndicator";


  tkiPlanIndicator.style.display =
    "none";

  tkiPlanIndicator.style.alignItems =
    "center";

  tkiPlanIndicator.style.justifyContent =
    "center";

  tkiPlanIndicator.style.gap =
    "6px";

  tkiPlanIndicator.style.fontSize =
    "13px";

  tkiPlanIndicator.style.fontWeight =
    "600";

  tkiPlanIndicator.style.padding =
    "5px 10px";

  tkiPlanIndicator.style.borderRadius =
    "999px";

  tkiPlanIndicator.style.background =
    "rgba(201, 162, 39, 0.12)";

  tkiPlanIndicator.style.color =
    "#a47c00";

  tkiPlanIndicator.style.whiteSpace =
    "nowrap";

  tkiPlanIndicator.style.userSelect =
    "none";


  if (
    profileButton &&
    profileButton.parentElement
  ) {

    profileButton.parentElement.insertBefore(
      tkiPlanIndicator,
      profileButton
    );

  } else {

    document.body.appendChild(
      tkiPlanIndicator
    );

  }

}


function updateTKIPlanIndicator(
  used,
  limit,
  plan = tkiPlan
) {

  createTKIPlanIndicator();

  tkiPlan =
    plan === "pro"
      ? "pro"
      : "free";


  if (
    tkiPlan === "pro"
  ) {

    tkiPlanIndicator.textContent =
      "⭐ TKI Pro";

    tkiPlanIndicator.style.display =
      "inline-flex";

    tkiPlanIndicator.style.background =
      "rgba(201, 162, 39, 0.12)";

    tkiPlanIndicator.style.color =
      "#a47c00";

    return;

  }


  tkiFreeUsed =
    Number(used) || 0;


  tkiFreeLimit =
    Number(limit) ||
    TKI_FREE_DEFAULT_LIMIT;


  tkiPlanIndicator.textContent =
    "TKI Free — " +
    tkiFreeUsed +
    "/" +
    tkiFreeLimit;


  tkiPlanIndicator.style.display =
    "inline-flex";


  if (
    tkiFreeUsed >=
    tkiFreeLimit
  ) {

    tkiPlanIndicator.style.background =
      "rgba(220, 53, 69, 0.12)";

    tkiPlanIndicator.style.color =
      "#dc3545";

  } else {

    tkiPlanIndicator.style.background =
      "rgba(201, 162, 39, 0.12)";

    tkiPlanIndicator.style.color =
      "#a47c00";

  }

}


function hideTKIPlanIndicator() {

  createTKIPlanIndicator();

  tkiPlanIndicator.style.display =
    "none";

  tkiPlan =
    "free";

  tkiFreeUsed =
    0;

  tkiFreeLimit =
    TKI_FREE_DEFAULT_LIMIT;

}


function updateUsageFromResponse(
  usage,
  plan
) {

  if (
    plan === "pro"
  ) {

    updateTKIPlanIndicator(
      0,
      null,
      "pro"
    );

    return;

  }


  tkiPlan =
    "free";


  if (
    !usage
  ) {

    updateTKIPlanIndicator(
      tkiFreeUsed,
      tkiFreeLimit,
      "free"
    );

    return;

  }


  updateTKIPlanIndicator(

    usage.used,

    usage.limit,

    "free"

  );

}


/* =========================
   GOOGLE LOGIN
========================= */

googleLoginButton.addEventListener(
  "click",
  function() {

    if (
      auth.currentUser
    ) {

      auth.signOut()
        .catch(
          function(error) {

            console.error(
              "Erreur déconnexion Google :",
              error
            );

            alert(
              "Impossible de se déconnecter de Google."
            );

          }
        );

      return;

    }


    auth.signInWithPopup(
      googleProvider
    )

      .then(
        function(result) {

          fetch(
            API_BASE_URL +
            "/api/login-notification",
            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json"

              },

              body:
                JSON.stringify({

                  name:
                    result.user.displayName ||
                    "Utilisateur"

                })

            }
          );

        }
      )

      .catch(
        function(error) {

          console.error(
            "Erreur connexion Google :",
            error
          );

          alert(
            "Impossible de se connecter avec Google."
          );

        }
      );

  }
);


/* =========================
   AVATAR GOOGLE
========================= */

function updateProfileAvatar(
  user
) {

  if (!user) {

    profileAvatar.textContent =
      "👤";

    profileAvatar.style.backgroundImage =
      "none";

    profileAvatar.style.backgroundColor =
      "#eee";

    profileAvatar.style.color =
      "#111";

    profileButton.textContent =
      "👤";

    profileButton.style.backgroundImage =
      "none";

    return;

  }


  if (
    user.photoURL
  ) {

    profileAvatar.textContent =
      "";

    profileAvatar.style.backgroundImage =
      "url('" +
      user.photoURL +
      "')";

    profileAvatar.style.backgroundSize =
      "cover";

    profileAvatar.style.backgroundPosition =
      "center";

    profileAvatar.style.backgroundRepeat =
      "no-repeat";


    profileButton.textContent =
      "";

    profileButton.style.backgroundImage =
      "url('" +
      user.photoURL +
      "')";

    profileButton.style.backgroundSize =
      "cover";

    profileButton.style.backgroundPosition =
      "center";

    profileButton.style.backgroundRepeat =
      "no-repeat";

    return;

  }


  const name =
    user.displayName ||
    user.email ||
    "Utilisateur";


  const letter =
    name
      .trim()
      .charAt(0)
      .toUpperCase();


  profileAvatar.textContent =
    letter;

  profileAvatar.style.backgroundImage =
    "none";

  profileAvatar.style.backgroundColor =
    "#C9A227";

  profileAvatar.style.color =
    "white";

  profileAvatar.style.fontWeight =
    "bold";


  profileButton.textContent =
    letter;

  profileButton.style.backgroundImage =
    "none";

  profileButton.style.backgroundColor =
    "#C9A227";

  profileButton.style.color =
    "white";

  profileButton.style.fontWeight =
    "bold";

}


/* =========================
   CONVERSATIONS
========================= */

let conversations = [];

let currentConversationId =
  null;


let guestConversation =
  null;


/* =========================
   MÉMOIRE UTILISATEUR
========================= */

let userMemory = {};


async function loadUserMemory(
  user
) {

  userMemory = {};


  if (!user) {

    return;

  }


  try {

    const data =
      await apiFetch(
        "/api/memory"
      );


    const memoryRows =
      Array.isArray(
        data.memory
      )
        ? data.memory
        : [];


    memoryRows.forEach(
      function(row) {

        if (
          !row.category
        ) {

          return;

        }


        if (
          userMemory[
            row.category
          ] === undefined
        ) {

          userMemory[
            row.category
          ] =
            row.content || "";

        }

      }
    );


    const firstName =
      user.displayName
        ? user.displayName
            .trim()
            .split(" ")[0]
        : "";


    if (!firstName) {

      return;

    }


    const existingFirstName =
      memoryRows.find(
        function(row) {

          return (
            row.category ===
            "firstName"
          );

        }
      );


    if (
      !existingFirstName
    ) {

      await apiFetch(
        "/api/memory",
        {

          method:
            "POST",

          body:
            JSON.stringify({

              category:
                "firstName",

              content:
                firstName

            })

        }
      );


      userMemory.firstName =
        firstName;

    }

    else if (
      existingFirstName.content !==
      firstName
    ) {

      try {

        await apiFetch(

          "/api/memory/" +
          encodeURIComponent(
            existingFirstName.id
          ),

          {

            method:
              "DELETE"

          }

        );

      } catch (error) {

        console.error(
          "Impossible de supprimer l'ancien prénom :",
          error
        );

      }


      await apiFetch(
        "/api/memory",
        {

          method:
            "POST",

          body:
            JSON.stringify({

              category:
                "firstName",

              content:
                firstName

            })

        }
      );


      userMemory.firstName =
        firstName;

    }

  } catch (error) {

    console.error(
      "Erreur lors du chargement de la mémoire :",
      error
    );

    userMemory = {};

  }

}


/* =========================
   ID DISCUSSION ACTIVE
========================= */

function getCurrentConversationStorageKey(
  user
) {

  if (!user) {

    return null;

  }


  return (
    "tki_current_conversation_" +
    user.uid
  );

}


function saveCurrentConversationId() {

  const user =
    auth.currentUser;


  if (
    !user ||
    currentConversationId ===
      null
  ) {

    return;

  }


  const key =
    getCurrentConversationStorageKey(
      user
    );


  if (key) {

    localStorage.setItem(
      key,
      String(
        currentConversationId
      )
    );

  }

}


function getSavedCurrentConversationId(
  user
) {

  if (!user) {

    return null;

  }


  const key =
    getCurrentConversationStorageKey(
      user
    );


  if (!key) {

    return null;

  }


  return localStorage.getItem(
    key
  );

}


function clearSavedCurrentConversationId(
  user
) {

  if (!user) {

    return;

  }


  const key =
    getCurrentConversationStorageKey(
      user
    );


  if (key) {

    localStorage.removeItem(
      key
    );

  }

}


/* =========================
   CHARGER LES MESSAGES
========================= */

function normalizeSupabaseMessages(
  rows
) {

  return rows.map(
    function(row) {

      return {

        id:
          row.id,

        text:
          row.content || "",

        type:
          row.role === "user"
            ? "user-message"
            : "ai-message",

        image:
          row.image || null,

        sources:
          Array.isArray(
            row.sources
          )
            ? row.sources
            : [],

        created_at:
          row.created_at ||
          null

      };

    }
  );

}


async function loadConversationMessages(
  conversation
) {

  if (
    !auth.currentUser
  ) {

    return [];

  }


  const data =
    await apiFetch(

      "/api/conversations/" +
      encodeURIComponent(
        conversation.id
      ) +
      "/messages"

    );


  conversation.messages =
    normalizeSupabaseMessages(

      data.messages ||
      []

    );


  return conversation.messages;

}


/* =========================
   CHARGER LES CONVERSATIONS
========================= */

async function loadUserConversations(
  user
) {

  conversations = [];

  currentConversationId =
    null;

  messages.innerHTML =
    "";


  if (
    welcomeMessage
  ) {

    welcomeMessage.style.display =
      "";

  }


  renderConversationList();


  try {

    const data =
      await apiFetch(
        "/api/conversations"
      );


    if (
      !auth.currentUser ||
      auth.currentUser.uid !==
        user.uid
    ) {

      return;

    }


    const serverConversations =
      Array.isArray(
        data.conversations
      )
        ? data.conversations
        : [];


    conversations =
      serverConversations.map(
        function(conversation) {

          return {

            ...conversation,

            messages: []

          };

        }
      );


    await Promise.all(

      conversations.map(
        async function(conversation) {

          try {

            await loadConversationMessages(
              conversation
            );

          } catch (error) {

            console.error(
              "Impossible de charger les messages de la conversation " +
              conversation.id +
              " :",
              error
            );

            conversation.messages =
              [];

          }

        }
      )

    );


    conversations.sort(
      function(a, b) {

        const dateA =
          new Date(
            a.updated_at ||
            a.created_at ||
            0
          ).getTime();


        const dateB =
          new Date(
            b.updated_at ||
            b.created_at ||
            0
          ).getTime();


        return (
          dateB -
          dateA
        );

      }
    );


    renderConversationList();


    const savedConversationId =
      getSavedCurrentConversationId(
        user
      );


    if (
      savedConversationId
    ) {

      const savedConversation =
        conversations.find(
          function(conversation) {

            return (
              String(
                conversation.id
              ) ===
              String(
                savedConversationId
              )
            );

          }
        );


      if (
        savedConversation
      ) {

        openConversation(
          savedConversation.id
        );

      } else {

        clearSavedCurrentConversationId(
          user
        );

      }

    }

  } catch (error) {

    console.error(
      "Erreur lors du chargement des conversations :",
      error
    );


    conversations = [];


    renderConversationList();

  }

}


/* =========================
   CRÉER CONVERSATION
========================= */

async function createConversationOnSupabase(
  title
) {

  const data =
    await apiFetch(

      "/api/conversations",

      {

        method:
          "POST",

        body:
          JSON.stringify({

            title:
              title ||
              "Nouvelle conversation"

          })

      }

    );


  if (
    !data.conversation
  ) {

    throw new Error(
      "La conversation n'a pas été créée."
    );

  }


  return {

    ...data.conversation,

    messages: []

  };

}


/* =========================
   MODIFIER CONVERSATION
========================= */

async function saveConversation(
  conversation
) {

  if (
    !auth.currentUser ||
    !conversation ||
    !conversation.id
  ) {

    return;

  }


  try {

    await apiFetch(

      "/api/conversations/" +
      encodeURIComponent(
        conversation.id
      ),

      {

        method:
          "PUT",

        body:
          JSON.stringify({

            title:
              conversation.title ||
              "Nouvelle conversation",

            favorite:
              !!conversation.favorite

          })

      }

    );

  } catch (error) {

    console.error(
      "Erreur lors de la sauvegarde de la conversation :",
      error
    );

  }

}


/* =========================
   SUPPRIMER CONVERSATION
========================= */

async function deleteConversationFromSupabase(
  id
) {

  if (
    !auth.currentUser
  ) {

    return;

  }


  await apiFetch(

    "/api/conversations/" +
    encodeURIComponent(
      id
    ),

    {

      method:
        "DELETE"

    }

  );

}


/* =========================
   SAUVEGARDER UN MESSAGE
========================= */

async function saveMessageToSupabase(
  conversationId,
  message
) {

  if (
    !auth.currentUser
  ) {

    return;

  }


  const role =
    message.type ===
      "user-message"
      ? "user"
      : "model";


  await apiFetch(

    "/api/conversations/" +
    encodeURIComponent(
      conversationId
    ) +
    "/messages",

    {

      method:
        "POST",

      body:
        JSON.stringify({

          role:
            role,

          content:
            message.text ||
            "",

          image:
            message.image ||
            null,

          sources:
            Array.isArray(
              message.sources
            )
              ? message.sources
              : []

        })

    }

  );

}


/* =========================
   AUTHENTIFICATION
========================= */

auth.onAuthStateChanged(
  async function(user) {

    const username =
      document.querySelector(
        "#username"
      );


    if (user) {

      profileName.textContent =
        user.displayName ||
        "Utilisateur";


      profileEmail.textContent =
        user.email ||
        "";


      googleLoginButton.textContent =
        "🚪 Se déconnecter";


      updateProfileAvatar(
        user
      );


      /*
        AFFICHAGE IMMÉDIAT DU PLAN

        Dès que Firebase confirme que l'utilisateur
        est connecté, le badge Free apparaît immédiatement.

        Ensuite, TKI demande le vrai statut au serveur.
        Si le compte est Pro, le badge devient
        ⭐ TKI Pro dès que la réponse arrive.
      */

      updateTKIPlanIndicator(
        0,
        TKI_FREE_DEFAULT_LIMIT,
        "free"
      );

      applyTKIPersonalization();


      /*
        RÉCUPÉRATION DU VRAI PLAN
      */

      try {

        const planData =
          await apiFetch(
            "/api/user-plan"
          );


        const currentPlan =
          planData?.plan === "pro"
            ? "pro"
            : "free";


        if (
          currentPlan === "pro"
        ) {

          updateTKIPlanIndicator(
            0,
            null,
            "pro"
          );

        } else {

          updateTKIPlanIndicator(
            Number(
              planData?.used
            ) || 0,

            Number(
              planData?.limit
            ) ||
              TKI_FREE_DEFAULT_LIMIT,

            "free"
          );

        }


        applyTKIPersonalization();


      } catch (planError) {

        console.error(
          "Impossible de récupérer le plan TKI au chargement :",
          planError
        );


        /*
          En cas d'erreur, le badge Free reste
          visible au lieu de disparaître.
        */

        updateTKIPlanIndicator(
          0,
          TKI_FREE_DEFAULT_LIMIT,
          "free"
        );


        applyTKIPersonalization();

      }


      const firstName =
        user.displayName
          ? user.displayName
              .trim()
              .split(" ")[0]
          : "Utilisateur";


      if (username) {

        username.textContent =
          firstName;

      }


      guestConversation =
        null;


      await loadUserMemory(
        user
      );


      await loadUserConversations(
        user
      );


    } else {

      profileName.textContent =
        "Yacine";


      profileEmail.textContent =
        "Mon compte";


      googleLoginButton.textContent =
        "🔐 Se connecter avec Google";


      updateProfileAvatar(
        null
      );


      hideTKIPlanIndicator();


      if (username) {

        username.textContent =
          "comment puis-je vous aider ?";

      }


      conversations = [];

      currentConversationId =
        null;

      guestConversation =
        null;

      userMemory = {};

      messages.innerHTML =
        "";


      if (
        welcomeMessage
      ) {

        welcomeMessage.style.display =
          "";

      }


      renderConversationList();

    }

  }
);


/* =========================
   CONSTRUIRE LA MÉMOIRE
========================= */

function buildConversationMemory(
  currentConversation
) {

  if (
    !auth.currentUser
  ) {

    return "";

  }


  let memoryContext =
    "";


  const previousConversations =
    conversations.filter(
      function(conversation) {

        return (

          String(
            conversation.id
          ) !==
          String(
            currentConversation.id
          ) &&

          Array.isArray(
            conversation.messages
          ) &&

          conversation.messages.length >
            0

        );

      }
    );


  previousConversations.forEach(
    function(conversation) {

      memoryContext +=
        "\n\n--- Conversation précédente ---\n";


      memoryContext +=
        "Titre : " +
        (
          conversation.title ||
          "Sans titre"
        ) +
        "\n";


      conversation.messages.forEach(
        function(message) {

          memoryContext +=
            (
              message.type ===
              "user-message"
                ? "Utilisateur"
                : "TKI"
            ) +
            " : " +
            (
              message.text ||
              ""
            ) +
            "\n";

        }
      );

    }
  );


  const maxMemoryLength =
    12000;


  if (
    memoryContext.length >
    maxMemoryLength
  ) {

    memoryContext =
      memoryContext.substring(
        memoryContext.length -
          maxMemoryLength
      );


    memoryContext =
      "\n[Début du contexte historique tronqué]\n" +
      memoryContext;

  }


  return memoryContext;

}


/* =========================
   ENVOYER
========================= */

async function sendMessage() {

  const text =
    input.value.trim();


  if (
    text === "" &&
    !selectedImage
  ) {

    return;

  }


  if (
    welcomeMessage
  ) {

    welcomeMessage.style.display =
      "none";

  }


  let conversation =
    getCurrentConversation();


  /* =========================
     INVITÉ
  ========================= */

  if (
    !auth.currentUser
  ) {

    if (
      !guestConversation
    ) {

      const title =
        text !== ""
          ? (
              text.length > 30
                ? text.substring(
                    0,
                    30
                  ) +
                  "..."
                : text
            )
          : "Analyse d'image";


      guestConversation = {

        id:
          "guest",

        title:
          title,

        messages: [],

        favorite:
          false

      };

    }


    conversation =
      guestConversation;


    currentConversationId =
      null;

  }


  /* =========================
     UTILISATEUR CONNECTÉ
  ========================= */

  if (
    auth.currentUser &&
    !conversation
  ) {

    const title =
      text !== ""
        ? (
            text.length > 30
              ? text.substring(
                  0,
                  30
                ) +
                "..."
              : text
          )
        : "Analyse d'image";


    try {

      conversation =
        await createConversationOnSupabase(
          title
        );

    } catch (error) {

      console.error(
        "Erreur création conversation :",
        error
      );


      alert(
        "Impossible de créer la conversation."
      );


      return;

    }


    conversations.unshift(
      conversation
    );


    currentConversationId =
      conversation.id;


    saveCurrentConversationId();


    renderConversationList();

  } else if (
    auth.currentUser &&
    conversation
  ) {

    saveCurrentConversationId();

  }


  /* =========================
     IMAGE
  ========================= */

  const imageToSend =
    selectedImage
      ? {

          mimeType:
            selectedImage.mimeType,

          data:
            selectedImage.data

        }
      : null;


  /* =========================
     MESSAGE UTILISATEUR
  ========================= */

  const userMessage = {

    text:
      text !== ""
        ? text
        : "Analyse cette image.",

    type:
      "user-message",

    image:
      selectedImage
        ? selectedImage.preview
        : null

  };


  conversation.messages.push(
    userMessage
  );


  addMessage(

    userMessage.text,

    "user-message",

    userMessage.image,

    []

  );


  input.value =
    "";


  selectedImage =
    null;


  imageInput.value =
    "";


  imagePreview.src =
    "";


  imagePreviewContainer.classList.remove(
    "show"
  );


  await sendMessageToGemini(

    text !== ""
      ? text
      : "Qu'est-ce qu'il y a sur cette image ?",

    conversation,

    imageToSend,

    userMessage

  );

}


/* =========================
   CONNECTER TKI À GEMINI
========================= */

async function sendMessageToGemini(
  userText,
  conversation,
  image = null,
  userMessage = null
) {

  const thinkingMessage =
    document.createElement(
      "div"
    );


  thinkingMessage.classList.add(
    "message",
    "ai-message"
  );


  thinkingMessage.textContent =
    webSearchEnabled
      ? "TKI recherche sur Internet…"
      : "TKI réfléchit…";


  messages.appendChild(
    thinkingMessage
  );


  messages.scrollTop =
    messages.scrollHeight;


  try {

    const conversationHistory =
      conversation.messages
        .slice(-30)
        .map(
          function(message) {

            return {

              role:
                message.type ===
                "user-message"
                  ? "user"
                  : "model",

              text:
                message.text ||
                ""

            };

          }
        );


    let memoryContext =
      "";


    if (
      auth.currentUser &&
      userMemory.firstName
    ) {

      memoryContext =
        "Mémoire utilisateur : Le prénom de l'utilisateur est " +
        userMemory.firstName +
        ".\n\n";

    }


    const previousConversationMemory =
      buildConversationMemory(
        conversation
      );


    if (
      previousConversationMemory
    ) {

      memoryContext +=
        "Historique des conversations précédentes de cet utilisateur. " +
        "Utilise ces informations uniquement lorsqu'elles sont pertinentes " +
        "pour répondre à la question actuelle.\n" +
        previousConversationMemory +
        "\n\n";

    }


    /* =========================
       REQUÊTE VERS RENDER
    ========================= */

    const requestBody = {

      conversationId:
        conversation.id,

      message:
        userText,

      memoryContext:
        memoryContext,

      conversationHistory:
        conversationHistory,

      webSearch:
        webSearchEnabled

    };


    /* =========================
       IMAGE
    ========================= */

    if (
      image
    ) {

      requestBody.image = {

        mimeType:
          image.mimeType,

        data:
          image.data

      };

    }


    console.log(
      "TKI /api/chat :",
      {
        conversationId:
          requestBody.conversationId,
        message:
          requestBody.message
      }
    );


    const response =
      await fetch(

        API_BASE_URL +
        "/api/chat",

        {

          method:
            "POST",

          headers:
            getApiHeaders(),

          body:
            JSON.stringify(
              requestBody
            )

        }

      );


    let data = {};


    try {

      data =
        await response.json();

    } catch (error) {

      data = {};

    }


    /* =========================
       LIMITE TKI FREE
    ========================= */

    if (
      response.status ===
      429 &&
      data.code ===
        "FREE_LIMIT_REACHED"
    ) {

      thinkingMessage.remove();


      if (
        conversation.messages.length >
        0 &&
        conversation.messages[
          conversation.messages.length - 1
        ] ===
          userMessage
      ) {

        conversation.messages.pop();

      }


      updateTKIPlanIndicator(

        data.used,

        data.limit

      );


      if (
        input.value.trim() === ""
      ) {

        input.value =
          userText;

      }


      const limitMessage =
        document.createElement(
          "div"
        );


      limitMessage.classList.add(
        "message",
        "ai-message"
      );


      limitMessage.innerHTML =
        "<strong>Limite TKI Free atteinte</strong><br><br>" +
        "Tu as atteint les " +
        data.limit +
        " messages gratuits autorisés dans cette conversation.<br><br>" +
        "Tu peux continuer avec TKI Pro.";


      messages.appendChild(
        limitMessage
      );


      messages.scrollTop =
        messages.scrollHeight;


      return;

    }


    /* =========================
       AUTRES ERREURS SERVEUR
    ========================= */

    if (
      !response.ok
    ) {

      throw new Error(

        data.error ||
        data.message ||
        "Erreur du serveur"

      );

    }


    thinkingMessage.remove();


    /* =========================
       COMPTEUR FREE
    ========================= */

    updateUsageFromResponse(
      data.usage,
      data.plan
    );


    /* =========================
       RÉPONSE TKI
    ========================= */

    const aiResponse =
      data.reply ||
      "Je n'ai pas reçu de réponse.";


    const aiMessage = {

      text:
        aiResponse,

      type:
        "ai-message",

      sources:
        Array.isArray(
          data.sources
        )
          ? data.sources
          : []

    };


    conversation.messages.push(
      aiMessage
    );


    addMessage(

      aiResponse,

      "ai-message",

      null,

      aiMessage.sources

    );


    /* =========================
       SAUVEGARDE SUPABASE
    ========================= */

    if (
      auth.currentUser
    ) {

      try {

        if (
          userMessage
        ) {

          await saveMessageToSupabase(

            conversation.id,

            userMessage

          );

        }


        await saveMessageToSupabase(

          conversation.id,

          aiMessage

        );


      } catch (error) {

        console.error(
          "Erreur sauvegarde messages :",
          error
        );

      }

    }


  } catch (error) {

    console.error(
      "Erreur TKI :",
      error
    );


    thinkingMessage.remove();


    const errorMessage =
      "Désolé, une erreur technique est survenue.";


    addMessage(

      errorMessage,

      "ai-message",

      null,

      []

    );

  }

}


/* =========================
   MARKDOWN TKI
========================= */

function escapeHtml(
  text
) {

  return String(
    text
  )

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


function renderMarkdown(
  text
) {

  let html =
    escapeHtml(
      text || ""
    );


  const codeBlocks =
    [];


  html =
    html.replace(

      /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g,

      function(
        match,
        language,
        code
      ) {

        const index =
          codeBlocks.length;


        codeBlocks.push(

          '<pre class="tki-code-block"><code>' +

          code.trim() +

          '</code></pre>'

        );


        return (

          "___TKI_CODE_BLOCK_" +

          index +

          "___"

        );

      }

    );


  html =
    html.replace(
      /^### (.+)$/gm,
      "<h4>$1</h4>"
    );


  html =
    html.replace(
      /^## (.+)$/gm,
      "<h3>$1</h3>"
    );


  html =
    html.replace(
      /^# (.+)$/gm,
      "<h2>$1</h2>"
    );


  html =
    html.replace(

      /`([^`\n]+)`/g,

      '<code class="tki-inline-code">$1</code>'

    );


  html =
    html.replace(
      /\*\*(.+?)\*\*/g,
      "<strong>$1</strong>"
    );


  html =
    html.replace(

      /(^|[^*])\*([^*\n]+)\*(?!\*)/g,

      "$1<em>$2</em>"

    );


  html =
    html.replace(
      /^[-*] (.+)$/gm,
      "<li>$1</li>"
    );


  html =
    html.replace(

      /((?:<li>.*<\/li>)+)/g,

      "<ul>$1</ul>"

    );


  html =
    html.replace(

      /^\d+\. (.+)$/gm,

      "<li>$1</li>"

    );


  html =
    html.replace(

      /((?:<li>.*<\/li>)+)/g,

      "<ol>$1</ol>"

    );


  html =
    html.replace(
      /\n{2,}/g,
      "<br><br>"
    );


  html =
    html.replace(
      /\n/g,
      "<br>"
    );


  codeBlocks.forEach(
    function(
      codeBlock,
      index
    ) {

      html =
        html.replace(

          "___TKI_CODE_BLOCK_" +
          index +
          "___",

          codeBlock

        );

    }
  );


  return html;

}


/* =========================
   AFFICHER MESSAGE
========================= */

function addMessage(
  text,
  className,
  image = null,
  sources = []
) {

  const message =
    document.createElement(
      "div"
    );


  message.classList.add(
    "message",
    className
  );


  if (
    image &&
    className ===
      "user-message"
  ) {

    const imageElement =
      document.createElement(
        "img"
      );


    imageElement.src =
      image;


    imageElement.classList.add(
      "message-image"
    );


    imageElement.alt =
      "Image envoyée à TKI";


    message.appendChild(
      imageElement
    );

  }


  if (
    className ===
      "ai-message"
  ) {

    message.innerHTML +=
      renderMarkdown(
        text
      );

  } else {

    const textElement =
      document.createElement(
        "span"
      );


    textElement.textContent =
      text;


    message.appendChild(
      textElement
    );

  }


  if (
    className ===
      "ai-message" &&
    Array.isArray(sources) &&
    sources.length > 0
  ) {

    const sourcesContainer =
      document.createElement(
        "div"
      );


    sourcesContainer.classList.add(
      "web-sources"
    );


    const sourcesTitle =
      document.createElement(
        "div"
      );


    sourcesTitle.classList.add(
      "web-sources-title"
    );


    sourcesTitle.textContent =
      "🌐 Sources utilisées";


    sourcesContainer.appendChild(
      sourcesTitle
    );


    sources.forEach(
      function(source) {

        if (
          !source ||
          !source.url
        ) {

          return;

        }


        const link =
          document.createElement(
            "a"
          );


        link.classList.add(
          "web-source-link"
        );


        link.href =
          source.url;


        link.target =
          "_blank";


        link.rel =
          "noopener noreferrer";


        link.textContent =
          source.title ||
          source.url;


        sourcesContainer.appendChild(
          link
        );

      }
    );


    message.appendChild(
      sourcesContainer
    );

  }


  messages.appendChild(
    message
  );


  messages.scrollTop =
    messages.scrollHeight;

}


/* =========================
   NOUVELLE DISCUSSION
========================= */

newChatButton.addEventListener(
  "click",
  function() {

    currentConversationId =
      null;


    if (
      !auth.currentUser
    ) {

      guestConversation =
        null;

    }


    const user =
      auth.currentUser;


    if (user) {

      clearSavedCurrentConversationId(
        user
      );

    }


    messages.innerHTML =
      "";


    input.value =
      "";


    selectedImage =
      null;


    imageInput.value =
      "";


    imagePreview.src =
      "";


    imagePreviewContainer.classList.remove(
      "show"
    );


    if (
      welcomeMessage
    ) {

      welcomeMessage.style.display =
        "";

    }


    input.focus();


    sidebar.classList.remove(
      "open"
    );

  }
);


/* =========================
   MENU LATÉRAL
========================= */

menuButton.addEventListener(
  "click",
  function(event) {

    event.stopPropagation();


    sidebar.classList.toggle(
      "open"
    );

  }
);


/* =========================
   HISTORIQUE
========================= */

function renderConversationList() {

  conversationList.innerHTML =
    "";


  if (
    !auth.currentUser
  ) {

    return;

  }


  conversations.forEach(
    function(conversation) {

      const container =
        document.createElement(
          "div"
        );


      container.classList.add(
        "conversation-item"
      );


      container.style.display =
        "flex";


      container.style.alignItems =
        "center";


      container.style.width =
        "100%";


      const button =
        document.createElement(
          "button"
        );


      button.classList.add(
        "conversation"
      );


      button.textContent =
        (
          conversation.favorite
            ? "⭐ "
            : ""
        ) +
        (
          conversation.title ||
          "Nouvelle conversation"
        );


      button.style.flex =
        "1";


      button.addEventListener(
        "click",
        function() {

          openConversation(
            conversation.id
          );

        }
      );


      const moreButton =
        document.createElement(
          "button"
        );


      moreButton.classList.add(
        "conversation-more"
      );


      moreButton.textContent =
        "⋯";


      moreButton.style.background =
        "none";


      moreButton.style.border =
        "none";


      moreButton.style.cursor =
        "pointer";


      moreButton.style.fontSize =
        "20px";


      moreButton.style.padding =
        "5px 10px";


      const menu =
        document.createElement(
          "div"
        );


      menu.classList.add(
        "conversation-menu"
      );


      menu.style.display =
        "none";


      menu.style.position =
        "absolute";


      menu.style.zIndex =
        "1000";


      menu.style.background =
        "white";


      menu.style.borderRadius =
        "10px";


      menu.style.padding =
        "6px";


      menu.style.boxShadow =
        "0 4px 15px rgba(0,0,0,0.15)";


      const favoriteButton =
        document.createElement(
          "button"
        );


      favoriteButton.textContent =
        conversation.favorite
          ? "⭐ Retirer des favoris"
          : "⭐ Ajouter aux favoris";


      favoriteButton.style.display =
        "block";


      favoriteButton.style.width =
        "100%";


      favoriteButton.style.border =
        "none";


      favoriteButton.style.background =
        "none";


      favoriteButton.style.padding =
        "9px";


      favoriteButton.style.cursor =
        "pointer";


      favoriteButton.style.textAlign =
        "left";


      favoriteButton.addEventListener(
        "click",
        function(event) {

          event.stopPropagation();


          conversation.favorite =
            !conversation.favorite;


          menu.style.display =
            "none";


          renderConversationList();


          saveConversation(
            conversation
          );

        }
      );


      const renameButton =
        document.createElement(
          "button"
        );


      renameButton.textContent =
        "✏️ Renommer";


      renameButton.style.display =
        "block";


      renameButton.style.width =
        "100%";


      renameButton.style.border =
        "none";


      renameButton.style.background =
        "none";


      renameButton.style.padding =
        "9px";


      renameButton.style.cursor =
        "pointer";


      renameButton.style.textAlign =
        "left";


      renameButton.addEventListener(
        "click",
        function(event) {

          event.stopPropagation();


          const newTitle =
            prompt(

              "Nouveau nom de la conversation :",

              conversation.title

            );


          if (
            newTitle !== null &&
            newTitle.trim() !== ""
          ) {

            conversation.title =
              newTitle.trim();


            renderConversationList();


            saveConversation(
              conversation
            );

          }


          menu.style.display =
            "none";

        }
      );


      const deleteButton =
        document.createElement(
          "button"
        );


      deleteButton.textContent =
        "🗑️ Effacer la conversation";


      deleteButton.style.display =
        "block";


      deleteButton.style.width =
        "100%";


      deleteButton.style.border =
        "none";


      deleteButton.style.background =
        "none";


      deleteButton.style.padding =
        "9px";


      deleteButton.style.cursor =
        "pointer";


      deleteButton.style.textAlign =
        "left";


      deleteButton.style.color =
        "red";


      deleteButton.addEventListener(
        "click",
        async function(event) {

          event.stopPropagation();


          const confirmed =
            confirm(
              "Supprimer cette conversation ?"
            );


          if (!confirmed) {

            return;

          }


          try {

            if (
              auth.currentUser
            ) {

              await deleteConversationFromSupabase(
                conversation.id
              );

            }


            conversations =
              conversations.filter(
                function(item) {

                  return (
                    String(
                      item.id
                    ) !==
                    String(
                      conversation.id
                    )
                  );

                }
              );


            if (
              String(
                currentConversationId
              ) ===
              String(
                conversation.id
              )
            ) {

              currentConversationId =
                null;


              const user =
                auth.currentUser;


              if (user) {

                clearSavedCurrentConversationId(
                  user
                );

              }


              messages.innerHTML =
                "";


              input.value =
                "";


              if (
                welcomeMessage
              ) {

                welcomeMessage.style.display =
                  "";

              }

            }


            renderConversationList();


          } catch (error) {

            console.error(
              "Erreur suppression conversation :",
              error
            );


            alert(
              "Impossible de supprimer la conversation."
            );

          }

        }
      );


      menu.appendChild(
        favoriteButton
      );


      menu.appendChild(
        renameButton
      );


      menu.appendChild(
        deleteButton
      );


      moreButton.addEventListener(
        "click",
        function(event) {

          event.stopPropagation();


          document
            .querySelectorAll(
              ".conversation-menu"
            )
            .forEach(
              function(otherMenu) {

                if (
                  otherMenu !==
                  menu
                ) {

                  otherMenu.style.display =
                    "none";

                }

              }
            );


          menu.style.display =
            menu.style.display ===
            "none"
              ? "block"
              : "none";

        }
      );


      menu.addEventListener(
        "click",
        function(event) {

          event.stopPropagation();

        }
      );


      container.style.position =
        "relative";


      container.appendChild(
        button
      );


      container.appendChild(
        moreButton
      );


      container.appendChild(
        menu
      );


      conversationList.appendChild(
        container
      );

    }
  );

}


/* =========================
   OUVRIR DISCUSSION
========================= */

async function openConversation(
  id
) {

  if (
    !auth.currentUser
  ) {

    return;

  }


  const conversation =
    conversations.find(
      function(item) {

        return (
          String(
            item.id
          ) ===
          String(
            id
          )
        );

      }
    );


  if (!conversation) {

    return;

  }


  currentConversationId =
    conversation.id;


  saveCurrentConversationId();


  messages.innerHTML =
    "";


  if (
    welcomeMessage
  ) {

    welcomeMessage.style.display =
      "none";

  }


  try {

    await loadConversationMessages(
      conversation
    );

  } catch (error) {

    console.error(
      "Erreur chargement conversation :",
      error
    );


    alert(
      "Impossible de charger cette conversation."
    );


    return;

  }


  conversation.messages.forEach(
    function(message) {

      addMessage(

        message.text,

        message.type,

        message.image ||
          null,

        message.sources ||
          []

      );

    }
  );


  sidebar.classList.remove(
    "open"
  );


  renderConversationList();

}


/* =========================
   RÉCUPÉRER DISCUSSION
========================= */

function getCurrentConversation() {

  if (
    !auth.currentUser
  ) {

    return guestConversation;

  }


  return conversations.find(
    function(conversation) {

      return (
        String(
          conversation.id
        ) ===
        String(
          currentConversationId
        )
      );

    }
  );

}


/* =========================
   PROFIL
========================= */

profileButton.addEventListener(
  "click",
  function(event) {

    event.stopPropagation();


    profilePanel.classList.toggle(
      "open"
    );

  }
);


/* =========================
   APPARENCE
========================= */

appearanceButton.addEventListener(
  "click",
  function(event) {

    event.stopPropagation();


    appearanceMenu.classList.toggle(
      "open"
    );


    languageMenu.classList.remove(
      "open"
    );


    notificationMenu.classList.remove(
      "open"
    );


    settingsMenu.classList.remove(
      "open"
    );

  }
);


lightTheme.addEventListener(
  "click",
  function() {
    document.body.classList.remove(
      "dark-mode"
    );

    localStorage.setItem(
      TKI_APPEARANCE_KEY,
      "light"
    );
  }
);

darkTheme.addEventListener(
  "click",
  function() {
    document.body.classList.add(
      "dark-mode"
    );

    localStorage.setItem(
      TKI_APPEARANCE_KEY,
      "dark"
    );
  }
);


/* =========================
   LANGUE
========================= */

languageButton.addEventListener(
  "click",
  function(event) {

    event.stopPropagation();


    languageMenu.classList.toggle(
      "open"
    );


    appearanceMenu.classList.remove(
      "open"
    );


    notificationMenu.classList.remove(
      "open"
    );


    settingsMenu.classList.remove(
      "open"
    );

  }
);


document
  .querySelectorAll(
    ".language-option"
  )
  .forEach(
    function(option) {

      option.addEventListener(
        "click",
        function() {

          console.log(
            "Langue choisie :",
            option.dataset.language
          );


          languageMenu.classList.remove(
            "open"
          );

        }
      );

    }
  );


/* =========================
   NOTIFICATIONS
========================= */

notificationButton.addEventListener(
  "click",
  function(event) {

    event.stopPropagation();


    notificationMenu.classList.toggle(
      "open"
    );


    appearanceMenu.classList.remove(
      "open"
    );


    languageMenu.classList.remove(
      "open"
    );


    settingsMenu.classList.remove(
      "open"
    );

  }
);


/* =========================
   PARAMÈTRES
========================= */

settingsButton.addEventListener(
  "click",
  function(event) {

    event.stopPropagation();


    settingsMenu.classList.toggle(
      "open"
    );


    appearanceMenu.classList.remove(
      "open"
    );


    languageMenu.classList.remove(
      "open"
    );


    notificationMenu.classList.remove(
      "open"
    );

  }
);


/* =========================
   ON / OFF
========================= */

document
  .querySelectorAll(
    ".toggle"
  )
  .forEach(
    function(toggle) {

      toggle.addEventListener(
        "click",
        function() {

          toggle.classList.toggle(
            "active"
          );


          if (
            toggle.classList.contains(
              "active"
            )
          ) {

            toggle.textContent =
              "ON";

          } else {

            toggle.textContent =
              "OFF";

          }

        }
      );

    }
  );


/* =========================
   TAILLE DU TEXTE
========================= */

textSize.addEventListener(
  "change",
  function() {

    document.body.classList.remove(

      "text-small",

      "text-normal",

      "text-large"

    );


    document.body.classList.add(

      "text-" +
      textSize.value

    );

  }
);


/* =========================
   RÉINITIALISER
========================= */

resetSettings.addEventListener(
  "click",
  function() {

    document.body.classList.remove(
      "dark-mode"
    );


    /* Retour au mode clair par défaut */
    localStorage.setItem(
      TKI_APPEARANCE_KEY,
      "light"
    );


    document.body.classList.remove(
      "text-small",
      "text-large"
    );


    document.body.classList.add(
      "text-normal"
    );


    textSize.value =
      "normal";


    const soundToggle =
      document.querySelector(
        "#soundToggle"
      );


    soundToggle.classList.add(
      "active"
    );


    soundToggle.textContent =
      "ON";


    const animationToggle =
      document.querySelector(
        "#animationToggle"
      );


    animationToggle.classList.add(
      "active"
    );


    animationToggle.textContent =
      "ON";


    document
      .querySelectorAll(
        "#notificationMenu .toggle"
      )
      .forEach(
        function(toggle) {

          toggle.classList.add(
            "active"
          );


          toggle.textContent =
            "ON";

        }
      );

  }
);


/* =========================
   CLIQUER AILLEURS
========================= */

document.addEventListener(
  "click",
  function(event) {

    if (
      !profilePanel.contains(
        event.target
      ) &&
      event.target !==
        profileButton
    ) {

      profilePanel.classList.remove(
        "open"
      );

    }


    document
      .querySelectorAll(
        ".conversation-menu"
      )
      .forEach(
        function(menu) {

          menu.style.display =
            "none";

        }
      );

  }
);


/* =========================
   ENVOYER LE MESSAGE
========================= */

sendButton.addEventListener(
  "click",
  function() {

    sendMessage();

  }
);


/* =========================
   ENTRÉE POUR ENVOYER
========================= */

input.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }

  }
);


/* =========================
   APPLICATION PERSONNALISATION
========================= */

applyTKIPersonalization();
