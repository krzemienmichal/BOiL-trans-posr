import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row} from 'react-bootstrap'
import {Entrytable} from './components/EntryTable'
import CustomRowModel from './modules/CustomRowModel'
import CustomCellModel from './modules/CustomCellModel'
import {SyntheticEvent, useState, useEffect} from "react"
import Receiver from './modules/Receiver'
import Supplier from './modules/Supplier'
import TransportCell from './modules/TransportCell'
import {setTransportTableFunc, createFinalTable} from './services/Algo'
import {FinalTable} from './components/FinalTable'
import {CustomNavbar} from './components/Navbar'

function App() {
  const [tableRows, setTableRows] = useState<Array<CustomRowModel>>([])
  const [finalTableRows, setFinalTableRows] = useState<Array<CustomRowModel>>([])
  const [shouldCalculate, setShouldCalculate] = useState<number>(1)
  const [receivers, setReceivers] = useState<Array<Receiver>>([])
  const [suppliers, setSuppliers] = useState<Array<Supplier>>([])
  const [transportTable, setTransportTable] = useState<Array<TransportCell>>([])
  const [shouldCreateFinalTable, setShouldCreateFinalTable] = useState<number>(1)
  const [shouldStartCalculation, setShouldStartCalculation] = useState<number>(1)

  useEffect(() =>{
    let rowArr : Array<CustomRowModel>  = Array<CustomRowModel>()
    
    for (let i = 0; i < 2; i++){
      rowArr.push({rowNum : 0, cells : Array<CustomCellModel>()});
      for (let j = 0; j < 2; j++){
        rowArr[rowArr.length-1].cells.push({colNum : 0, value :"", transport:""})
      }
    }
    for (let i = 0; i < 2; i++){
      rowArr[i].rowNum=i
      for (let j = 0; j < 2; j++){
        rowArr[i].cells[j].colNum=j
      }
    }

    setTableRows(rowArr)
    console.log(rowArr)
  },[]);

  useEffect(() =>{
    if(tableRows.length >0){

      setTransportTableFunc(setSuppliers, setReceivers, setTransportTable, tableRows, setShouldStartCalculation, shouldStartCalculation)

    }
  },[shouldCalculate]);

  useEffect(() =>{
    if(suppliers.length >0){

      setShouldCreateFinalTable(shouldCreateFinalTable*-1)
     
    }
  },[shouldStartCalculation]); 
  useEffect(() =>{
    if(suppliers.length >0){
      createFinalTable(setFinalTableRows, suppliers, receivers, transportTable)
     
    }
  },[shouldCreateFinalTable]); 
  return (
    <div className="App">
      <CustomNavbar/>
      <div className="entryValues">

        <div className="entryTable">
          <Entrytable rows = {tableRows} setRows = {setTableRows}
           setShouldCalculate = {setShouldCalculate} shouldCalculate = {shouldCalculate}/>
        </div>

        
      </div> 
      <div className="finalResults">
        <div className="finalTable">
          <FinalTable rows = {finalTableRows} />
          </div>
      </div>
      
    </div>
  );
}

export default App;
