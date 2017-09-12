
let FIGURES = [
  [// фигура 1
    [[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,0,0],[0,1,1,0], [0,1,0,0],[0,0,0,0]],
	[[0,1,1,1],[0,0,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]]
  ],
  [// 
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]]
  ],
  [
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]]
  ],[
  	[[0,0,1,0],[0,0,1,0],[0,1,1,0],[0,0,0,0]],
  	[[0,0,0,0],[1,1,1,0],[0,0,1,0],[0,0,0,0]],
    [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]],
    [[0,0,0,0],[0,1,0,0],[0,1,1,1],[0,0,0,0]]
    ]
]
let map = [], gameover, figure, newfigx, keypressed, figureX, figureY, figureRotate,
width = 10, height = 20, field, tbody, counter = 0, id, trigger = true;

let ElemCount = document.querySelector('.count') // счетчик
let createMap = () => {			
		map = [];
				for (let i = 0; i < height ;i++) {
				  map.push([]);
				  for (let j = 0;j < width; j++) map[i].push(0);
				}
			return map;
	}
		//может ли фигура существовать в заданных координатах
let createTable = (tableData) => {
		field = document.querySelector('#field');
		field.innerHTML = '';
		 let table = document.createElement('table');
		  let tableBody = document.createElement('tbody');

		  tableData.forEach(function(rowData) {
		    let row = document.createElement('tr');

		    rowData.forEach(function(cellData) {
		      let cell = document.createElement('td');
		      cell.className = 'blank';
		      //cell.appendChild(document.createTextNode(cellData));
		      row.appendChild(cell);
		    });
		    tableBody.appendChild(row);
		  });
  tableBody.className = 'tbody'
  table.appendChild(tableBody);
  field.appendChild(table);
}

let render = () => {
	tbody = document.querySelector(".tbody")
	let tr = tbody.querySelectorAll('tr');
	for (let i = 0; i < height; i++) {
		let td = tr[i].cells
		for (let j = 0; j < width; j++) {
			td[j].className = (map[i][j])? 'filled-cell':'blank';
		}
	}
}

let can_exist = (someFigure, xf ,yf) =>	{
		  for (let y = 0; y < 4; y++) {
		    for (let x = 0; x < 4; x++) {
		      if (!someFigure[y][x]) continue; // если в данной точке нет фигуры, пропускаем
		      let fieldX = x + xf;
		      let fieldY = y + yf;
		      if (fieldX < 0 || fieldX >= width || fieldY < 0 || fieldY >= height) return false;// за пределами поля
		      if (map[fieldY][fieldX]) return false;// в данных координатах уже есть блок
		    }
		  }
		  return true;
		}
let eraseFigure = () =>{
	// cтираем нестабильные фигуры(которые в процессе движения)
	map.forEach( (item,index) => item.forEach( (item2, index2) => {if(item2 == 1) map[index][index2] = 0;}));
}

let addFigureToMap = (someFigure, xf, yf, render = false)  => {
	// Отрисовка фигуры на карте
	//переменная render, при true делает стабильную отрисовку
	eraseFigure();
		for (let y = 0; y < 4; y++) {
		    for (let x = 0; x < 4; x++) {
		      if (!someFigure[y][x]) continue; // если в данной точке нет фигуры, пропускаем
		      let fieldX = x + xf;
		      let fieldY = y + yf;
		      map[fieldY][fieldX] = render? 2 : 1;// отрисовываем клетку
		    }
		}
	
}

// Если заполнены полностью ряды то стираем их
let eraseFilledRows = ()  => {
		for (let i = 0; i < height ;i++) {
			  if(map[i].every((j) => j == 2)){
			   map.splice(i, 1);
			   map.unshift(new Array(width).fill(0))
			   counter++;
			   ElemCount.innerHTML = `Your count: ${counter}`
		}
	}
}
// Сброс параметров 
let reset = () => {
	figure = undefined;
	figureRotate = undefined;
	figureX = undefined;
	figureY = undefined;
}
let random = num => Math.floor(Math.random() * num)

