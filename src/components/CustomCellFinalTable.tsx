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
    useEffect(() =>{
        if(props.cell !==null)
        {
        let num = props.cell.transport.length;
        let size =  num===0 ? 0 :45;
        let size2 = 100-size;
        let MarginLeftString  = size.toString()+'%'
        let MarginRightString = size2.toString()+'%'
        let MarginString = ''
        let value:number =parseInt((props.cell.value))
        var FontSize = "14px" 
        if(size !==0){
          FontSize = "20px"
        }
        if(Number.isInteger(value)===false){
          MarginLeftString = ''
          MarginRightString = ''
          FontSize = "20px"
          MarginString = "auto"
        }
        
        setMarginLeftString(MarginLeftString)
        setMarginRightString(MarginRightString)
        setFontSize(FontSize)
        setMarginString(MarginString)
        }
        
      },[props.cell])
    
    return( 
        
        <td className="cellTable">
          <sup id="upperIndex" > <h5 style={{fontSize: 17}}>{props.cell.value} </h5></sup>  <h5 style={{marginLeft: marginLeftString,
             marginRight: marginRightString, fontSize: fontSize, margin:marginString}}> {props.cell.transport} </h5>
        </td>
        
    )
}

export {CustomCell};