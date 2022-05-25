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


const findMaxGain=(suppliers: Array<Supplier>, receivers: Array<Receiver>, transportTable: Array<Array<TransportCell>>) => {
    let idx_i: number = 0;
    let idx_j: number = 0;
    for(let i = 0; i < receivers.length; i++){
        for(let j=0; j < suppliers.length; j++){
            if(transportTable[i][j].wasPicked === false && transportTable[idx_i][idx_j] < transportTable[i][j]){
                idx_i = i;
                idx_j = j;
            }
        }
    }
    return [idx_i, idx_j];
}

const CalcTransportTable =
    (suppliers: Array<Supplier>, receivers: Array<Receiver>, transportTable: Array<Array<TransportCell>>)=> {
    while(true){
        let [i, j] = findMaxGain(suppliers, receivers, transportTable);
        if(receivers[i].actualDemand > suppliers[j].actualSupply){
            transportTable[i][j].transport = suppliers[j].actualSupply;
            receivers[i].actualDemand -= suppliers[j].actualSupply;
            suppliers[j].actualSupply = 0;

        }
        else{
            transportTable[i][j].transport = receivers[i].actualDemand;
            suppliers[j].actualSupply -= receivers[i].actualDemand;
            receivers[i].actualDemand = 0;
        }
        transportTable[i][j].wasPicked = true;
        transportTable[i][j].isBase = true;

    }

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
        let tempName = str.substring(0, str.lastIndexOf(", "));
        let tempValue = parseInt(str.substring(str.lastIndexOf(", ") + 1, str.length));
        tempReceivers.push({ id : i, name: tempName, demand: tempValue, actualDemand:tempValue })
        totalDemand += tempValue
    }
    for (let i = 1; i <rows.length; i++){ // id zaczynaja sie od 1 
        let str:string = rows[i].cells[0].value.trim();
        let tempName = str.substring(0, str.lastIndexOf(", "));
        let tempValue = parseInt(str.substring(str.lastIndexOf(", ") + 1, str.length));
        tempSuppliers.push({ id : i, name: tempName, supply: tempValue, actualSupply:tempValue })
        totalSupply += tempValue
    }
    let rowLength =rows.length
    let cellLength =rows[0].cells.length
    if (totalSupply !== totalDemand){
        tempSuppliers.push({ id : rowLength, name: "Fictitious Supplier", supply: totalDemand, actualSupply:totalDemand })
        tempReceivers.push({ id : cellLength, name: "Fictitious Receiver", demand: totalSupply, actualDemand:totalSupply })
    }
    let index = 0;
    for (let i = 1; i < tempSuppliers[tempSuppliers.length -1].id+1; i++){

        for (let j= 1; j < tempReceivers[tempReceivers.length -1].id+1; j++){
            if (i < rows.length){
                if(j < rows[0].cells.length){
                    let str:string = rows[i].cells[j].value.trim();
                    let tempValue = parseInt(str);   
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
            tempCellArray.push({ colNum:j, value:transportTable[index].transport.toString(), transport: transportTable[index].profit.toString()})
            
        }
        tempFinalTable.push({ rowNum:i+1, cells:JSON.parse(JSON.stringify(tempCellArray))})
    }

    console.log("final table:  ", tempFinalTable)
    setFinalTableRows(tempFinalTable)
    return

}
export {setTransportTableFunc, createFinalTable}