import React from "react";
import { 
    Card,CardBody,CardTitle,CardText,ListGroup, 
    ListGroupItem, CardLink, Button,Col,Row  } from "reactstrap";

const MenuButton = (props)=>{
  return (
    <React.Fragment>
    <Row>
        <Col sm="6">
            <Card body>
                <CardTitle tag="h5">Enroll Students</CardTitle>
                <CardText>
                   Register the students who are enrolled in attendance machine
                </CardText>
                <Button onClick={props.startEnrollment}>
                   ENROLL NOW            
                </Button>
            </Card>
        </Col>
        <Col sm="6">
            <Card body>
                <CardTitle tag="h5">
                    Record Attendance
                </CardTitle>
                <CardText>
                   Record the attendance data from the attendance machine
                </CardText>
                <Button onClick={props.registerAttendance}>
                    START NOW
                </Button>
            </Card>
        </Col>
    </Row>
    <Row>
    <Col sm="6">
        <Card body>
            <CardTitle tag="h5">View Students</CardTitle>
            <CardText>
               View the enrolled students in the system
            </CardText>
            <Button onClick={props.getAllEnrolledStudents}>
               VIEW STUDENTS          
            </Button>
        </Card>
    </Col>
    <Col sm="6">
        <Card body>
            <CardTitle tag="h5">
                View Attendance
            </CardTitle>
            <CardText>
               View  the attendance data from the attendance machine
            </CardText>
            <Button onClick={props.getAllAttendance}>
                VIEW NOW
            </Button>
        </Card>
    </Col>
</Row>
</React.Fragment>
  )
}

export default MenuButton