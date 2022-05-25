import React from "react";
import {SyntheticEvent, useEffect, useState} from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import {Row, Form, Button, Table} from 'react-bootstrap'
import TransportCell from '../modules/TransportCell'
import CustomRowModel from '../modules/CustomRowModel'
import CustomCellModel from '../modules/CustomCellModel'
import ChangeValueModel from '../modules/ChangeValueModel'
import {CustomRow} from './CustomRowFinalTable'
import '../styling/finaltable.css'
const FinalTable = (props: { rows: Array<CustomRowModel>}) => {
    
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

      
    return( 

        <div className = "finalDiv" >
            <div className="tableFinalDiv" style={{ width: sizeString }}>
                    
                <Table id="finalTable"  bordered responsive hover size="sm"  >
                    <tbody>
                        {props.rows.map((row) => (<CustomRow  key= {row.rowNum} row={row} />))}
                    </tbody>
                </Table>
                  
            </div>

        </div>
  
    )
}

export { FinalTable };