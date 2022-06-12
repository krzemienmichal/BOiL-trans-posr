import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row} from 'react-bootstrap'
import {Entrytable} from './components/Entrytable'
import CustomRowModel from './modules/CustomRowModel'
import CustomCellModel from './modules/CustomCellModel'
import {SyntheticEvent, useState, useEffect} from "react"
import Receiver from './modules/Receiver'
import Supplier from './modules/Supplier'
import TransportCell from './modules/TransportCell'
import {setTransportTableFunc, createFinalTable, checkIfAllFilled, checkIfFilledCorrectly} from './services/Algo'
import {FinalTable} from './components/FinalTable'
import {ResultTable} from './components/ResultTable'
import {CustomNavbar} from './components/Navbar'

function App() {
  const [tableRows, setTableRows] = useState<Array<CustomRowModel>>([])
  const [finalTableRows, setFinalTableRows] = useState<Array<CustomRowModel>>([])
  const [deltasTableRows, setDeltasTableRows] = useState<Array<CustomRowModel>>([])
  const [resultsTableRows, setResultsTableRows] = useState<Array<CustomRowModel>>([])
  const [shouldCalculate, setShouldCalculate] = useState<number>(1)
  const [receivers, setReceivers] = useState<Array<Receiver>>([])
  const [suppliers, setSuppliers] = useState<Array<Supplier>>([])
  const [transportTable, setTransportTable] = useState<Array<TransportCell>>([])
  const [shouldCreateFinalTable, setShouldCreateFinalTable] = useState<number>(1)
  const [shouldStartCalculation, setShouldStartCalculation] = useState<number>(1)
  const [error, setError] = useState<string>("")

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
    if(tableRows.length >0 && checkIfAllFilled(tableRows) === true){
      var err: string= checkIfFilledCorrectly(tableRows)
      if(err==="")
      {
        setTransportTableFunc(setSuppliers, setReceivers, setTransportTable, tableRows, setShouldStartCalculation, shouldStartCalculation, setDeltasTableRows, setResultsTableRows)
        setError("")
      }else{
        setError(err)
      }

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
           setShouldCalculate = {setShouldCalculate} shouldCalculate = {shouldCalculate}
           error = {error}/>
        </div>

            
      </div> 
      <div className="strings">
      <h2>
        Final table:
      </h2>
      </div>
      <div className="finalResults">
        
        <div className="finalTable">
          <FinalTable rows = {finalTableRows} />
          
          </div>
          
      </div>
      <div className="strings">
      <h2>
        Delta's table:
      </h2>
      </div>
      <div className="deltasResults">
          <ResultTable rows = {deltasTableRows} />
      </div>
      <div className="strings">
      <h2>
        Final results:
      </h2>
      </div>
      <div className="endResults">
          <ResultTable rows = {resultsTableRows} />
      </div>
      
    </div>
  );
}

export default App;
