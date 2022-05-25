import React from "react";
import {SyntheticEvent, useState, useEffect} from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import {Row,Form, Table} from 'react-bootstrap'
import TransportCell from '../modules/TransportCell'
import CustomRowModel from '../modules/CustomRowModel'
import CustomCellModel from '../modules/CustomCellModel'
import ChangeValueModel from '../modules/ChangeValueModel'
import '../styling/finaltable.css'

const CustomCell = (props: { cell: CustomCellModel, rowNumber:number }) => {
    const [marginString, setMarginString] = useState<string>("0%")
    useEffect(() =>{
        if(props.cell !==null)
        {
        let num = props.cell.transport.length;
        let size =  num===0 ? 0 :35;
        let MarginString  = size.toString()+'%'
        setMarginString(MarginString)
        }
        
      },[props.cell])
    
    return( 
        
        <td className="cellTable">
          <sup id="upperIndex" > <h5>{props.cell.transport} </h5></sup>  <h5 style={{marginLeft: marginString}}> {props.cell.value} </h5>
        </td>
        
    )
}

export {CustomCell};