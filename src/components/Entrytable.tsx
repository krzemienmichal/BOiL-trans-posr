import React from "react";
import {SyntheticEvent, useEffect, useState} from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import {Row, Form, Button, Table} from 'react-bootstrap'
import CustomRowModel from '../modules/CustomRowModel'
import CustomCellModel from '../modules/CustomCellModel'
import ChangeValueModel from '../modules/ChangeValueModel'
import {CustomRow} from './CustomRowEntryTable'
import '../styling/entrytable.css'
const Entrytable = (props: { rows: Array<CustomRowModel>, setRows:(t:Array<CustomRowModel>) => void,
     setShouldCalculate:(t:number) => void, shouldCalculate: number, error: string  }) => {
    
    const [sizeString, setSizeString] = useState<string>("20px")
    const [changeValue, setChangeValue] = useState<ChangeValueModel>({rowNum:0, colNum:0, value:""})
    useEffect(() =>{
        if(props.rows.length >0)
        {
        let num = props.rows[0].cells.length;
        let size = 170 *num+50;
        let SizeString  = size.toString()+'px'
        setSizeString(SizeString)
        }
        
    },[props.rows])

    useEffect(() =>{
        if(props.rows.length >0)
        {
        props.rows[changeValue.rowNum].cells[changeValue.colNum].value = changeValue.value;
        props.setRows(props.rows)
        }
        
    },[changeValue])

    const addRow = () => {
        let cellArr : Array<CustomCellModel> = JSON.parse(JSON.stringify(props.rows[0].cells))
        console.log(cellArr)
        let tempRows : CustomRowModel = {rowNum : props.rows.length, cells :  cellArr};
        for (let i = 0 ; i < tempRows.cells.length; i++){
            tempRows.cells[i].value = ""
        }

         props.setRows([...props.rows, tempRows])
          
    }
    const addCol = () => {
        let size = props.rows[0].cells.length
        console.log("add col")
        console.log(size)
        console.log(props.rows)
        props.rows.forEach(row => row.cells.push({colNum: size, value: "", transport:"" }))
        
        console.log(props.rows)
        props.setRows([...props.rows])
            
              
    }

    const removeRow = () => {
        props.rows.pop()

            props.setRows([...props.rows])
            
    }
    const removeCol = () => {
        let size = props.rows[0].cells.length
        props.rows.forEach(row => {
            row.cells.pop()
        })
        props.setRows([...props.rows])
        
            
    }
    const calculate = () => {
        props.setShouldCalculate(props.shouldCalculate*-1)
               
    }
    return( 

        <div className = "entryDiv" >
            <div className="tableEntryDiv">

                <div className="onlyTableEntryDiv">
                    <Form id="entryForm" style={{  maxWidth:"90vw" }}>
                        <Table id="entryTable"  bordered responsive hover size="sm" style={{ width: sizeString}}>
                            <tbody>
                                {props.rows.map((row) => (<CustomRow  key= {row.rowNum} row={row} setChangeValue={setChangeValue}/>))}
                            </tbody>
                        </Table>
                        <p style = {{color: "red"}}>{props.error}</p>
                    </Form>
                    
                </div>
                <div className="downButtonsDiv">
                    <Button id = "addRowButton" type="button" onClick={addRow}>
                    <i className="fas fa-plus-square"></i>
                    </Button>   
                    <Button id = "removeRowButton" type="button" onClick={removeRow}>
                    <i className="fas fa-minus-square"></i>
                    </Button>    
                    <Button variant="primary" id = "calculateRowButton"  onClick={calculate} type="button">
                                Calculate
                    </Button>
                   
                    
                </div>
            </div>
            <div className="addColumnDiv">
                    <Button 
                     id = "addColumnButton" type="button" onClick={addCol}>
                    <i className="fas fa-plus-square"></i>
                    </Button> 
                    <Button 
                     id = "removeColumnButton" type="button" onClick={removeCol}>
                    <i className="fas fa-minus-square"></i>
                    </Button> 
                
                <div className="">
                    <span></span>
                </div>
                
            </div>
        </div>
  
    )
}

export { Entrytable };