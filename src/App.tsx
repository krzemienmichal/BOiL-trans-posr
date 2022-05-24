import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row} from 'react-bootstrap'
import {Entrytable} from './components/Entrytable'
import CustomRowModel from './modules/CustomRowModel'
import CustomCellModel from './modules/CustomCellModel'
import {SyntheticEvent, useState, useEffect} from "react"

function App() {
  const [tableRows, setTableRows] = useState<Array<CustomRowModel>>([])
  const [finalTableRows, setFinalTableRows] = useState<Array<CustomRowModel>>([])
  const [shoudCalculate, setShoudCalculate] = useState<number>(1)
  useEffect(() =>{
    let rowArr : Array<CustomRowModel>  = Array<CustomRowModel>()
    
    for (let i = 0; i < 2; i++){
      rowArr.push({rowNum : 0, cells : Array<CustomCellModel>()});
      for (let j = 0; j < 2; j++){
        rowArr[rowArr.length-1].cells.push({colNum : 0, value :""})
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
  return (
    <div className="App">

      <div className="entryValues">

        <div className="entryTable">
          <Entrytable rows = {tableRows} setRows = {setTableRows}/>
        </div>

        
      </div> 
      
    </div>
  );
}

export default App;
