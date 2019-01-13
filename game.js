const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout );
// let vertion  = ['left', 'right','up', 'down'];
let choise = ['l','r','u','d','q'];
// let pole = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
let rotation = [];
const n = 16;

let pole = {0:0,1:2,2:0,3:0,4:0,5:2,6:4,7:2,8:2,9:0,10:8,11:8,12:2,13:0,14:2,15:0};
// let pole = {0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,11:11,12:12,13:13,14:14,15:15};
// let rotation = {0:0,1:0,2:2,3:2,4:2,5:2,6:0,7:2,8:0,9:0,10:0,11:2,12:0,13:0,14:2,15:2};
function algorithm(pole){
	for (i  = 0; i < n; i=i+4) {
		for(j = i; j<i+4; j++){				
			if(pole[j]==pole[j+1]&& j+1<i+4){			
				pole[j]= pole[j] * 2;
				pole[j+1]=0;
				if (pole[j-1]==0&&pole[j-2]==0&&j-1>=i&&j-2>=i){
					pole[j-2]=pole[j];
					pole[j] = 0;
				}else if(pole[j-1]==0&&j-1>=i){
					pole[j-1]=pole[j];
					pole[j]=0;
				}			
			}else if(pole[j]==pole[j+2]&&j+2<i+4&&pole[j+1]==0){
				pole[j]= pole[j] * 2;
				pole[j+1]=0;
				pole[j+2]=0;
				if (pole[j-1]==0&&j-1>=i){
					pole[j-1]=pole[j];
					pole[j]=0;
				}
			}else if(pole[j]==pole[j+3]&&pole[j+1]==pole[j+2]==0&&j+3<i+4){
				pole[j]= pole[j] * 2;
				pole[j+1]=0;
				pole[j+2]=0;
				pole[j+3]=0;
			}else if (pole[j-1]==0&&pole[j-2]==0&&pole[j-3]==0&&j-1>=i&&j-2>=i&&j-3>=i){
				pole[j-3]=pole[j];
				pole[j] = 0;
			}else if (pole[j-1]==0&&pole[j-2]==0&&j-1>=i&&j-2>=i){
				pole[j-2]=pole[j];
				pole[j] = 0;
			}else if(pole[j-1]==0&&j-1>=i){
				pole[j-1]=pole[j];
				pole[j]=0;
			}		 
		}  
	}
}

function showing(pole){
	for (i = 0; i < n; i=i+4) {
		console.log(pole[i], pole[i+1], pole[i+2], pole[i+3]);
	}
}
function mirror(rotation, pole){
	for (i= 0; i < n; i=i+4) {
		for(j = i, k=i+4-1;  j < i+4, k>=i; k--,j++){		
			rotation[j] = pole[k];
		}
	}
}
function roll(){
	for (i=k= 0; i < n/4, k<n; i++, k=k+4) {
		for(j = i-4, l=k; j < i+12, l<k+4; j=j+4, l++){		
			rotation[j+4] = pole[l];
		}
	}
}
function comeBack(){
	for (i=k= 0; i < n/4, k<n; i=i+1, k=k+4) {
		for(j = i-4, l=k; j < i+12, l<k+4; j=j+4, l=l+1){		
			 pole[l] = rotation[j+4];
		}
	}
}
console.log("You can choose.");
console.log('Оригинал');
showing(pole);

console.log("You can choose:", choise[0],', ', choise[1],', ', choise[2],', ',choise[3],' or ', choise[4]);
rl.setPrompt('Your answer: ');
rl.prompt();
rl.on('line', function(line) {
	if (line ===  choise[0]) {
		algorithm(pole);
		showing(pole);
	}else if (line ===  choise[1]){	
		mirror(rotation, pole);
		algorithm(rotation);
		mirror(pole, rotation);	
		showing(pole);
	}else if (line ===  choise[2]){		
		roll();
		algorithm(rotation);
		comeBack();	
		showing(pole);
	}else if(line ===  choise[3]){	
		roll();
		mirror(pole, rotation);
		algorithm(pole);
		mirror(rotation,pole);
		comeBack();	
		showing(pole);
	}else if (line === choise[4]) {rl.close();}
     rl.prompt();
}).on('close',function(){
    process.exit(0);
});









