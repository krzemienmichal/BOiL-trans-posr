import React from "react";
import {SyntheticEvent, useState} from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import {Row, Table} from 'react-bootstrap'
import TransportCell from '../modules/TransportCell'
import CustomRowModel from '../modules/CustomRowModel'
import CustomCellModel from '../modules/CustomCellModel'
import ChangeValueModel from '../modules/ChangeValueModel'
import {CustomCell} from './CustomCell'

import '../styling/entrytable.css'
const CustomRow = (props: {row: CustomRowModel ,setChangeValue:(t:ChangeValueModel) => void}) => {
    return( 
    
        <tr id="rowTable">
        {props.row.cells.map((cel) => (<CustomCell  key= {cel.colNum} cell={cel} rowNumber = {props.row.rowNum} setChangeValue={props.setChangeValue}/>))}
        </tr>
        
    )
}

export { CustomRow};