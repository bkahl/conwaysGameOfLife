function GameList(){
    this.head = null;
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
        if (this.head === null) return;
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
        if (this.head === null) return;
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
	nextGameDataHash:function(board){
        if (this.head === null) return;
        var current = this.head, 
			i, 
			lengthOfCells = current.value.length,
			nextGameCells = [],
			id = board.id,
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
				nextGameCell = [{}],
				alive = 0,
				dead = 0,
				nextState;
				
			console.log('cell'+[i]+' : ',cell);
			console.log('CURRENT STATE : ',state);
			for(sc=0;sc<surroundingCellsLength;sc++){
				var surroundingCell = cell.surroundingCells[sc],
					surroundingCellState = surroundingCell.state;
					
				if(surroundingCellState === "alive") alive +=1;
				else if(surroundingCellState === "dead") dead +=1;
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
					
			nextGameCell.col = col,
			nextGameCell.row = row,
			nextGameCell.state = nextState;
			
			if(nextState === "alive") opts.board.livingCells[i] = { "row": row, "col": col };
			
			nextGameCells.push(nextGameCell);
			
			console.log('nextState : ',nextState);
			
			nextState = null;
			alive = 0;
			dead = 0;
		}
		console.log('nextGameCells : ',nextGameCells);
		console.log('opts : ',opts);
		
		createGame(id, opts);
	}
};

function getSurroundingCells(allCells, rows, columns){
	
	if(!allCells) return;
	
	var validSurroundingCells = [{}], 
		count = 1;
	
	allCells.forEach(function(o){
		
		console.log('cells : ',o.row+', '+o.col);
		
		var cRow 	= o.row, 
			cCol 	= o.col,
			cells	= new GameList(),
			dataHash,
			surroundingCells;
			
		surroundingCells = [
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+cRow+'c'+(cCol+1),			row: cRow,		col: cCol+1 },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+(cRow+1)+'c'+(cCol+1),		row: cRow+1, 	col: cCol+1 },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+(cRow+1)+'c'+cCol,			row: cRow+1, 	col: cCol },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+(cRow+1)+'c'+(cCol-1),		row: cRow+1, 	col: cCol-1 },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+cRow+'c'+(cCol-1),			row: cRow, 		col: cCol-1 },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+(cRow-1)+'c'+(cCol-1),		row: cRow-1, 	col: cCol-1 },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+(cRow-1)+'c'+cCol,			row: cRow-1, 	col: cCol },
			{ id: 'cr'+cRow+'cc'+cCol+'-r'+(cRow-1)+'c'+(cCol+1),		row: cRow-1, 	col: cCol+1 }
		];
	
		surroundingCells.forEach(function(e){
			
			var cell;
			
			if(e.row > rows) console.log('row is outside of container');
			else if(e.col > columns) console.log('column is outside of container');
			else if(e.row <= 0) console.log('row is less then or equal to 0');
			else if(e.col <= 0) console.log('column is less then or equal to 0');
			else {		
				cell = { id: e.id, cell: { row: e.row, col: e.col, state: $('#'+e.row+' .'+e.col).attr('class').split(" ")[1] } };
				cells.insert(cell);
			}
		});
		
		dataHash = cells.createDataHash();
		validSurroundingCells[count] = { id: dataHash.id, row: dataHash.id.split('cr')[1].split('cc')[0], col: dataHash.id.split('cr')[1].split('cc')[1], surroundingCells: dataHash.surroundingCells, state: $('#'+cRow+' .'+cCol).attr('class').split(" ")[1] };
		console.log('validSurroundingCells['+count+'] : ',validSurroundingCells[count]);
		count++;
		
	});
	
	return validSurroundingCells;
	
}

function getAllGridPositionsOnBoard(rowSize,colSize){
	if(rowSize === 0 || colSize === 0) return;
	
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

function buildBoard(id, rows, columns){
	if(rows === 0 || columns === 0) return;
	
	var table, r, c;
	
	table = "<table>";
		table += "<tbody>";
			for(r=1; r<=rows; r++){
				table += "<tr id='"+r+"'>";
					for(c=1; c<=columns; c++){
						table += "<td class='"+c+" dead'><img src='images/x-icon.png'/></td>";
					}
				table += "</tr>";
			}
		table += "</tbody>";
	table += "</table>";
	
	$(id).append(table);
}

function createGame(id, opts){
	
	console.log('create game : ',opts);
	
    var width					= opts.board.rowAndColSize.width, 
        height					= opts.board.rowAndColSize.height,
        rows					= opts.board.rowAndCol.rows,
        columns					= opts.board.rowAndCol.cols,
		allGridCells			= getAllGridPositionsOnBoard(rows,columns),
        livingCells				= opts.board.livingCells,
		cellImg					= "<img src='images/cell-icon.png'/>",
		game					= new GameList(),
		validSurroundingCells 	= [],
		surroundingCells, i,
		board = {
			"id": id,
			"rowAndCol": {"rows": rows, "cols": columns },
			"rowAndColSize": {"width": width, "height": height}
		};
		
	
	buildBoard(id, rows, columns);

	$("table tr").css('height',height);
	$("table tr td").css('max-width',width).css('padding','10px').css('border','1px solid #000');
	
	livingCells.forEach(function(o){
		var cRow 	= o.row, 
			cCol 	= o.col;
			
		$('#'+cRow+ " ."+cCol).removeClass('dead')
								.addClass('alive')
								.empty()
								.append(cellImg);
	});
	
	surroundingCells = getSurroundingCells(allGridCells, rows, columns);

	for(i=surroundingCells.length-1; i>=1; i--){
		if(surroundingCells[i] === undefined) return alert('undefined');
		validSurroundingCells.push(surroundingCells[i]);
	}
	
	console.log('valid surrounding cells : ',validSurroundingCells);
	
	game.insert(validSurroundingCells);
	game.nextGameDataHash(board);
}

(function($){
    $.fn.conwaysGameOfLife = function(options){
        var id = $(this), opts;

        $.fn.conwaysGameOfLife.defaults = {
            board: { 
               rowAndCol: {rows: 2, cols: 2},
               rowAndColSize: {width: '50px', height: 'auto'},
               livingCells: [{row: 1, col: 1}, {row: 1, col: 2}, {row: 2, col: 1}]
            }            
        };

        opts = $.extend({}, $.fn.conwaysGameOfLife.defaults, options);

        createGame(id, opts);
    
        return this;    
    };

})(jQuery);