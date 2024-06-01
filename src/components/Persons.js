import React from "react";
import { 
    Card,CardTitle,CardText, Col,Row,
    Button  
} from "reactstrap";

import DataTable from 'react-data-table-component';


const columns = [
	{
		name: 'Student Names',
		selector: row => row.name,
		sortable: true,
	},
	{
		name: 'DeviceUserId',
		selector: row => row.userId,
		sortable: true,
	},
    {
        name: 'Class',
        selector: row => row.classId,
        sortable:true
    },
    {
        name: 'Student No',
        selector: row => row.student_no,
        sortable: false
    }
];


const Persons = (props)=>{
  return (
    <React.Fragment>
       <Row>
        <Col sm="12">
             <Button onClick={props.goBackButton} className = "primary">
                BACK           
            </Button>
            <Card body>
                <CardTitle tag="h5">View Enrolled Students</CardTitle>
                <CardText>
                   View the students who are enrolled  in the system
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

export default Persons