let keyAction = e => { 
	eraseFigure();
		switch(e.keyCode){
	        case 27:  // escape (pause)
	        	trigger? clearInterval(id): id = setInterval(work, 500);
	        	trigger = !trigger;
	        	break;
	        
	         case 115: // f4 (new game)
	         	trigger = true
	         	clearInterval(id);
	         	reset()
	        	init()
	        	break;
	        case 37:  // если нажата клавиша влево

	            newfigx = figureX - 1;
	 			    if (can_exist(FIGURES[figure][figureRotate], newfigx, figureY)) figureX = newfigx;
	 			    addFigureToMap(FIGURES[figure][figureRotate], figureX, figureY);
	 			    render();    
	            break;
	        case 82:   
	        //  если нажата клавиша R (поворот)
	          newfigr = (figureRotate == 3)? 0 : figureRotate + 1;
	 			    if (can_exist(FIGURES[figure][newfigr],figureX,figureY)) figureRotate = newfigr;
	 			    addFigureToMap(FIGURES[figure][figureRotate], figureX, figureY);
	 			    render();
	            break;
	        case 39:   // если нажата клавиша вправо
	            newfigx = figureX + 1;
	 			    if (can_exist(FIGURES[figure][figureRotate], newfigx, figureY)) figureX = newfigx;
	 			    addFigureToMap(FIGURES[figure][figureRotate], figureX, figureY);
	 			    render();   	                
	            break;
	        case 40:   // если нажата клавиша вниз
	           eraseFigure();
			  if (can_exist(FIGURES[figure][figureRotate], figureX, figureY + 1)) { // 4. если можно опустить вниз
			    figureY++;
			    addFigureToMap(FIGURES[figure][figureRotate], figureX, figureY)
			    render();
			  }	                
	            break;
	    }
}
let work = ()  => {				
			
			  if (gameover) return;
				  if ( figure === undefined) { // если текущей фигуры нет
			     	figure = random( FIGURES.length ); //  выбрать случайную фигуру
			        figureRotate = random(FIGURES[figure].length );// выбрать случайный поворот фигуры

				   figureX = ( width / 2 ) - 2, figureY = 0;// поместить в верхнюю часть экрана в середину
				    // если фигура не может существовать в данных координатах

				    if (!can_exist(FIGURES[figure][figureRotate],figureX ,figureY )) {

				      gameover = true;
				      clearInterval(id);
				      ElemCount.innerHTML = 'gameover'
				       //  То конец игры (стакан заполнен
				      return;
				    }
				}

				addFigureToMap(FIGURES[figure][figureRotate], figureX, figureY)
				render();

			
			  eraseFigure();
			  if (can_exist(FIGURES[figure][figureRotate], figureX, figureY + 1)) { // 4. если можно опустить вниз
			    figureY++;
			    addFigureToMap(FIGURES[figure][figureRotate], figureX, figureY)
			    render();
			    return;
			  }
			  // 5. добавить фигуру в FIELD
			  addFigureToMap(FIGURES[figure][figureRotate], figureX, figureY, true)
			  

			  // 6. удалить фигуру
			  reset()
			  // 7. проверяем, есть ли полностью заполненные строчки
			  eraseFilledRows();
			  return;
			}

	

let init = ()  => {
		ElemCount.innerHTML = 'Your count: 0'
		createTable(createMap())	    
		gameover = false;
		id = setInterval(work, 500) 
		

}
addEventListener("keydown", keyAction);
init()

/*
switch(e.keyCode){
         
        case 37:  // если нажата клавиша влево
            if(left>0)
                blueRect.style.marginLeft = left - 10 + "px";
            break;
        case 38:   // если нажата клавиша вверх
            if(top>0)
                blueRect.style.marginTop = top - 10 + "px";
            break;
        case 39:   // если нажата клавиша вправо
            if(left < document.documentElement.clientWidth - 100)
                blueRect.style.marginLeft = left + 10 + "px";
            break;
        case 40:   // если нажата клавиша вниз
            if(top < document.documentElement.clientHeight - 100)
                blueRect.style.marginTop = top + 10 + "px";
            break;
    }
}
*/ 

