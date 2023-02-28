function getCookie(name){
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)')); 
    return match ? match[1] : null;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function playGame(){
    // Original memory game code thanks to Nate Wiley https://codepen.io/natewiley
    // best in full screen, works on phones/tablets (min height for game is 500px)
    // License -- MIT
    // Updated 2023 by derp3x of https://flov.dev
    
    let Memory = {
    
        init: function(cards){
        	this.$game = $("#game");
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
    
    function getNewCards(){
        let cards = JSON.parse(getCookie('flovatar_game_cards'));
        return $.merge(cards, cards);
    }
    
    Memory.init(getNewCards());
}

document.addEventListener('DOMContentLoaded', function (){

    window.fcl.config()
        //.put("accessNode.api", "https://rest-testnet.onflow.org")
        //.put("discovery.wallet","https://fcl-discovery.onflow.org/testnet/authn")
        .put("accessNode.api", "https://rest-mainnet.onflow.org")
        .put("discovery.wallet","https://fcl-discovery.onflow.org/mainnet/authn")
    
    window.fcl.currentUser().subscribe(user => userHandler({...user}))
    
    let userHandler = function(user){
        if(user.loggedIn){
        	$('#signed_in_content_container').show();
        	$('#sign_in_button').hide();
        	
        	if(!getCookie('flovatar_user_wallet')){
            	
            	// get Flovatar data from onchain
        	
                let cadence = `
                    import Flovatar from 0x921ea449dffec68a
                    
                    pub fun main(address: Address): [Flovatar.FlovatarData] {
                        return Flovatar.getFlovatars(address: address)
                    }
                `;
                
                let flovatar_game_cards = [];
                
                (async () => {
                    const response = await window.fcl.send([
                        window.fcl.script(cadence),
                        window.fcl.args([
                            window.fcl.arg(user.addr, window.fcl.t.Address)
                        ])
                    ]);
                    
                    let flovatars = await window.fcl.decode(response);
                    
                    $(flovatars).each(function(idx) {
                        flovatar_game_cards.push({ name: flovatars[idx].id, img: "https://images.flovatar.com/flovatar/png/" + flovatars[idx].id + "-nobg.png", id: idx });
                    });
                    
                    if(flovatar_game_cards.length < 12){
                        // user doesn't have enough Flovatars to fill the game board so we'll add random ones
                        while(flovatar_game_cards.length <= 12) {
                        	let randomFlovie = getRandomInt(6155);
                        	flovatar_game_cards.push({ name: randomFlovie, img: "https://images.flovatar.com/flovatar/png/" + randomFlovie + "-nobg.png", id: flovatar_game_cards.length });
                        }
                    }
                    
                    if(flovatar_game_cards.length > 12){
                        // user has too many Flovatars, so we'll pick 12 random ones from their collection
                        const shuffled_flovatar_game_cards = flovatar_game_cards.sort(() => 0.5 - Math.random());
                        flovatar_game_cards = shuffled_flovatar_game_cards.slice(0, 12);
                    }
                    
                    document.cookie = "flovatar_user_wallet="+user.addr;
                    document.cookie = "flovatar_game_cards="+JSON.stringify(flovatar_game_cards);
                    
                    playGame();
                })();
            }else{
                
                // we have everything we need, let's play the game!
                playGame();
                
            } // end cookie check
        	
        }else{
            $('#signed_in_content_container').hide();
            $('#game').hide();
        	$('#sign_in_button').show();
        	document.cookie = 'flovatar_user_wallet=; Max-Age=-99999999;';
        	document.cookie = 'flovatar_game_cards=; Max-Age=-99999999;';
        }
    }

}, false);