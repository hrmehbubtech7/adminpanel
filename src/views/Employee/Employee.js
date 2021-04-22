import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Group from "@material-ui/icons/Group";
import Remove from "@material-ui/icons/Remove";
import PersonAdd from "@material-ui/icons/PersonAdd";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { FetchContext } from "variables/authFetch";
import { useSnackbar } from 'notistack';
import styles from "assets/jss/material-dashboard-pro-react/views/employeeStyle.js";
import Swal from 'sweetalert2'
import product1 from "assets/img/product1.jpg";
import product2 from "assets/img/product2.jpg";
import product3 from "assets/img/product3.jpg";

const useStyles = makeStyles(styles);

export default function Employee() {
  const [employee, setEmployee] = React.useState([]);
  const { authAxios } = React.useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    (async () => {
      try{
        const { data } = await authAxios.get("/employee").catch(err => {
          if (err.response) {
            enqueueSnackbar(err.response.data.message, { variant: 'danger' });
  
          } else if (err.request) {
            enqueueSnackbar("Server is not responding", { variant: 'danger' });
            // client never received a response, or request never left
          } else {
            // anything else
            enqueueSnackbar("Server is not working", { variant: 'danger' });
          }
        });
        if (data) {
          setEmployee(data);
        }
      }catch(err){
        enqueueSnackbar("Server is not working", { variant: 'danger' });
      }
      
    })();

  }, []);

  const classes = useStyles();
  const addEmployee=async ()=>{
    const { value: formValues } = await Swal.fire({
      title: 'Add Employee',
      html:
        'username <input id="swal-input1" class="swal2-input">' +
        'Full Name <input id="swal-input2" class="swal2-input">'+
        'Password <input id="swal-input3" type="password" class="swal2-input">'+
        'Email <input id="swal-input4" class="swal2-input">'+
        'Phone Number <input id="swal-input5" class="swal2-input">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value,
          document.getElementById('swal-input4').value,
          document.getElementById('swal-input5').value
        ]
      }
    })
    
    if (formValues) {
      try{
        const { data } = await authAxios.post("/employee",{
          data:formValues
        }).catch(err => {
          if (err.response) {
            enqueueSnackbar(err.response.data.message, { variant: 'danger' });
  
          } else if (err.request) {
            enqueueSnackbar("Server is not responding", { variant: 'danger' });
            // client never received a response, or request never left
          } else {
            // anything else
            enqueueSnackbar("Server is not working", { variant: 'danger' });
          }
        });
        if (data) {
          setEmployee(data);
        }
      }catch(err){
        enqueueSnackbar("Server is not working", { variant: 'danger' });
      }
      
    }
  };
  const editEmployee=(key)=>async ()=>{
    const { value: formValues } = await Swal.fire({
      title: 'Edit Employee',
      html:
        'username <input id="swal-input1" value="'+employee[key].username+'" class="swal2-input">' +
        'Full Name <input id="swal-input2" value="'+employee[key].fullname+'" class="swal2-input">'+
        'Password <input id="swal-input3"  type="password" class="swal2-input">'+
        'Email <input id="swal-input4" value="'+employee[key].email+'" class="swal2-input">'+
        'Phone Number <input id="swal-input5" value="'+employee[key].phoneNumber+'" class="swal2-input">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value,
          document.getElementById('swal-input4').value,
          document.getElementById('swal-input5').value
        ]
      }
    })
    
    if (formValues) {
      try{
        const { data } = await authAxios.put("/employee/"+employee[key].id,{
          data:formValues
        }).catch(err => {
          if (err.response) {
            enqueueSnackbar(err.response.data.message, { variant: 'danger' });
  
          } else if (err.request) {
            enqueueSnackbar("Server is not responding", { variant: 'danger' });
            // client never received a response, or request never left
          } else {
            // anything else
            enqueueSnackbar("Server is not working", { variant: 'danger' });
          }
        });
        if (data) {
          setEmployee(data);
        }
      }catch(err){
        enqueueSnackbar("Server is not working", { variant: 'danger' });
      }
      
    }
  }
  const removeEmployee=(key)=>()=>{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "Do u really want to remove this item?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        try{
          const { data } = await authAxios.delete("/employee/"+employee[key].id).catch(err => {
            if (err.response) {
              swalWithBootstrapButtons.fire(
                'Cancelled',
                err.response.data.message,
                'error'
              )
    
            } else if (err.request) {
              swalWithBootstrapButtons.fire(
                'Cancelled',
                "Server is not responding",
                'error'
              )
              // client never received a response, or request never left
            } else {
              // anything else
              swalWithBootstrapButtons.fire(
                'Cancelled',
                "Server is not working",
                'error'
              )
            }
          });
          if (data) {
            setEmployee(data);
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Employee data has been deleted.',
              'success'
            )
          }
        }catch(err){
          console.log(err)
          enqueueSnackbar("Server is not working", { variant: 'danger' });
        }
        
        
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Data is safe :)',
          'error'
        )
      }
    })
  }
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Group />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Employee Table <Button onClick={addEmployee} className={classes.titleButton} justIcon  link size="sm"><PersonAdd /></Button></h4>
          </CardHeader>
          <CardBody>
            <Table
              striped
              tableHead={[
                "#",
                "Role",
                "Username",
                "Full Name",
                "Email",
                "Phone Number",
                "Actions"
              ]}
              tableData={
                employee.map((ele, key) => [
                  key + 1,
                  ele.role,
                  ele.username,
                  ele.fullname,
                  ele.email,
                  ele.phoneNumber,
                  [
                    <Button
                      color="success"
                      simple
                      className={classes.actionButton}
                      onClick={editEmployee(key)}
                      key="0"
                    >
                      <Edit className={classes.icon} />
                    </Button>,
                    <Button
                    color="danger"
                    simple
                    className={classes.actionButton}
                    onClick={removeEmployee(key)}
                    key="1"
                  >
                    <Close className={classes.icon} />
                  </Button>

                  ]
                ])
              }
              customCellClasses={[classes.center, classes.right, classes.right]}
              customClassesForCells={[0, 4, 5]}
              customHeadCellClasses={[
                classes.center,
                classes.right,
                classes.right
              ]}
              customHeadClassesForCells={[0, 4, 5]}
            />
          </CardBody>
        </Card>
      </GridItem>

    </GridContainer>
  );
}
