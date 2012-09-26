var z = 0, max = 15;

function GameList(){
    this.head = null;
}

function getSurroundingCells(allCells, rows, columns, z){
	
	if(!allCells) { return; }
	
	var validSurroundingCells = [{}], 
		count = 1;
	
	allCells.forEach(function(o){
		
		console.log('cells : ',o.row+', '+o.col);
		
			var cRow		=	o.row, 
				cCol		=	o.col,
				cells		=	new GameList(),
				dataHash,
				surroundingCells;
			
		surroundingCells = [
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+cRow+'c'+(cCol+1),			row: cRow,		col: cCol+1 },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+(cRow+1)+'c'+(cCol+1),		row: cRow+1,	col: cCol+1 },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+(cRow+1)+'c'+cCol,			row: cRow+1,	col: cCol },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+(cRow+1)+'c'+(cCol-1),		row: cRow+1,	col: cCol-1 },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+cRow+'c'+(cCol-1),			row: cRow,		col: cCol-1 },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+(cRow-1)+'c'+(cCol-1),		row: cRow-1,	col: cCol-1 },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+(cRow-1)+'c'+cCol,			row: cRow-1,	col: cCol },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+(cRow-1)+'c'+(cCol+1),		row: cRow-1,	col: cCol+1 }
		];
	
		surroundingCells.forEach(function(e){
			
			var cell;
			
			if(e.row > rows) { console.log('row is outside of container'); }
			else if(e.col > columns) { console.log('column is outside of container'); }
			else if(e.row <= 0) { console.log('row is less then or equal to 0'); }
			else if(e.col <= 0) { console.log('column is less then or equal to 0'); }
			else {		
				cell = { id: e.id, cell: { row: e.row, col: e.col, state: $('#'+z+' tr.'+e.row+' td.'+e.col).attr('class').split(" ")[1] } };
				cells.insert(cell);
			}
		});
		
		dataHash = cells.createDataHash();
		validSurroundingCells[count] = { id: dataHash.id, row: dataHash.id.split('cr')[1].split('cc')[0], col: dataHash.id.split('cr')[1].split('cc')[1], surroundingCells: dataHash.surroundingCells, state: $('#'+z+' tr.'+cRow+' td.'+cCol).attr('class').split(" ")[1] };
		console.log('validSurroundingCells['+count+'] : ',validSurroundingCells[count]);
		count++;
		
	});
	
	return validSurroundingCells;
	
}

function getAllGridPositionsOnBoard(rowSize,colSize){
	if(rowSize === 0 || colSize === 0) { return; }
	
	var allCells = [],
		cellAmount = (rowSize*colSize),
		i, r, c;
	
	for(r=1; r<=rowSize; r++){
		for(c=1; c<=colSize; c++){
			allCells.push({ row: r, col: c });
			console.log('row : '+r+', col : '+c);
		}
	}
	return allCells;
}

function buildBoard(id, rows, columns, z){
	if(rows === 0 || columns === 0) { return; }
	
	var table, r, c;
		
	table = "<table id='"+z+"' style='position: absolute; z-index:"+(max-=1)+"; visibility: hidden;'>";
		table += "<tbody>";
			for(r=1; r<=rows; r++){
				table += "<tr class='"+r+"'>";
					for(c=1; c<=columns; c++){
						table += "<td class='"+c+" dead'><img src='images/dead-cell.png'/></td>";
					}
				table += "</tr>";
			}
		table += "</tbody>";
	table += "</table>";
	
	$(id).append(table);
	
	if(z-1 !== 0){
		$('#'+z).show((z*z)*1000, function(){
			$(this).css('visibility','visible').fadeIn("fast");
		});
		$('#'+(z-1)).hide((z*z)*500, function(){
			$(this).css('display','hidden').fadeOut("fast");
		});
		
	}
	// if(z > 1){
	// 	
	// 	$('#'+(z-1)).fadeOut((z-1)*3000);
	// 	$('#'+z).fadeIn(z*1000);
	// }else{ $(id).append(table); }

}

