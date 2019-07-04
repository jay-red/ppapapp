( function() {
	var gameCanvas = document.getElementById( 'gameCanvas' ),
		gameCtx = gameCanvas.getContext( '2d' ),
		ppap = document.getElementById( 'ppap' ),
		goingLeft = false,
		goingRight = false,
		start = false,
		playing = false,
		restart = false,
		fruitSize = 64,
		penHoriz = 160,
		ticks = 0,
		score = 0,
		spawned = 1;
		height = 650,
		width = 320,
		appleWidth = 57,
		appleHeight = 63,
		pineWidth = 68,
		pineHeight = 88,
		penWidth = 40,
		penHeight = 83,
		val = 40,
		speed = 4,
		penSpeed = 6,
		topCut = 50,
		fruits = [];
	
	var appleSprite = new Image(),
		pineSprite = new Image(),
		penSprite = new Image();
	
	if( !localStorage.getItem( 'highScore' ) ) {
		localStorage.setItem( 'highScore', "0" );
	}
	
	if( !window.navigator.standalone && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ) {
		alert( "Add to homescreen for better gameplay" );
	}
	
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) ) {
		if( screen.height < height * ( screen.width / width ) ) {
			topCut += Math.ceil( Math.abs( ( ( height * ( screen.width / width ) ) - ( screen.height ) ) / ( screen.width / width ) ) );
			gameCanvas.setAttribute( 'style', 'top:-' + ( topCut - 50 ).toString() + 'px' );
		}
	}
	
	function fruit( x, apple ) {
		f = {};
		f.x = x;
		f.y = 0;
		f.apple = apple;
		return f;
	}
	
	document.addEventListener( 'keydown', function( e ) {
		var key = e.keyCode;
		if( key == 37 ) {
			goingLeft = true;
			goingRight = false;
		} else if( key == 39 ) {
			goingRight = true;
			goingLeft = false;
		}
	} );
	
	gameCanvas.addEventListener( "touchstart", function( e ) {
		var touch = e.touches[ 0 ],
			x;
		if( touch ) {
			if( start ) {
				x = touch.clientX;
				if( x < width / 2 ) {
					goingLeft = true;
					goingRight = false;
				} else {
					goingRight = true;
					goingLeft = false;
				}
				if( restart ) {
					document.location.reload();
				}
			} else {
				start = true;
				playing = true;
				score = 0;
				ppap.play();
			}
		}
	} );
	
	gameCanvas.addEventListener( "mousedown", function( e ) {
		if( restart ) {
			document.location.reload();
		}
		if( !start ) {
			start = true;
			playing = true;
			score = 0;
			ppap.play();
		}
	} );
	
	function renderGame() {
		gameCtx.clearRect( 0, 0, gameCanvas.width, gameCanvas.height );
		for( var i = 0; i < fruits.length; i++ ) {
			if( fruits[ i ].apple ) {
				gameCtx.drawImage( appleSprite, fruits[ i ].x, fruits[ i ].y );
			} else {
				gameCtx.drawImage( pineSprite, fruits[ i ].x, fruits[ i ].y );
			}
		}

		gameCtx.drawImage( penSprite, penHoriz - ( penWidth / 2 ), height - penHeight );
		
		gameCtx.font = '50px BitFont';
		gameCtx.textAlign = 'center';
		gameCtx.fillStyle = 'white';
		gameCtx.fillText( score.toString(), 160, topCut + 60 );
		gameCtx.lineWidth = 3;
		gameCtx.strokeStyle = 'black';
		gameCtx.strokeText( score.toString(), 160, topCut + 60 );
	}
	
	function tick() {
		if( playing ) {
			ticks = ( ticks + 1 ) % val;
			apple = spawned % 2 == 0;
			fruitWidth = pineWidth;
			fruitHeight = pineHeight;
			if( fruits[ 0 ] ) {
				fruitWidth = fruits[ 0 ].apple ? appleWidth : pineWidth;
				fruitHeight = fruits[ 0 ].apple ? appleHeight : pineHeight;
			}
			if( ticks == val - 1 ) {
				fruits.push( fruit( Math.floor( Math.random() * ( 320 - fruitWidth ) ), apple ) );
				spawned++;
			}
			if( fruits[ 0 ] &&
				fruits[ 0 ].x + fruitWidth > penHoriz &&
				fruits[ 0 ].x + fruitWidth < penHoriz + penWidth &&
				fruits[ 0 ].y + fruitHeight > height - penHeight ) {
				fruits.splice( 0, 1 );
				score++;
			}
			if( fruits[ 0 ] &&
				fruits[ 0 ].x < penHoriz + penWidth &&
				fruits[ 0 ].x > penHoriz &&
				fruits[ 0 ].y + fruitHeight > height - penHeight ) {
				fruits.splice( 0, 1 );
				score++;
			}
			if( penHoriz - ( penWidth / 2 ) < 0 || penHoriz + ( penWidth / 2 ) > width ) {
				gameOver();
				return;
			}
			if( fruits[ 0 ] && fruits[ 0 ].y + fruitHeight >= height ) {
				gameOver();
				return;
			}
			for( var i = 0; i < fruits.length; i++ ) {
				fruits[ i ].y += speed;
			}
			if( goingLeft ) {
				penHoriz -= penSpeed;
			} else if( goingRight ) {
				penHoriz += penSpeed;
			}
			renderGame();
			requestAnimFrame( function() {
				tick();
			} );
		} else if( !start ) {
			score = "Start";
			renderGame();
			requestAnimFrame( function() {
				tick();
			} );
		}
	}
	
	function gameOver() {
		playing = false;
		penSpeed = 0;
		speed = 0;
		if( score > parseInt( localStorage.getItem( 'highScore' ) ) ) {
			localStorage.setItem( 'highScore', score.toString() );
		}
		
		topCut = ( height - topCut ) / 4 + topCut - 40;
		
		gameCtx.clearRect( 0, 0, gameCanvas.width, gameCanvas.height );
		gameCtx.font = '50px BitFont';
		gameCtx.textAlign = 'center';
		gameCtx.fillStyle = 'white';
		gameCtx.fillText( "Game Over", 160, topCut + 60 );
		gameCtx.lineWidth = 3;
		gameCtx.strokeStyle = 'black';
		gameCtx.strokeText( "Game Over", 160, topCut + 60 );

		gameCtx.font = '30px BitFont';
		gameCtx.textAlign = 'center';
		gameCtx.fillStyle = 'white';
		gameCtx.fillText( "Score", 160, topCut + 110 );
		gameCtx.lineWidth = 1;
		gameCtx.strokeStyle = 'black';
		gameCtx.strokeText( "Score", 160, topCut + 110 );
		
		gameCtx.font = '40px BitFont';
		gameCtx.textAlign = 'center';
		gameCtx.fillStyle = 'white';
		gameCtx.fillText( score.toString(), 160, topCut + 155 );
		gameCtx.lineWidth = 1;
		gameCtx.strokeStyle = 'black';
		gameCtx.strokeText( score.toString(), 160, topCut + 155 );
		
		gameCtx.font = '30px BitFont';
		gameCtx.textAlign = 'center';
		gameCtx.fillStyle = 'white';
		gameCtx.fillText( "High Score", 160, topCut + 200 );
		gameCtx.lineWidth = 1;
		gameCtx.strokeStyle = 'black';
		gameCtx.strokeText( "High Score", 160, topCut + 200 );
		
		gameCtx.font = '40px BitFont';
		gameCtx.textAlign = 'center';
		gameCtx.fillStyle = 'white';
		gameCtx.fillText( localStorage.getItem( 'highScore' ), 160, topCut + 245 );
		gameCtx.lineWidth = 1;
		gameCtx.strokeStyle = 'black';
		gameCtx.strokeText( localStorage.getItem( 'highScore' ), 160, topCut + 245 );
		
		gameCtx.font = '25px BitFont';
		gameCtx.textAlign = 'center';
		gameCtx.fillStyle = 'white';
		gameCtx.fillText( "Tap to restart", 160, topCut + 300 );
		gameCtx.lineWidth = 1;
		gameCtx.strokeStyle = 'black';
		gameCtx.strokeText( "Tap to restart", 160, topCut + 300 );
		
		setTimeout( function() {
			restart = true;
		}, 500 );
	}
	
	appleSprite.onload = function() {
		pineSprite.onload = function() {
			penSprite.onload = function() {
				window.requestAnimFrame = ( function( cb ) {
					return window.requestAnimationFrame || 
						window.webkitRequestAnimationFrame || 
						window.mozRequestAnimationFrame || 
						window.oRequestAnimationFrame || 
						window.msRequestAnimationFrame ||
						function( cb ) {
							windows.setTimeout( cb, 1000 / 60 );
						}
				} )();
				tick();
			}
			penSprite.src = "sprites/pen.png";
		}
		pineSprite.src = "sprites/pineapple.png";
	}
	appleSprite.src = "sprites/apple.png";
} )();