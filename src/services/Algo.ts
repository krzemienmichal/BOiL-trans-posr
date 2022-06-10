import Receiver from "../modules/Receiver"
import Supplier from "../modules/Supplier"
import TransportCell from "../modules/TransportCell"
import CustomCellModel from '../modules/CustomCellModel'
import CustomRowModel from '../modules/CustomRowModel'


//nie trzeba sprawdzac balancowania bo balancowanie jest juz przy ustawianiu dostawcow, odbiorcow oraz tej tabeli (setTransportTableFunc)

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

const findMaxGain=(suppliers: Array<Supplier>, receivers: Array<Receiver>, transportTable: Array<TransportCell>,
                   pickedIndexes: Array<number>) => {
    var idx_i: number = 0;
    var idx_j: number = 0;
    var idx: number = 0;
    var max_idx: number = 0;
    for(let i = 0 ; i < transportTable.length; i++){
        if(!pickedIndexes.includes(i)){
            max_idx = i;
            // idx_j = transportTable[i].colId-1
            // idx_i = transportTable[i].rowId-1
            break;
        }
    }

    for(let i = 0; i < suppliers.length; i++){
        for(let j=0; j < receivers.length; j++){
            if(transportTable[idx].wasPicked === false && transportTable[max_idx].profit <= transportTable[idx].profit &&
            suppliers[i].actualSupply>0 && receivers[j].actualDemand>0){
                max_idx=idx;
                idx_i = i;
                idx_j = j;
            }
            idx+=1;
        }
    }
    return [idx_i, idx_j, max_idx];
}



const calcTransportTable =
    (suppliers: Array<Supplier>, receivers: Array<Receiver>, transportTable: Array<TransportCell>): Array<TransportCell> => {

    let totalSupply = Object.values(suppliers).reduce((item, {supply})=> item + supply, 0)
    let totalDemand = Object.values(receivers).reduce((item, {demand})=> item + demand, 0)

    var pickedIndexes : Array<number> = new Array<number>();
    var end_idx : Array<number> = new Array<number>();
    for(let i = 0; i< suppliers.length;i++){
        for(let j =0;j<receivers.length;j++){
            if(i===suppliers.length-1) end_idx.push(i*receivers.length+j)
            else if(j===receivers.length-1) end_idx.push((i*receivers.length+j))
        }
    }
    end_idx.forEach((index)=> {transportTable[index].profit = - 123456})

    while(totalSupply > 0 && totalDemand > 0){
        let [j, i, idx] = findMaxGain(suppliers, receivers, transportTable, pickedIndexes);
        pickedIndexes.push(idx)
        if(receivers[i].actualDemand > suppliers[j].actualSupply){
            transportTable[idx].transport = suppliers[j].actualSupply;
            receivers[i].actualDemand -= suppliers[j].actualSupply;
            totalSupply -= suppliers[j].actualSupply
            totalDemand -= suppliers[j].actualSupply
            suppliers[j].actualSupply = 0;

        }
        else{
            transportTable[idx].transport = receivers[i].actualDemand;
            suppliers[j].actualSupply -= receivers[i].actualDemand;
            totalDemand -= receivers[i].actualDemand
            totalSupply -= receivers[i].actualDemand
            receivers[i].actualDemand = 0;
        }
        transportTable[idx].wasPicked = true;
        if(transportTable[idx].transport > 0) transportTable[idx].isBase = true;
    }
        end_idx.forEach((index) => {transportTable[index].profit=0})
        return transportTable;
}
 const to_num = (nm: number|null): number => {
    if(nm==null){
        return 0 ;
    }    
    return nm
} 
const to_str = (nm: number|null): string => {
    if(nm==null){
        return "X";
    }    
    return nm.toString()
} 
const addAlfasBetasToResultTable = (suppliers: Array<Supplier>, receivers: Array<Receiver>, transportTable: Array<TransportCell>, 
    alfa: Array<number|null>, beta: Array<number|null>) : Array<TransportCell> => {
        let id_sup = suppliers.length;
        let id_rec = receivers.length;
        receivers.push({id: id_rec, name: "alfa", demand: 0, actualDemand: 0, sellingPrice: 0 });
        suppliers.push({id: id_sup, name: "beta", supply: 0, actualSupply: 0, productCost: 0 });
        var tempTransportTable: Array<TransportCell> = new Array<TransportCell>();
        var alfa_counter  = 0;
        var beta_counter  = 0;
        var transport_counter = 0;
        for (let i = 0; i <suppliers.length; i++){
            for(let j = 0 ; j < receivers.length; j++){
                if(i ==suppliers.length -1 && j == receivers.length -1)
                {
                    break;
                }
                else if(j==receivers.length -1){
                    tempTransportTable.push({id: -1, isBase: false, profit:0, transport: to_num(alfa[alfa_counter]), 
                    wasPicked: false, rowId: i, colId: j});
                    alfa_counter+=1;

                }else if (i === suppliers.length -1){
                    tempTransportTable.push({id: -1, isBase: false, profit:0, transport: to_num(beta[beta_counter]), 
                    wasPicked: false, rowId: i, colId: j});
                    beta_counter+=1;
    
                }
                else{ 
                    tempTransportTable.push(transportTable[transport_counter]);
                    transport_counter+=1;
                }
            }
        }
        console.log("alfy i bety do tranportowej", tempTransportTable)
    return tempTransportTable;
}