function createGame(id, opts, z){
	
	z += 1;
	
	console.log('create game : ',opts);
	
    var width					= opts.board.rowAndColSize.width, 
        height					= opts.board.rowAndColSize.height,
        rows					= opts.board.rowAndCol.rows,
        columns					= opts.board.rowAndCol.cols,
		allGridCells			= getAllGridPositionsOnBoard(rows,columns),
        livingCells				= opts.board.livingCells,
		cellImg					= "<img src='images/cell-icon.png'/>",
		game					= new GameList(),
		validSurroundingCells	= [],
		surroundingCells, i,
		board = {
			"id": id,
			"rowAndCol": {"rows": rows, "cols": columns },
			"rowAndColSize": {"width": width, "height": height}
		}, currentBorderColumn, currentBorderRow;

	buildBoard(id, rows, columns, z);

	// for(currentBorderRow=1;currentBorderRow<=rows;currentBorderRow++){
	// 	if(currentBorderRow===1){
	// 		$("#"+z+" tr."+currentBorderRow).css('height',height).css('border-top','1px solid #000').css('border-bottom','1px solid #000');
	// 	}else{
	// 		$("#"+z+" tr."+currentBorderRow).css('height',height).css('border-bottom','1px solid #000');
	// 	}
	// 	$("#"+z+" tr").css('box-sizing','border-box').css('height',height).css('border-top','1px solid #000').css('border-bottom','1px solid #000');
	// 	for(currentBorderColumn=1;currentBorderColumn<=columns;currentBorderColumn++){
	// 		if(currentBorderColumn===1){
	// 			$("#"+z+" tr."+currentBorderRow+" td."+currentBorderColumn).css('width',width).css('box-sizing','border-box').css('border-left','1px solid #000').css('border-right','1px solid #000');	
	// 		}else{
	// 			$("#"+z+" tr."+currentBorderRow+" td."+currentBorderColumn).css('width',width).css('box-sizing','border-box').css('border-right','1px solid #000');	
	// 		}
	// 	}
	// }
	
	$(id).css('margin','100px auto 0').css('width',(columns*parseInt(width.split("px")[0],10))+"px");
	$("table tr").css('height',height).css('border-top','1px solid #000');
	$("table tr td").css('width',width).css('border-right','1px solid #000');
	$("table").css('border-bottom','1px solid #000').css('border-left','1px solid #000');
	
	livingCells.forEach(function(o){
		var cRow	=	o.row, 
			cCol	=	o.col;
			
		$('#'+z+' tr.'+cRow+ ' td.'+cCol).removeClass('dead')
								.addClass('alive')
								.empty()
								.append(cellImg);
	});
	
	surroundingCells = getSurroundingCells(allGridCells, rows, columns, z);

	for(i=surroundingCells.length-1; i>=1; i--){
		if(surroundingCells[i] === undefined) { return alert('undefined'); }
		validSurroundingCells.push(surroundingCells[i]);
	}
	
	console.log('valid surrounding cells : ',validSurroundingCells);
	
	game.insert(validSurroundingCells);
	
	if(z===15){ return; }
	
	game.nextGameDataHash(board, z);
}

