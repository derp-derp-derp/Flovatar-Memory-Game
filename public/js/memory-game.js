// Original memory game code thanks to Nate Wiley https://codepen.io/natewiley
// best in full screen, works on phones/tablets (min height for game is 500px)
// License -- MIT
// Updated 2023 by derp3x of https://flov.dev

(function(){
	
	let Memory = {

		init: function(cards){
			this.$game = $(".game");
			this.$modal = $(".modal");
			this.$overlay = $(".modal-overlay");
			this.$restartButton = $("button.restart");
			this.shuffleCards(getNewCards());
			this.setup();
		},

		shuffleCards: function(cardsArray){
			this.$cards = $(this.shuffle(getNewCards()));
		},

		setup: function(){
			this.html = this.buildHTML();
			this.$game.html(this.html);
			this.$memoryCards = $(".card");
			this.paused = false;
            this.guess = null;
			this.binding();
		},

		binding: function(){
			this.$memoryCards.on("click", this.cardClicked);
			this.$restartButton.on("click", $.proxy(this.reset, this));
		},
		
		cardClicked: function(){
			let _ = Memory;
			let $card = $(this);
			if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
				$card.find(".inside").addClass("picked");
				if(!_.guess){
					_.guess = $(this).attr("data-id");
				} else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
					$(".picked").addClass("matched");
					_.guess = null;
				} else {
					_.guess = null;
					_.paused = true;
					setTimeout(function(){
						$(".picked").removeClass("picked");
						Memory.paused = false;
					}, 600);
				}
				if($(".matched").length == $(".card").length){
					_.win();
				}
			}
		},

		win: function(){
			this.paused = true;
			setTimeout(function(){
				Memory.showModal();
				Memory.$game.fadeOut();
			}, 1000);
		},

		showModal: function(){
			this.$overlay.show();
			this.$modal.fadeIn("slow");
		},

		hideModal: function(){
			this.$overlay.hide();
			this.$modal.hide();
		},

		reset: function(){
			this.hideModal();
			this.shuffleCards(getNewCards());
			this.setup();
			this.$game.show("slow");
		},

		// Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
		shuffle: function(array){
			let counter = array.length, temp, index;
	   	    // While there are elements in the array
	   	    while (counter > 0) {
            	// Pick a random index
            	index = Math.floor(Math.random() * counter);
            	// Decrease counter by 1
            	counter--;
            	// And swap the last element with it
            	temp = array[counter];
            	array[counter] = array[index];
            	array[index] = temp;
	        }
	        
	    	return array;
		},

		buildHTML: function(){
			let frag = '';
			this.$cards.each(function(k, v){
				frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
				<div class="front"><img src="'+ v.img +'"\
				alt="'+ v.name +'" /></div>\
				<div class="back"><img src="img/flovatar-logo.svg"\
				alt="Flovatar" /></div></div>\
				</div>';
			});
			return frag;
		}
	};

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function getNewCards(){
	    let cards = [];
	    
	    for (let i = 1; i <= 12; i++) {
        	let randomFlovie = getRandomInt(6000);
        	cards.push({ name: randomFlovie, img: "https://images.flovatar.com/flovatar/png/" + randomFlovie + "-nobg.png", id: i });
        }
        
        return $.merge(cards, cards);
    }
    
	Memory.init(getNewCards());


})();