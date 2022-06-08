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
    var counter: number = 0;
    var pickedIndexes : Array<number> = new Array<number>();
    var end_idx : Array<number> = new Array<number>();
    for(let i = 0; i< suppliers.length;i++){
        for(let j =0;j<receivers.length;j++){
            if(i===suppliers.length-1) end_idx.push(i*receivers.length+j)
            else if(j===receivers.length-1) end_idx.push((i*receivers.length+j))
        }
    }
    end_idx.forEach((index)=> {transportTable[index].profit = - 123456})
    console.log("END INDEXES HERE:", end_idx)

    while(totalSupply > 0 && totalDemand > 0){
        let [j, i, idx] = findMaxGain(suppliers, receivers, transportTable, pickedIndexes);
        pickedIndexes.push(idx)
        console.log(i, j, idx)
        if(receivers[i].actualDemand > suppliers[j].actualSupply){
            console.log("act supply",suppliers[j].actualSupply)
            transportTable[idx].transport = suppliers[j].actualSupply;
            receivers[i].actualDemand -= suppliers[j].actualSupply;
            totalSupply -= suppliers[j].actualSupply
            totalDemand -= suppliers[j].actualSupply
            suppliers[j].actualSupply = 0;

        }
        else{
            console.log("demand", receivers[i].actualDemand)
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

const setTransportTableFunc = (setSuppliers:(t:Array<Supplier>) => void,setReceivers:(t:Array<Receiver>) => void, 
    setTransportTable:(t:Array<TransportCell>) => void, rows: Array<CustomRowModel>,
    setShouldStartCalculation:(t:number) => void, shouldStartCalculation: number)=> {
    // receiver wiersz ,odbiorca kolumna 

    let tempReceivers : Array<Receiver> = Array<Receiver>();
    let tempSuppliers : Array<Supplier> = Array<Supplier>();
    let tempTransportTable : Array<TransportCell> = Array<TransportCell>();
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
                    tempTransportTable.push({id: index, isBase: false, profit: tempValue, transport: 0, wasPicked: false, rowId: i, colId:j });  
                       
                }
                else{
                    let tempValue = 0
                    tempTransportTable.push({id: index, isBase: false, profit: tempValue, transport: 0, wasPicked: false, rowId: i, colId:j });
                }
            }
            else{
                let tempValue = 0
                tempTransportTable.push({id: index, isBase: false, profit: tempValue, transport: 0, wasPicked: false, rowId: i, colId:j });
            }
            index +=1;

        }
    }
    tempTransportTable = calcTransportTable(tempSuppliers, tempReceivers, tempTransportTable)
    console.log("outside",tempTransportTable)
    setSuppliers(tempSuppliers)
    setReceivers(tempReceivers)
    setTransportTable(tempTransportTable)
  
    setShouldStartCalculation(shouldStartCalculation*-1)
    return

}
const createFinalTable = (setFinalTableRows:(t:Array<CustomRowModel>) => void, suppliers: Array<Supplier>,
            receivers: Array<Receiver>, transportTable: Array<TransportCell>,) => {

    console.log("Receivers ", receivers)
    console.log("Suppliers ", suppliers)
    console.log("TransportTable ", transportTable)
    var tempFinalTable = new Array<CustomRowModel>();
    var length_of_row = receivers.length
    {
        let  tempCellArray = new Array<CustomCellModel>();
        tempCellArray.push({ colNum:0, value:"", transport:""})
        for(let j = 0; j <receivers.length; j++){
            tempCellArray.push({ colNum:j, value:receivers[j].name + ", " +receivers[j].demand.toString(), transport:""})
        }
        tempFinalTable.push({ rowNum:0, cells:JSON.parse(JSON.stringify(tempCellArray))})
    }
    for (let i = 0; i <suppliers.length ; i++){
        let  tempCellArray = new Array<CustomCellModel>();
        for(let j = 0; j <receivers.length; j++){

            if (j ===0){
               
                tempCellArray.push({ colNum:j, value:suppliers[i].name + ", " +suppliers[i].supply.toString(), transport:""})
            }
           

            let index:number =(i) * length_of_row + j
            console.log(index.toString() ," ,i = ", i , ' , j = ', j)
            tempCellArray.push({ colNum:j, value:transportTable[index].profit.toString(), transport: transportTable[index].transport.toString()})
            
        }
        tempFinalTable.push({ rowNum:i+1, cells:JSON.parse(JSON.stringify(tempCellArray))})
    }

    console.log("final table:  ", tempFinalTable)
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
export {setTransportTableFunc, createFinalTable, checkIfAllFilled, checkIfFilledCorrectly}