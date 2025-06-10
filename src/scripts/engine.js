const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    computerScoreBox: document.querySelector("#computer-score-points"),
    playerScoreBox: document.querySelector("#player-score-points"),
  },
  cardSprites: {
    avatar: document.querySelector("#card-image"),
    name: document.querySelector("#card-name"),
    type: document.querySelector("#card-type"),
  },
  fieldCards: {
    playerField: document.querySelector("#player-field-card"),
    computerField: document.querySelector("#computer-field-card"),
  },
  button: document.querySelector("#next-duel"),
};

const playerSides = {
  player: "player-cards",
  computer: "computer-cards",
};

const pathImages = "/src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `.${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(cardId, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.classList.add("container__card");
  cardImage.src = `../..${pathImages}card-back.png`;
  cardImage.alt = "Card Back";
  cardImage.setAttribute("data-card-id", cardId);

  if (fieldSide === playerSides.player) {
    cardImage.addEventListener("click", () =>
      setCardsField(cardImage.getAttribute("data-card-id"))
    );
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(cardImage.getAttribute("data-card-id"));
      cardImage.src = cardData[cardId].img;
      cardImage.alt = `Card: ${cardData[cardId].name}`;
    });
    cardImage.addEventListener("mouseout", () => {
      cardImage.src = `../..${pathImages}card-back.png`;
      cardImage.alt = "Card Back";
    });
  }

  return cardImage;
}

async function drawSelectCard(cardId) {
  state.cardSprites.avatar.src = cardData[cardId].img;
  state.cardSprites.avatar.alt = `Card: ${cardData[cardId].name}`;
  state.cardSprites.name.textContent = cardData[cardId].name;
  state.cardSprites.type.textContent = `Atribute: ${cardData[cardId].type}`;
}

async function setCardsField(cardId) {
  await removeAllCards();

  let computerCardId = await getRandomCardId();

  state.fieldCards.playerField.style.display = "block";
  state.fieldCards.computerField.style.display = "block";

  state.fieldCards.playerField.src = cardData[cardId].img;
  state.fieldCards.playerField.alt = `Card: ${cardData[cardId].name}`;
  state.fieldCards.computerField.src = cardData[computerCardId].img;
  state.fieldCards.computerField.alt = `Card: ${cardData[computerCardId].name}`;

  let duelResult = await checkDuelResult(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResult);
}

async function removeAllCards() {
  const playerCards = document.querySelector(`#${playerSides.player}`);
  const computerCards = document.querySelector(`#${playerSides.computer}`);

  playerCards.innerHTML = "";
  computerCards.innerHTML = "";
}

async function checkDuelResult(playerCardId, computerCardId) {
  let result = "Empate";

  const playerCard = cardData[playerCardId];
  const computerCard = cardData[computerCardId];

  if (playerCard.WinOf.includes(computerCardId)) {
    state.score.playerScore++;
    result = "Ganhou"; // Player wins
    await playAudio("win");
  } else if (playerCard.LoseOf.includes(computerCardId)) {
    state.score.computerScore++;
    result = "Perdeu"; // Computer wins
    await playAudio("lose");
  }

  return result;
}

async function updateScore() {
  state.score.playerScoreBox.textContent = `Win : ${state.score.playerScore}`;

  state.score.computerScoreBox.textContent = `Lose: ${state.score.computerScore}`;
}

async function drawButton(result) {
  state.button.innerText = result;
  state.button.style.display = "block";
}

async function drawCards(cardNumber, fieldSide) {
  for (let i = 0; i < cardNumber; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.querySelector(`#${fieldSide}`).appendChild(cardImage);
  }

  console.log(cardNumber);
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.volume = 0.2;
    audio.play();
}

function init() {
  drawCards(5, playerSides.player);
  drawCards(5, playerSides.computer);
}

init();

state.button.addEventListener("click", () => {
  state.button.style.display = "none";
  state.cardSprites.avatar.src = "";
  state.cardSprites.avatar.alt = "";
  state.cardSprites.name.textContent = "Selecione";
  state.cardSprites.type.textContent = "uma carta";
  state.fieldCards.playerField.style.display = "none";
  state.fieldCards.computerField.style.display = "none";
  init();
});
