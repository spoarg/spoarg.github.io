		let deck = [];
		let playedDeck = [];
		let deckCount = 6;
		let playersCount = 6;
		const suits = ['P', 'C', 'D', 'T'];
		const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

		let playerCardsResults = [];
		let dealerCardsResults = 0;
		let HiLoResult = 0;

		generateDeck();
		shuffleDeck(deck);
		function generateDeck(){
			for (var i = 0; i < deckCount; i++) {
				for (const suit of suits) {
					for (const rank of ranks) {
						let value = ranks.indexOf(rank) < 5 ? 1 : (ranks.indexOf(rank) < 8 ? 0 : -1)
						deck.push({ number: rank, color: suit, HiLoNum: value });
					}
				}
			}
		}

		function generatePlayers(){
			const players = document.getElementById('players');
			players.innerHTML = ''

			for (let j = 0; j < playersCount; j++) {
				players.innerHTML = players.innerHTML+`
				<div class="player">
					<p>Jugador ${j + 1}</p>
					<div id="player-cards-${j + 1}">
					</div>
					<p id="cards-counter-${j + 1}"></p>
				</div>
				`;
			}
		}

		// Función para mezclar el mazo
		function shuffleDeck(deck) {
			for (let i = deck.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[deck[i], deck[j]] = [deck[j], deck[i]];
			}
		}

		// Función para repartir cartas a los jugadores
		function dealCards() {
			generatePlayers()
			let dealer = document.getElementById('dealer');
			dealer.innerHTML = '';

			let playerCardsCounter = []

			let playerHands = [];
			for (let i = 0; i < playersCount; i++) {
				playerHands.push([]);
			}

			for (let j = 0; j < playersCount; j++) {
				for (let i = 0; i < 2; i++) {
					if(deck.length > 0){
						let card = deck.pop();
						playedDeck.push(card);
						playerHands[j].push(card.HiLoNum);
						HiLoResult = HiLoResult + parseInt(card.HiLoNum);
						updateHiLoCounter()
						let playerCards = document.getElementById(`player-cards-${j + 1}`);
						let playerCard = document.createElement('div');
						playerCard.classList.add('card');
						if(card.color == 'C' || card.color == 'D'){
							playerCard.classList.add('card-red');
						}
						playerCard.innerHTML = `
							<p>${card.number}</p>
							<p>${getSuitSymbol(card.color)}</p>
						`;
						playerCards.appendChild(playerCard);
						let realnum = card.number;
						if(card.number == 'A'){
							realnum = 11;
						}else if(card.number == 'J' || card.number == 'Q' || card.number == 'K'){
							realnum = 10;
						}
						if(playerCardsCounter[j]){
							playerCardsCounter[j] = playerCardsCounter[j] + parseInt(realnum);
						}else{
							playerCardsCounter.push(parseInt(realnum));
						}
						playerCardsResults = playerCardsCounter
					}else{
						console.log("Aviso de que se termino el juego")
						return 0
					}
				}
			}
			updateDeckCounter()
			playerCardsCounter = [];

			let dealerCardsCounter = 0;
			dealer.innerHTML = `
				<div class="player-dealer">
					<p>Dealer</p>
						<div id="dealer-cards">
						</div>
					<p id="dealer-cards-counter"></p>
				</div>
			`;
			for (let i = 0; dealerCardsCounter < 17; i++){
				if(deck.length > 0){
					let card = deck.pop();
					playedDeck.push(card);
					HiLoResult = HiLoResult + parseInt(card.HiLoNum);
					updateHiLoCounter()
					let dealerCards = document.getElementById(`dealer-cards`);
					let dealerCard = document.createElement('div');
					dealerCard.classList.add('card');
					if(card.color == 'C' || card.color == 'D'){
						dealerCard.classList.add('card-red');
					}
					dealerCard.innerHTML = `
						<p>${card.number}</p>
						<p>${getSuitSymbol(card.color)}</p>
					`;
					dealerCards.appendChild(dealerCard);
					let realNum = card.number;
					if(card.number == 'A'){
						realNum = 11;
					}else if(card.number == 'J' || card.number == 'Q' || card.number == 'K'){
						realNum = 10;
					}
					dealerCardsCounter = parseInt(dealerCardsCounter) + parseInt(realNum);
					dealerCardsResults = dealerCardsCounter;
					updateDeckCounter()
				}else{
					console.log("Aviso de que se termino el juego")
					return 0
				}
			}
			dealerCardsCounter = 0;
		}

		function deal() {
			let velocityInputContainer = document.getElementById(`velocityInputContainer`);
			velocityInputContainer.innerHTML = ``
			dealCards(6);
			updateViewDeck()
		}

		function gameDeal() {
			startVelocityCounter()
			dealCards(6);
			updateViewDeck()
		}

		function startGame() {
			restart()
			shuffleDeck(deck);

			let velocityInputContainer = document.getElementById(`velocityInputContainer`);
			velocityInputContainer.innerHTML = `
			    <form onsubmit="checkHiLo(event)" class="velocityInputContainer">
			    	<p id="velocityTimer" class="velocityTimer">20:20</p>
			    	<input type="text" id="velocityInput" placeholder="Escriba el Hi Lo y pulse enter">
			    </form>
			`
			gameDeal()
		}

		function viewDeck(){
			const decks = document.getElementById('decks');
			const ViewCardsButton = document.getElementById('ViewCardsButton');

			let deckHied = false;
			for (var i = 0; i < decks.classList.length; i++) {
				if (decks.classList[i] == "hide") {
					deckHied = true;
				}
			}

			if(!deckHied){
				decks.classList.add('hide');
				ViewCardsButton.textContent = "Ver masos";
			}else{
				decks.classList.remove("hide");
				ViewCardsButton.textContent = "Esconder masos";
				updateViewDeck()
			}
		}

		function updateViewDeck(){
			const decks = document.getElementById('decks');

			let numbs = [2,3,4,5,6,7,8,9,10,"J","Q","K","A"]

			const mainDeckDiv = document.getElementById('main-deck');
			const mainDeckCount = document.getElementById('main-deck-count');
			mainDeckCount.textContent = deck.length;
			for (var i = 0; i < numbs.length; i++) {
				let t = 0;
				for (var j = deck.length - 1; j >= 0; j--) {
					if(deck[j].number == numbs[i]){
						t++
					}
				}
				let currentMainDeckNumber = document.getElementById(`main-deck-number-${i}`);
				currentMainDeckNumber.textContent = t;
			}

			const playedDeckDiv = document.getElementById('played-deck');
			const playedDeckCount = document.getElementById('played-deck-count');
			playedDeckCount.textContent = playedDeck.length;
			for (var i = 0; i < numbs.length; i++) {
				let t = 0;
				for (var j = playedDeck.length - 1; j >= 0; j--) {
					if(playedDeck[j].number == numbs[i]){
						t++
					}
				}
				let currentPlayedDeckNumber = document.getElementById(`played-deck-number-${i}`);
				currentPlayedDeckNumber.textContent = t;
			}
		}

		// Función para obtener el símbolo de la carta
		function getSuitSymbol(suit) {
			switch (suit) {
				case 'P': return '♠';
				case 'C': return '♥';
				case 'D': return '♦';
				case 'T': return '♣';
				default: return '';
			}
		}

		let deckCounterShowed = false;
		function deckCounter(){
			if (deckCounterShowed){
				deckCounterShowed = false;
			}else{
				deckCounterShowed = true;
			}
			updateDeckCounter()
		}

		function updateDeckCounter(){
			if (deckCounterShowed){
				for (var i = 0; i < playerCardsResults.length; i++) {
					let CurrentPlayercardsCounter = document.getElementById(`cards-counter-${i + 1}`);
					CurrentPlayercardsCounter.textContent = playerCardsResults[i];
				}
				
				let dealerCardsCounter = document.getElementById(`dealer-cards-counter`);
				if(dealerCardsCounter){
					dealerCardsCounter.textContent = dealerCardsResults;
				}
			}else{
				for (var i = 0; i < playerCardsResults.length; i++) {
					let CurrentPlayercardsCounter = document.getElementById(`cards-counter-${i + 1}`);
					CurrentPlayercardsCounter.textContent = '';
				}
				
				let dealerCardsCounter = document.getElementById(`dealer-cards-counter`);
				if(dealerCardsCounter){
					dealerCardsCounter.textContent = '';
				}
			}
		}

		let hiLoCounterShowed = false;
		function hiLoCounter(){
			if (hiLoCounterShowed){
				hiLoCounterShowed = false;
			}else{
				hiLoCounterShowed = true;
			}
			updateHiLoCounter()
		}

		function updateHiLoCounter(){
			let HTMLHiLoCounter = document.getElementById(`hiLoCounter`);

			if (hiLoCounterShowed){
				HTMLHiLoCounter.textContent = "Contador HiLo: " + HiLoResult;
			}else{
				HTMLHiLoCounter.textContent = '';
			}
		}

		let milisecondsVelocityCounter = 0;
		let secondsVelocityCounter = 0;
		let onlyMilisecondsVelocityCounter = 0;

		let intervalId;
		let stoped = true;
		function startVelocityCounter(){
			stoped = false;
			let velocityCounter = document.getElementById('velocityTimer');
			clearInterval(intervalId);
			intervalId =setInterval(() => {
				if(!stoped){
					milisecondsVelocityCounter++;
					secondsVelocityCounter = Math.trunc(milisecondsVelocityCounter/100);
					onlyMilisecondsVelocityCounter = milisecondsVelocityCounter - (secondsVelocityCounter*100);
					velocityCounter.textContent = `${secondsVelocityCounter}:${onlyMilisecondsVelocityCounter}`
				}else{
					clearInterval(intervalId);
					return 0
				}
			}, 10);
			return
		}

		function stopVelocityCounter(){
			stoped = true;
			milisecondsVelocityCounter = 0;
		}

		function checkHiLo(e){
			e.preventDefault()
			stopVelocityCounter()
			let gameResut = document.getElementById('gameResut');
			if(e.target.velocityInput.value == HiLoResult){
				gameResut.innerHTML = `<p class="cardGameResut cardGameResut-good">Bien, tardaste ${secondsVelocityCounter}:${onlyMilisecondsVelocityCounter}s</p>`
			}else{
				gameResut.innerHTML = `<p class="cardGameResut cardGameResut-bad">Mal, tardaste ${secondsVelocityCounter}:${onlyMilisecondsVelocityCounter}s. La respuesta era: ${HiLoResult}</p>`
			}
			e.target.velocityInput.value = '';
			gameDeal()
		}

		function changeDeck(e){
			console.log(e.target.value)
			deckCount = e.target.value
			restart();
		}

		function changePlayers(e){
			playersCount = e.target.value
			restart();
		}

		function restart(){
			generateDeck();
			let velocityInputContainer = document.getElementById(`velocityInputContainer`);
			velocityInputContainer.innerHTML = ``
			deck = [];
			playedDeck = [];
			HiLoResult = 0;
			updateHiLoCounter()
			generateDeck();
			shuffleDeck(deck);
			stopVelocityCounter()
			updateViewDeck()

			let dealer = document.getElementById('dealer');
			dealer.innerHTML = '';
			const players = document.getElementById('players');
			players.innerHTML = '';
		}