const setResults = (setResultsTableRows:(t:Array<CustomRowModel> ) => void, gain:number, cost:number, profit:number)=>{

    var tempResultsTable = new Array<CustomRowModel>();
    
   
    let  tempCellArray = new Array<CustomCellModel>();
    tempCellArray.push( {colNum:0, value:" ", transport : "Profit"})
    tempCellArray.push( {colNum:1, value:" ", transport : "Total gain"})
    tempCellArray.push( {colNum:2, value:" ", transport : "Total cost"})
    let  tempCellArray2 = new Array<CustomCellModel>();
    tempCellArray2.push( {colNum:0, value:" ", transport : profit.toString()})
    tempCellArray2.push( {colNum:1, value:" ", transport : gain.toString()})
    tempCellArray2.push( {colNum:2, value:" ", transport : cost.toString()})
        
    tempResultsTable.push({ rowNum:0, cells:JSON.parse(JSON.stringify(tempCellArray))})
    tempResultsTable.push({ rowNum:0, cells:JSON.parse(JSON.stringify(tempCellArray2))})
    setResultsTableRows(tempResultsTable)
}
const setTransportTableFunc = (setSuppliers:(t:Array<Supplier>) => void,setReceivers:(t:Array<Receiver>) => void, 
    setTransportTable:(t:Array<TransportCell>) => void, rows: Array<CustomRowModel>,
    setShouldStartCalculation:(t:number) => void, shouldStartCalculation: number,
     setDeltasTableRows:(t:Array<CustomRowModel> ) => void,setResultsTableRows:(t:Array<CustomRowModel> ) => void )=> {
    // receiver wiersz ,odbiorca kolumna 

    let tempReceivers : Array<Receiver> = Array<Receiver>();
    let tempSuppliers : Array<Supplier> = Array<Supplier>();
    let tempTransportTable : Array<TransportCell> = Array<TransportCell>();
    let transportCost : Array<number> = Array<number>();

    var totalDemand =0;
    var totalSupply =0;
    for (let i = 1; i <rows[0].cells.length; i++){ // id zaczynaja sie od 1 
        let str:string = rows[0].cells[i].value.trim();
        let tempName = str.substring(0, str.indexOf(", "));
        let tempPrice = parseInt(str.substring(str.indexOf(", ")+1, str.lastIndexOf(", ")))
        let tempValue = parseInt(str.substring(str.lastIndexOf(", ") + 1, str.length));
        tempReceivers.push({ id : i, name: tempName, demand: tempValue, actualDemand:tempValue, sellingPrice:tempPrice })
        totalDemand += tempValue
    }
    for (let i = 1; i <rows.length; i++){ // id zaczynaja sie od 1 
        let str:string = rows[i].cells[0].value.trim();
        let tempName = str.substring(0, str.indexOf(", "));
        let tempCost = parseInt(str.substring(str.indexOf(", ") + 1, str.lastIndexOf(", ")))
        let tempValue = parseInt(str.substring(str.lastIndexOf(", ") + 1, str.length));
        tempSuppliers.push({ id : i, name: tempName, supply: tempValue, actualSupply:tempValue, productCost:tempCost })
        totalSupply += tempValue
    }
    let rowLength =rows.length
    let cellLength =rows[0].cells.length
    if (totalSupply !== totalDemand){
        tempSuppliers.push({ id : rowLength, name: "Fictional Supplier", supply: totalDemand, actualSupply:totalDemand, productCost:0 })
        tempReceivers.push({ id : cellLength, name: "Fictional Receiver", demand: totalSupply, actualDemand:totalSupply, sellingPrice:0 })
    }
    let index = 0;
    for (let i = 1; i < tempSuppliers[tempSuppliers.length -1].id+1; i++){

        for (let j= 1; j < tempReceivers[tempReceivers.length -1].id+1; j++){
            if (i < rows.length){
                if(j < rows[0].cells.length){
                    let str:string = rows[i].cells[j].value.trim();
                    let tempValue = tempReceivers[j-1].sellingPrice - parseInt(str) - tempSuppliers[i-1].productCost;
                    transportCost.push(parseInt(str))
                    tempTransportTable.push({id: index, isBase: false, profit: tempValue, transport: 0, wasPicked: false, rowId: i, colId:j });  
                       
                }
                else{
                    let tempValue = 0
                    transportCost.push(0)
                    tempTransportTable.push({id: index, isBase: false, profit: tempValue, transport: 0, wasPicked: false, rowId: i, colId:j });
                }
            }
            else{
                let tempValue = 0
                transportCost.push(0)
                tempTransportTable.push({id: index, isBase: false, profit: tempValue, transport: 0, wasPicked: false, rowId: i, colId:j });
            }
            index +=1;

        }
    }
    tempTransportTable = calcTransportTable(tempSuppliers, tempReceivers, tempTransportTable)

    var [alfa, beta] = cycleCalculation(tempSuppliers, tempReceivers, tempTransportTable, setDeltasTableRows)
    // var totalCost = Object.values(tempSuppliers).reduce((item, {productCost})=> item + productCost, 0)
    // var totalGain = Object.values(tempTransportTable).reduce((item, {profit}) => item + profit, 0 )
    // var intermediaryGain = totalGain - totalCost
    console.log("TRANSPORTCOST: ", transportCost)
    var [totalCost, totalGain, profit] = calculateIncome(tempSuppliers, tempReceivers, tempTransportTable, transportCost)

    console.log("ALFA: ", alfa)
    console.log("BETA: ", beta)
    console.log("Tot Cost: ", totalCost)
    console.log("Tot Gain: ", totalGain)
    console.log("Int Gain: ", profit)
    setResults(setResultsTableRows, totalGain, totalCost, profit)
    tempTransportTable = addAlfasBetasToResultTable  (tempSuppliers, tempReceivers, tempTransportTable, alfa, beta) 
    console.log(" po w yjsciu z obliczen ", tempTransportTable)
    setSuppliers(tempSuppliers)
    setReceivers(tempReceivers)
    setTransportTable(tempTransportTable)
  
    setShouldStartCalculation(shouldStartCalculation*-1)
    return

}

