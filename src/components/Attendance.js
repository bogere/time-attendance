import React from "react";
import { 
    Card,CardTitle,CardText,Col,Row,
    Button
 } from "reactstrap";

import DataTable from 'react-data-table-component';


const columns = [
	{
		name: 'Student',
		selector: row => row.name,
		sortable: true,
	},
	// {
	// 	name: 'DeviceUserId',
	// 	selector: row => row.userId,
	// 	sortable: true,
	// },
    {
        name: 'Record Time',
        selector: row => row.recordTime,
        sortable:true
    },
    {
        name: 'IP trail',
        selector: row => row.ip,
        sortable: false
    }
];


const Attendance = (props)=>{
  return (
    <React.Fragment>
       <Row>
        <Col sm="12">
            <Button onClick={props.goBackButton} className = "primary">
                BACK           
            </Button>
            <Card body>
                <CardTitle tag="h5">View Student Attendance</CardTitle>
                <CardText>
                   View the students who are attended  in the system
                </CardText> 
            </Card>
        </Col>
    </Row>
    <Row>
        <Col sm = "12">
            <DataTable
			    columns={columns}
			    data={props.items}
		    />
        </Col>
    </Row>
</React.Fragment>
  )
}

export default Attendance