const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        type: document.getElementById("card-type"),
        name: document.getElementById("card-name"),
        sin: document.getElementById("card-sin"),
        element: document.getElementById("card-element"),
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },
    fieldCard: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-duel")    
    }
};

const pathImage = "./src/assets/img-sete/";
const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
};

const cardData = [
    {
        id: 0,
        name: "Meliodas",
        sin: "Wrath",
        type: "Demonic",
        element: "Fire",
        img: `${pathImage}meliodas-2.png`,
        WinOff: [1, 2],
        LoseOff: [5, 3],
    },
    {
        id: 1,
        name: "Diane",
        sin: "Envy",
        type: "Giant",
        element: "Earth",
        img: `${pathImage}diane.png`,
        WinOff: [4, 6],
        LoseOff: [3, 5],
    },
    {
        id: 2,
        name: "Ban",
        sin: "Greed",
        type: "Immortal",
        element: "Water",
        img: `${pathImage}ban.png`,
        WinOff: [5, 6],
        LoseOff: [0, 3],
    },
    {
        id: 3,
        name: "King",
        sin: "Sloth",
        type: "Fairy",
        element: "Wind",
        img: `${pathImage}king.png`,
        WinOff: [0, 6],
        LoseOff: [1, 5],
    },
    {
        id: 4,
        name: "Gowther",
        sin: "Lust",
        type: "Doll",
        element: "Psychic",
        img: `${pathImage}gowther-2.png`,
        WinOff: [6, 3],
        LoseOff: [2, 1],
    },
    {
        id: 5,
        name: "Merlin",
        sin: "Gluttony",
        type: "Mage",
        element: "Magic",
        img: `${pathImage}merlin.png`,
        WinOff: [0, 1],
        LoseOff: [2, 3],
    },
    {
        id: 6,
        name: "Escanor",
        sin: "Pride",
        type: "Human",
        element: "Sunlight",
        img: `${pathImage}escanor.png`,
        WinOff: [1, 5],
        LoseOff: [3, 4],
    },
];





async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/img-sete/the-seven-deadly-sins.jpeg");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCards(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardField(cardImage.getAttribute('data-id'));
        });
    }

    return cardImage;
};

async function setCardField(cardId) {
    await removeAllCardsimages();
    let computerCardId = await getRandomCardId();

    await showhiddenCardFieldsImagens(true);
    await hiddenCardDetails();

    await drawCardsInfiel(cardId,computerCardId)

    let duelResults = await chetsDuelResults(cardId, computerCardId);
    await updateScore();
    await drawButton(duelResults);
};
async function drawCardsInfiel(cardId,computerCardId){
    state.fieldCard.player.src = cardData[cardId].img;
    state.fieldCard.computer.src = cardData[computerCardId].img;
};


async function chetsDuelResults(playerCardId, computerCardId) {
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];
    if (playerCard.WinOff.includes(computerCardId)) {
        duelResults = "win"; 
        state.score.playerScore++;
    }
    if (playerCard.LoseOff.includes(computerCardId)) {
        duelResults = "lose";
        state.score.computerScore++;
    }
    await playAudio(duelResults);
    return duelResults;
};

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
};

async function updateScore() {
    state.score.scoreBox.innerText = `Win ${state.score.playerScore} | Lose ${state.score.computerScore}`;
};

async function removeAllCardsimages() {
    let { computerBox, player1Box } = state.playerSides;

    let playerImages = player1Box.querySelectorAll("img");
    playerImages.forEach(img => img.remove());

    let computerImages = computerBox.querySelectorAll("img");
    computerImages.forEach(img => img.remove());
};

async function drawSelectCards(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.sin.innerText = 'Sin: ' + cardData[index].sin;
    state.cardSprites.type.innerText = 'Attribute: ' + cardData[index].type;
    state.cardSprites.element.innerText = 'Element: ' + cardData[index].element;


    state.cardSprites.avatar.classList.remove('sin-wrath', 'sin-envy', 'sin-greed', 'sin-sloth', 'sin-lust', 'sin-gluttony', 'sin-pride');
    
    
    switch(cardData[index].sin.toLowerCase()) {
        case 'wrath':
            state.cardSprites.avatar.classList.add('sin-wrath');
            break;
        case 'envy':
            state.cardSprites.avatar.classList.add('sin-envy');
            break;
        case 'greed':
            state.cardSprites.avatar.classList.add('sin-greed');
            break;
        case 'sloth':
            state.cardSprites.avatar.classList.add('sin-sloth');
            break;
        case 'lust':
            state.cardSprites.avatar.classList.add('sin-lust');
            break;
        case 'gluttony':
            state.cardSprites.avatar.classList.add('sin-gluttony');
            break;
        case 'pride':
            state.cardSprites.avatar.classList.add('sin-pride');
            break;
    }
}



async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
};
async function showhiddenCardFieldsImagens(value){

    if (value == true) {

    state.fieldCard.player.style.display = "block";
    state.fieldCard.computer.style.display = "block";     
    }
    if (value== false){
        state.fieldCard.player.style.display = "none";
        state.fieldCard.computer.style.display = "none";  
    }


};
async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.sin.innerText = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.element.innerText = "";
    state.cardSprites.avatar.classList.remove('sin-wrath', 'sin-envy', 'sin-greed', 'sin-sloth', 'sin-lust', 'sin-gluttony', 'sin-pride');
}



async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCards = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCards, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
};

async function ResetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCard.player.style.display = "none";
    state.fieldCard.computer.style.display = "none";

    init();
};

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();


};


function init() {
    drawCards(5, playerSides.player1); 
    drawCards(5, playerSides.computer); 

    state.fieldCard.computer.style.display = "none";
    state.fieldCard.player.style.display = "none";

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();