const createFinalTable = (setFinalTableRows:(t:Array<CustomRowModel>) => void, suppliers: Array<Supplier>,
            receivers: Array<Receiver>, transportTable: Array<TransportCell>) => {

    // console.log("Receivers ", receivers)
    // console.log("Suppliers ", suppliers)
    // console.log("TransportTable ", transportTable)

    var tempFinalTable = new Array<CustomRowModel>();
    var length_of_row = receivers.length
    {
        let  tempCellArray = new Array<CustomCellModel>();
        tempCellArray.push({ colNum:0, value:"", transport:""})
        for(let j = 0; j <receivers.length; j++){
            if (j == receivers.length-1){
                tempCellArray.push({ colNum:j, value:receivers[j].name, transport:""})
            }else{
                tempCellArray.push({ colNum:j, value:receivers[j].name + ", " +receivers[j].demand.toString(), transport:""})
            }
           
        }
        tempFinalTable.push({ rowNum:0, cells:JSON.parse(JSON.stringify(tempCellArray))})
    }
    for (let i = 0; i <suppliers.length ; i++){
        let  tempCellArray = new Array<CustomCellModel>();
        for(let j = 0; j <receivers.length; j++){
            let index:number =(i) * length_of_row + j
            if(j==0 && i == suppliers.length -1){
                tempCellArray.push({ colNum:j, value:suppliers[i].name, transport:""})
            }
            else if (j ===0){
               
                tempCellArray.push({ colNum:j, value:suppliers[i].name + ", " +suppliers[i].supply.toString(), transport:""})
            }
            if(j == receivers.length -1 && i==suppliers.length-1){
                tempCellArray.push({ colNum:j, value:"", transport:""})
            }else if( i == suppliers.length -1){
                tempCellArray.push({ colNum:j, value:" ", transport: transportTable[index].transport.toString()})
            }
            else if( j==receivers.length -1 ){
                tempCellArray.push({ colNum:j, value:" ", transport: transportTable[index].transport.toString()})
            }
            else{
                tempCellArray.push({ colNum:j, value:transportTable[index].profit.toString(),
                     transport: transportTable[index].transport.toString()})
            }
            // console.log(index.toString() ," ,i = ", i , ' , j = ', j)
           
            
        }
        tempFinalTable.push({ rowNum:i+1, cells:JSON.parse(JSON.stringify(tempCellArray))})
    }

    // console.log("final table:  ", tempFinalTable)
    setFinalTableRows(tempFinalTable)
    return

}
const checkIfAllFilled = (rows: Array<CustomRowModel>) :boolean =>{

   
    for(let i = 0; i < rows.length; i++){
        for(let j =0; j <rows[i].cells.length; j++){
            if ( i !==0 && j!==0){
                if(rows[i].cells[j].value===""){
                    return false;
                }
            }
        }
    }
    return true;

}
const checkIfFilledCorrectly = (rows: Array<CustomRowModel>) :string =>{

    var wrong:boolean = false;
    var error:string = "error occurred in following cell/cells = ["
    for(let i = 0; i < rows.length; i++){
        for(let j =0; j <rows[i].cells.length; j++){
            if ( i ===0 && j===0){
                
            }else{
                if(i ===0){
                    let str:string = rows[0].cells[j].value.trim();
                    
                    let nm =parseInt(str.substring(str.lastIndexOf(", ") + 1, str.length))
                    console.log("str" + str+" , error =" + nm+"/")
                    if(Number.isInteger(nm) === false){
                       wrong = true;
                       error += "("+i.toString()+ ", " +j.toString()+ "), ";   
                    }
                }
                else if(j===0)
                {
                    let str:string = rows[i].cells[0].value.trim();
                    
                    let nm =parseInt(str.substring(str.lastIndexOf(", ") + 1, str.length))
                    console.log("str" + str+" , error =" + nm+"/")
                    if(Number.isInteger(nm) === false){
                       wrong = true;
                       error += "("+i.toString()+ ", " +j.toString()+ "), ";   
                    }
                }
                else{
                    let nm =parseInt(rows[i].cells[j].value)
                    if(Number.isInteger(nm)===false){
                        error += "("+i.toString()+ ", " +j.toString()+ "), "; 
                        wrong = true;
                    }
                }
            }
        }
    }
    error = error.trim().slice(0,-1) +"]"
    
    if (wrong === false) {
        return ""
    }
    return error;
}
const setDeltas = (setDeltasTableRows:(t:Array<CustomRowModel> ) => void, criticalVariable: (null | number)[][])=>{

    var tempDeltaslTable = new Array<CustomRowModel>();
    
    for(let i = 0; i < criticalVariable.length;i++) {
        let  tempCellArray = new Array<CustomCellModel>();
        for (let j = 0; j < criticalVariable[i].length;j++){
            tempCellArray.push({ colNum:j, value:" ", transport : to_str(criticalVariable[i][j])})
        }
        tempDeltaslTable.push({ rowNum:i, cells:JSON.parse(JSON.stringify(tempCellArray))})
    }  
    setDeltasTableRows(tempDeltaslTable)
}
const cycleCalculation = (suppliers: Array<Supplier>, receivers: Array<Receiver>, transportTable: Array<TransportCell>, 
    setDeltasTableRows:(t:Array<CustomRowModel> ) => void) =>{



    while(true) {
        var alfa : Array<number|null> = new Array<number>(suppliers.length);
        var beta : Array<number|null> = new Array<number>(receivers.length);
        for(let i = 0; i < alfa.length; i++) alfa[i] = null
        for(let i = 0; i < beta.length; i++) beta[i] = null
        alfa[0] = 0
        let isNotSolved = true
        let idx = 0
        while (isNotSolved) {
            isNotSolved = false;
            for (let i = 0; i < alfa.length; i++) {
                for (let j = 0; j < beta.length; j++) {
                    idx = i * beta.length + j
                    if (alfa[i] === null || beta[j] === null) {
                        isNotSolved = true;
                    }
                    if (transportTable[idx].transport !== 0 && alfa[i] !== null && beta[j] === null) {
                        beta[j] = transportTable[idx].profit - alfa[i]!;
                    }
                    if (transportTable[idx].transport !== 0 && alfa[i] === null && beta[j] !== null) {
                        alfa[i] = transportTable[idx].profit - beta[j]!;
                    }
                }
            }

        }

        var criticalVariable: (null | number)[][] = suppliers.map(() =>
            receivers.map(() => 0)
        );
        let index_i: number = -1,
            index_j: number = -1;
        let maxValue = 0;

        idx = 0

        for (let i = 0; i < criticalVariable.length; i++) {
            for (let j = 0; j < criticalVariable[0].length; j++) {
                idx = i * criticalVariable[0].length + j
                if (transportTable[idx].transport !== 0) {
                    criticalVariable[i][j] = null;
                } else {
                    criticalVariable[i][j] = transportTable[idx].profit - alfa[i]! - beta[j]!;
                    if (criticalVariable[i][j]! > maxValue) {
                        maxValue = criticalVariable[i][j]!;
                        index_i = i;
                        index_j = j;
                    }
                }
            }
        }

        if (maxValue > 0) {
            let temp_i: number = 0,
                temp_j: number = 0;
            for (let i = 0; i < criticalVariable.length; i++) {
                for (let j = 0; j < criticalVariable[0].length; j++) {
                    if (
                        criticalVariable[i][j] === null &&
                        criticalVariable[index_i][j] === null &&
                        criticalVariable[i][index_j] === null
                    ) {
                        temp_i = i;
                        temp_j = j;
                    }
                }
            }
            if (transportTable[temp_i * criticalVariable[0].length + index_j].transport < transportTable[index_i * criticalVariable[0].length + temp_j].transport) {
                transportTable[index_i * criticalVariable[0].length + temp_j].transport -= transportTable[temp_i * criticalVariable[0].length + index_j].transport;
                transportTable[temp_i * criticalVariable[0].length + temp_j].transport += transportTable[temp_i * criticalVariable[0].length + index_j].transport;
                transportTable[index_i * criticalVariable[0].length + index_j].transport += transportTable[temp_i * criticalVariable[0].length + index_j].transport;
                transportTable[temp_i * criticalVariable[0].length + index_j].transport = 0;
            } else {
                transportTable[temp_i * criticalVariable[0].length + index_j].transport -= transportTable[index_i * criticalVariable[0].length + temp_j].transport;
                transportTable[temp_i * criticalVariable[0].length + temp_j].transport += transportTable[index_i * criticalVariable[0].length + temp_j].transport;
                transportTable[index_i * criticalVariable[0].length + index_j].transport += transportTable[index_i * criticalVariable[0].length + temp_j].transport;
                transportTable[index_i * criticalVariable[0].length + temp_j].transport = 0;
            }
        } else {
            break;
        }
    }
    setDeltas(setDeltasTableRows, criticalVariable);
    return [alfa, beta]
}

