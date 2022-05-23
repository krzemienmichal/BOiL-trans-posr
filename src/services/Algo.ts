import Receiver from "../modules/Reveiver"
import Supplier from "../modules/Supplier"
import TransportCell from "../modules/TransportCell"

const isBalanced = (suppliers: Array<Supplier>, receivers: Array<Receiver>){
    // let wholeDeman
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