GameList.prototype = {
    
    /**
     * inserts an element at the tail of the linked list
     * @param {Object} val
     */
	
    insert:function(val){
		//alert(val.id);
		
        var item = {
            value:val,
            next:null
        };

        if (this.head === null){
            this.head = item;
            return;
        }else{
            current = this.head;
            while(current.next !== null){
                current = current.next;            
            }// end of while
            current.next = item;        
        }           
    },

    /**
     * shows all elements of the linked list
     */

    showAllElements:function(){
        if (this.head === null) { return; }
        var current = this.head, i = 1;
        while(current.next !== null){
            console.log('The element at position ' + i + ' has value ' + current.value);
            current = current.next;
            i++;
        }
        // printing the last element
        console.log('The element at position ' + i + ' has value ' + current.value);
     },

    /**
     * create data hash of all valid surrounding cells of a cell
     */
	createDataHash:function(){
        if (this.head === null) { return; }
        var current = this.head, i = 1, surroundingCells = [{}];

		surroundingCells.id = current.value.id.split("-")[0];
		surroundingCells.row = current.value.id.split("-")[0].split('cr')[1].split('cc')[0];
		surroundingCells.col = current.value.id.split("-")[0].split('cr')[1].split('cc')[1];
		surroundingCells.surroundingCells = [];
		
        while(current.next !== null){
			surroundingCells.surroundingCells.push(current.value.cell);
            current = current.next;
            i++;
        }
        // printing the last element
		surroundingCells.surroundingCells.push(current.value.cell);
		console.log('created hash = { id: '+surroundingCells.id+', row: '+surroundingCells.row+', col: '+surroundingCells.col+', surroundingCells: '+surroundingCells.surroundingCells+'}');
		return surroundingCells;
	},

    /**
     * create data hash for next game and determine if cell lives or dies
     */	
	nextGameDataHash:function(board, z){
        if (this.head === null) { return; }
        var current = this.head, 
			i, 
			lengthOfCells = current.value.length,
			nextGameCells = [],
			boardId = board.id,
			opts = {
				"board": {
					"rowAndCol": { "rows": board.rowAndCol.rows, "cols": board.rowAndCol.cols },
					"rowAndColSize": { "width": board.rowAndColSize.width, "height": board.rowAndColSize.height },
					"livingCells": [{}]
				}
			};
			
			console.log('rowAndCol : ',opts.board.rowAndCol.rows);
			
		console.log('NEXT GAME DATA HASH!');
		console.log('current : ',current);

		for(i=0; i<lengthOfCells; i++){
			var cell = current.value[i],
				row = cell.row,
				col = cell.col,
				state = cell.state,
				id = cell.id,
				surroundingCellsLength = cell.surroundingCells.length,
				sc,
				alive = 0,
				dead = 0,
				nextState;
				
			console.log('cell'+[i]+' : ',cell);
			console.log('CURRENT STATE : ',state);
			for(sc=0;sc<surroundingCellsLength;sc++){
				var surroundingCell = cell.surroundingCells[sc],
					surroundingCellState = surroundingCell.state;
					
				if(surroundingCellState === "alive") { alive +=1; }
				else if(surroundingCellState === "dead") { dead +=1; }
			}
			
			console.log('alive cells : ',alive);
			console.log('dead cells : ',dead);
			
			if(state === "alive"){
				if(alive <= 1){
					//becomes dead due to under-population
					nextState = "dead";
				}
				else if(alive === 2 || alive === 3){
					//stays alive
					nextState = "alive";
				}
				else if(alive >= 4){
					//becomes dead due to overcrowding
					nextState = "dead";
				}
			}
			else if(state === "dead"){
				if(alive === 3){
					//becomes alive due to reproduction
					nextState = "alive";
				}else{
					//stays dead
					nextState = "dead";
				}
			}
			
			if(nextState === "alive") { opts.board.livingCells[i] = { "row": row, "col": col }; }
					
			nextState = null;
			alive = 0;
			dead = 0;
		}
		
		console.log('opts : ',opts);
		
		console.log('z : ',z);
		createGame(boardId, opts, z);
	}
};

(function($){
    $.fn.conwaysGameOfLife = function(options){
        var id = $(this), opts;

        $.fn.conwaysGameOfLife.defaults = {
            board: { 
               rowAndCol: {rows: 10, cols: 10},
               rowAndColSize: {width: '50px', height: '50px'},
               livingCells: [	{row: 1, col: 1}, 
								{row: 1, col: 2},
								{row: 1, col: 10},
								{row: 1, col: 5},
								{row: 2, col: 1},
								{row: 2, col: 8},
								{row: 3, col: 3},
								{row: 2, col: 6},
								{row: 2, col: 7},
								{row: 2, col: 9},
								{row: 4, col: 8},
								{row: 4, col: 4},
								{row: 5, col: 5},
								{row: 5, col: 4},
								{row: 6, col: 9},
								{row: 6, col: 8},
								{row: 6, col: 10},
								{row: 7, col: 8},
								{row: 7, col: 5},
								{row: 7, col: 1},
								{row: 8, col: 3},
								{row: 8, col: 10},
								{row: 8, col: 7},
								{row: 9, col: 5},
								{row: 9, col: 1},
								{row: 9, col: 10},
								{row: 10, col: 1},
								{row: 10, col: 3},
								{row: 10, col: 7},
								{row: 10, col: 8},
								{row: 10, col: 10},
								{row: 2, col: 1}]
            }            
        };

        opts = $.extend({}, $.fn.conwaysGameOfLife.defaults, options);

        createGame(id, opts, z);
    
        return this;    
    };

}(jQuery));