const calculateIncome = (suppliers: Array<Supplier>, receivers: Array<Receiver>, transportTable: Array<TransportCell>,
                         transportCost: Array<number>) =>{
    var totalCost : number = 0,
        totalGain : number = 0,
        profit : number = 0;

    var end_idx : Array<number> = new Array<number>();
    for(let i = 0; i< suppliers.length;i++){
        for(let j =0;j<receivers.length;j++){
            if(i===suppliers.length-1) end_idx.push(i*receivers.length+j)
            else if(j===receivers.length-1) end_idx.push((i*receivers.length+j))
        }
    }

    let idx = 0

    for(let i = 0; i < suppliers.length; i++){
        for(let j = 0; j < receivers.length; j++){
            idx = i*receivers.length+j
            if(!end_idx.includes(idx)){
                totalCost += transportTable[idx].transport * (suppliers[i].productCost + transportCost[idx])
                totalGain += transportTable[idx].transport * receivers[j].sellingPrice
            }
        }
    }
    profit = totalGain - totalCost
    return [totalCost, totalGain, profit]
}

// const calcCriticalVariables = (suppliers : Array<Supplier>, receivers : Array<Receiver>, transportTable : Array<TransportCell>,
//                             alfa : Array<number|null>, beta : Array<number|null>) : boolean =>{
//
//
// }
export {setTransportTableFunc, createFinalTable, checkIfAllFilled, checkIfFilledCorrectly}