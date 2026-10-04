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


/* OUVRIR LE SÉLECTEUR */

imageButton.addEventListener(
  "click",
  function() {
    imageInput.click();
  }
);


/* CHOISIR UNE IMAGE */

imageInput.addEventListener(
  "change",
  function() {

    const file =
      imageInput.files[0];

    if (!file) {
      return;
    }

    /*
      Taille maximale :
      6 Mo.
    */

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

    /*
      Vérification du type.
    */

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

    /*
      Lecture de l'image en Base64.
    */

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


/* RETIRER L'IMAGE */

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


/* ACTIVER / DÉSACTIVER */

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
   UNIQUEMENT
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


/*
  Toutes les requêtes vers Render
  utilisent automatiquement l'UID
  Firebase de l'utilisateur connecté.

  IMPORTANT :
  Firebase sert ici à identifier
  l'utilisateur côté frontend.

  La vérification sécurisée du token
  Firebase côté serveur sera renforcée
  dans une étape ultérieure.
*/

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


/*
  Fonction centrale pour appeler
  le backend Render.
*/

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

    throw new Error(

      data.error ||
      data.message ||
      `Erreur API (${response.status})`

    );

  }


  return data;

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
   SUPABASE
========================= */

let conversations = [];

let currentConversationId =
  null;


/* =========================
   MÉMOIRE UTILISATEUR
   SUPABASE
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


    /*
      Reconstituer l'objet mémoire
      utilisé actuellement par TKI.
    */

    memoryRows.forEach(
      function(row) {

        if (
          !row.category
        ) {

          return;

        }


        /*
          Si plusieurs lignes ont
          la même catégorie, on garde
          la première.
        */

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


    /*
      Conserver le prénom Google
      dans la mémoire Supabase.
    */

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


    /*
      Aucun prénom enregistré :
      on le crée.
    */

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


    /*
      Le prénom a changé :
      on remplace l'ancienne valeur.
    */

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
   D'UNE CONVERSATION
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
   SUPABASE
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

    /*
      Récupère uniquement les
      conversations de l'utilisateur.
    */

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


    /*
      Conversion vers le format
      utilisé par l'interface TKI.
    */

    conversations =
      serverConversations.map(
        function(conversation) {

          return {

            ...conversation,

            messages: []

          };

        }
      );


    /*
      Pour conserver le fonctionnement
      actuel de TKI, on charge aussi
      les messages.
    */

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


    /*
      Les conversations les plus
      récemment modifiées apparaissent
      en premier.
    */

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


    /*
      Restaurer la conversation
      qui était ouverte avant.
    */

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
   SUPABASE
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
   SUPABASE
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
   SUPABASE
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
   SUPABASE
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


      /*
        Firebase :
        connexion seulement.

        Supabase :
        mémoire + conversations.
      */

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


      if (username) {

        username.textContent =
          "comment puis-je vous aider ?";

      }


      conversations = [];

      currentConversationId =
        null;

      userMemory = {};

      messages.innerHTML =
        "";


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


  /*
    Il est possible d'envoyer
    une image même sans texte.
  */

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


  /*
    NOUVELLE DISCUSSION

    Si l'utilisateur est connecté :
    création réelle dans Supabase.

    Sinon :
    discussion locale uniquement.
  */

  if (!conversation) {

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


    if (
      auth.currentUser
    ) {

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

    } else {

      conversation = {

        id:
          Date.now(),

        title:
          title,

        messages: [],

        favorite:
          false

      };

    }


    conversations.unshift(
      conversation
    );


    currentConversationId =
      conversation.id;


    saveCurrentConversationId();


    renderConversationList();

  } else {

    saveCurrentConversationId();

  }


  /*
    Préparer l'image pour Gemini.
  */

  const imageToSend =
    selectedImage
      ? {

          mimeType:
            selectedImage.mimeType,

          data:
            selectedImage.data

        }
      : null;


  /*
    MESSAGE UTILISATEUR
  */

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


  /*
    Nettoyage de l'image.
  */

  selectedImage =
    null;


  imageInput.value =
    "";


  imagePreview.src =
    "";


  imagePreviewContainer.classList.remove(
    "show"
  );


  /*
    Sauvegarder le message utilisateur
    dans Supabase.
  */

  if (
    auth.currentUser
  ) {

    try {

      await saveMessageToSupabase(

        conversation.id,

        userMessage

      );

    } catch (error) {

      console.error(
        "Erreur sauvegarde message utilisateur :",
        error
      );

    }

  }


  /*
    Envoyer à Gemini via Render.
  */

  await sendMessageToGemini(

    text !== ""
      ? text
      : "Qu'est-ce qu'il y a sur cette image ?",

    conversation,

    imageToSend

  );

}


/* =========================
   CONNECTER TKI À GEMINI
========================= */

async function sendMessageToGemini(
  userText,
  conversation,
  image = null
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

    /*
      Historique des derniers messages.
    */

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


    /*
      Mémoire utilisateur.
    */

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


    /*
      Mémoire des anciennes conversations.
    */

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


    /*
      DONNÉES ENVOYÉES AU BACKEND.
    */

    const requestBody = {

      message:
        userText,

      memoryContext:
        memoryContext,

      conversationHistory:
        conversationHistory,

      webSearch:
        webSearchEnabled

    };


    /*
      IMAGE
    */

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


    if (
      !response.ok
    ) {

      throw new Error(

        data.error ||
        "Erreur du serveur"

      );

    }


    thinkingMessage.remove();


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


    /*
      Sauvegarder la réponse TKI
      dans Supabase.
    */

    if (
      auth.currentUser
    ) {

      try {

        await saveMessageToSupabase(

          conversation.id,

          aiMessage

        );

      } catch (error) {

        console.error(
          "Erreur sauvegarde réponse TKI :",
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


    const aiErrorMessage = {

      text:
        errorMessage,

      type:
        "ai-message",

      sources:
        []

    };


    conversation.messages.push(
      aiErrorMessage
    );


    addMessage(

      errorMessage,

      "ai-message",

      null,

      []

    );


    if (
      auth.currentUser
    ) {

      try {

        await saveMessageToSupabase(

          conversation.id,

          aiErrorMessage

        );

      } catch (saveError) {

        console.error(
          "Erreur sauvegarde message d'erreur :",
          saveError
        );

      }

    }

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


  /*
    IMAGE
  */

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


  /*
    MESSAGE TKI
  */

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


  /*
    SOURCES INTERNET
  */

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

            /*
              Supabase d'abord.
            */

            if (
              auth.currentUser
            ) {

              await deleteConversationFromSupabase(
                conversation.id
              );

            }


            /*
              Puis suppression locale.
            */

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


  /*
    Recharge les messages depuis
    Supabase pour être certain d'avoir
    la version la plus récente.
  */

  if (
    auth.currentUser
  ) {

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

  }
);


darkTheme.addEventListener(
  "click",
  function() {

    document.body.classList.add(
      "dark-mode"
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
