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
    const [marginLeftString, setMarginLeftString] = useState<string>("0%")
    const [marginRightString, setMarginRightString] = useState<string>("100%")
    const [marginString, setMarginString] = useState<string>("")
    const [fontSize, setFontSize] = useState<string>("25px")
  
    
    return( 
        
        <td className="cellResultTable">
         <h5 style={{fontSize: "20px", textAlign: "center", }}> {props.cell.transport} </h5>
        </td>
        
    )
}

export {CustomCell};