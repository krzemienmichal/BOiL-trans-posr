import React from "react";
import {SyntheticEvent, useState} from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import {Row,Form, Table} from 'react-bootstrap'
import TransportCell from '../modules/TransportCell'
import CustomRowModel from '../modules/CustomRowModel'
import CustomCellModel from '../modules/CustomCellModel'
import ChangeValueModel from '../modules/ChangeValueModel'
import '../styling/entrytable.css'

const CustomCell = (props: { cell: CustomCellModel, rowNumber:number , setChangeValue:(t:ChangeValueModel) => void}) => {
    const handleChange = async (e: any)=> {
        var str: string = e.target.value

        props.setChangeValue({rowNum: props.rowNumber, colNum: props.cell.colNum, value:str})

    }
    return( 
        
        <td className="cellTable">
            <Form.Group className="mb-3" controlId="formInput">
                <Form.Control id="cellTableInput" size ='sm' type="text" placeholder = { props.cell.value}  onChange={(e) => {handleChange(e)}}/>
            </Form.Group>
        </td>
        
    )
}

export {CustomCell};