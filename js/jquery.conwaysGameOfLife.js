function GameList(){
    this.head = null;
}

GameList.prototype = {
    
    /**
     * inserts an element at the tail of the linked list
     * @param {Object} val
     */

    /*{ oldRow: cRow, 
		oldCol: cCol, 
		surroundingCells: {row: e.row, 
						   col: e.col, 
						   state: $('#'+e.row+' .'+e.col).attr('class').split(" ")[1] 
		} }
	*/
	
    insert:function(val){
		alert(val[0].surroundingCells);
		
        var item = {
            value:val,
            next:null
        }

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

	next:function(val){
		
	}
}

function createGame(id, opts){

    var width				= opts.board.rowAndColSize.width, 
        height				= opts.board.rowAndColSize.height,
        rows				= opts.board.rowAndCol.rows,
        columns				= opts.board.rowAndCol.cols,
        livingCells			= opts.board.livingCells,
		surroundingCells	= [],
		cellImg				= "<img src='images/cell-icon.png'/>",
		nextLivingCells		= {}, 
        table, r, c,
		game				= new GameList();
	
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
	
	livingCells.forEach(function(o){

		var cRow 	= o.row, 
			cCol 	= o.col,
			cells 	= [];
			
		//alert('living cells = r:'+cRow+', c:'+cCol);	
		surroundingCells = [
			{row: cRow,		col: cCol+1},
			{row: cRow+1, 	col: cCol+1},
			{row: cRow+1, 	col: cCol},
			{row: cRow+1, 	col: cCol-1},
			{row: cRow, 	col: cCol-1},
			{row: cRow-1, 	col: cCol-1},
			{row: cRow-1, 	col: cCol},
			{row: cRow-1, 	col: cCol+1}
		];

		surroundingCells.forEach(function(e){
			
			if(e.row > rows) console.log('row is outside of container');
			else if(e.col > columns) console.log('column is outside of container');
			else if(e.row <= 0) console.log('row is less then or equal to 0');
			else if(e.col <= 0) console.log('column is less then or equal to 0');
			else {
				cells.push({row: e.row, col: e.col, state: $('#'+e.row+' .'+e.col).attr('class').split(" ")[1] });
				console.log('good cell : ', $('#'+e.row+' .'+e.col).attr('class').split(" ")[1]+', r&c coordinates : r=',e.row+", c="+e.col);
			}
		});
		alert('cells : '+cells[0].row);
		
		for(i in cells){
			//alert("I: "+i);
			
			if(cells.hasOwnProperty(i)){
				var dynamic_property_name = i;
				nextLivingCells[dynamic_property_name] = cells[i];
				
			}
		}
		//nextLivingCells.push(cells);
		
	});
	
	alert('length: '+nextLivingCells.length);
	game.insert(nextLivingCells);
	//alert(nextLivingCells.length);
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