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
   FIREBASE
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


const db =
  firebase.firestore();


db.settings({
  experimentalForceLongPolling: true
});


const googleProvider =
  new firebase.auth.GoogleAuthProvider();


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
            "https://tki-backend.onrender.com/api/login-notification",
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
   CONVERSATIONS FIRESTORE
========================= */

let conversations = [];

let currentConversationId =
  null;


function getUserConversationsCollection() {

  const user =
    auth.currentUser;


  if (!user) {

    return null;

  }


  return db
    .collection("users")
    .doc(user.uid)
    .collection("conversations");

}


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

    const document =
      await db
        .collection("users")
        .doc(user.uid)
        .get();


    if (
      document.exists
    ) {

      const data =
        document.data();


      if (
        data &&
        data.memory
      ) {

        userMemory =
          data.memory;

      }

    }


    const firstName =
      user.displayName
        ? user.displayName
            .trim()
            .split(" ")[0]
        : "";


    if (
      firstName &&
      userMemory.firstName !== firstName
    ) {

      userMemory.firstName =
        firstName;


      await db
        .collection("users")
        .doc(user.uid)
        .set(

          {
            memory:
              userMemory
          },

          {
            merge:
              true
          }

        );

    }

  } catch (error) {

    console.error(
      "Erreur lors du chargement de la mémoire :",
      error
    );

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
    !currentConversationId
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

    const snapshot =
      await db
        .collection("users")
        .doc(user.uid)
        .collection("conversations")
        .get();


    if (
      !auth.currentUser ||
      auth.currentUser.uid !==
        user.uid
    ) {

      return;

    }


    conversations =
      snapshot.docs.map(
        function(doc) {

          return doc.data();

        }
      );


    conversations.sort(
      function(a, b) {

        return (
          Number(b.id) -
          Number(a.id)
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
   SAUVEGARDER UNE CONVERSATION
========================= */

async function saveConversation(
  conversation
) {

  const collection =
    getUserConversationsCollection();


  if (
    !collection ||
    !conversation
  ) {

    return;

  }


  try {

    await collection
      .doc(
        String(
          conversation.id
        )
      )
      .set(
        conversation
      );

  } catch (error) {

    console.error(
      "Erreur lors de la sauvegarde de la conversation :",
      error
    );

  }

}


/* =========================
   SUPPRIMER UNE CONVERSATION
========================= */

async function deleteConversationFromFirestore(
  id
) {

  const collection =
    getUserConversationsCollection();


  if (!collection) {

    return;

  }


  try {

    await collection
      .doc(
        String(id)
      )
      .delete();

  } catch (error) {

    console.error(
      "Erreur lors de la suppression de la conversation :",
      error
    );

  }

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
   ENVOYER
========================= */

sendButton.addEventListener(
  "click",
  sendMessage
);


input.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key ===
      "Enter"
    ) {

      sendMessage();

    }

  }
);


function sendMessage() {

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


  /* NOUVELLE DISCUSSION */

  if (!conversation) {

    conversation = {

      id:
        Date.now(),

      title:
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
          : "Analyse d'image",

      messages: [],

      favorite:
        false

    };


    if (
      auth.currentUser
    ) {

      conversations.unshift(
        conversation
      );


      currentConversationId =
        conversation.id;


      saveCurrentConversationId();


      renderConversationList();


      saveConversation(
        conversation
      );

    }

  } else {

    saveCurrentConversationId();

  }


  /* MESSAGE UTILISATEUR */

  const userMessage = {

    text:
      text !== ""
        ? text
        : "Analyse cette image.",

    type:
      "user-message"

  };


  if (
    selectedImage
  ) {

    userMessage.image =
      selectedImage.preview;

  }


  conversation.messages.push(
    userMessage
  );


  addMessage(

    userMessage.text,

    "user-message",

    selectedImage
      ? selectedImage.preview
      : null

  );


  input.value =
    "";


  /*
    Conserver l'image
    pour l'envoi.
  */

  const imageToSend =
    selectedImage;


  /*
    Nettoyage de l'interface.
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


  if (
    auth.currentUser
  ) {

    saveConversation(
      conversation
    );

  }


  sendMessageToGemini(

    text !== ""
      ? text
      : "Qu'est-ce qu'il y a sur cette image ?",

    conversation,

    imageToSend

  );

}


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

          conversation.id !==
            currentConversation.id &&

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
            message.text +
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

    const conversationHistory =
      conversation.messages
        .map(
          function(message) {

            return (

              (
                message.type ===
                "user-message"

                  ? "Utilisateur"

                  : "TKI"

              ) +

              " : " +

              message.text

            );

          }
        )
        .join(
          "\n\n"
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


    /*
      Préparation des données.
    */

    const requestBody = {

      message:

        memoryContext +

        "Conversation actuelle :\n" +

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

        "https://tki-backend.onrender.com/api/chat",

        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify(
              requestBody
            )

        }

      );


    const data =
      await response.json();


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
      data.reply;


    conversation.messages.push({

      text:
        aiResponse,

      type:
        "ai-message"

    });


    addMessage(

      aiResponse,

      "ai-message",

      null,

      data.sources ||
        []

    );


    if (
      auth.currentUser
    ) {

      saveConversation(
        conversation
      );

    }

  } catch (error) {

    console.error(
      "Erreur TKI :",
      error
    );


    thinkingMessage.remove();


    const errorMessage =
      "Désolé, une erreur technique est survenue.";


    conversation.messages.push({

      text:
        errorMessage,

      type:
        "ai-message"

    });


    addMessage(

      errorMessage,

      "ai-message"

    );


    if (
      auth.currentUser
    ) {

      saveConversation(
        conversation
      );

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

      /(<li>.*<\/li>)(?:\n|$)/g,

      "$1"

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


    /*
      Nettoyer l'image.
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
        conversation.title;


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
        function(event) {

          event.stopPropagation();


          conversations =
            conversations.filter(
              function(item) {

                return (
                  item.id !==
                  conversation.id
                );

              }
            );


          if (
            currentConversationId ===
            conversation.id
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


          deleteConversationFromFirestore(
            conversation.id
          );

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

function openConversation(
  id
) {

  currentConversationId =
    id;


  saveCurrentConversationId();


  const conversation =
    getCurrentConversation();


  if (!conversation) {

    return;

  }


  messages.innerHTML =
    "";


  if (
    welcomeMessage
  ) {

    welcomeMessage.style.display =
      "none";

  }


  conversation.messages.forEach(
    function(message) {

      addMessage(

        message.text,

        message.type,

        message.image ||
          null

      );

    }
  );


  sidebar.classList.remove(
    "open"
  );

}


/* =========================
   RÉCUPÉRER DISCUSSION
========================= */

function getCurrentConversation() {

  return conversations.find(
    function(conversation) {

      return (
        conversation.id ===
        currentConversationId
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
