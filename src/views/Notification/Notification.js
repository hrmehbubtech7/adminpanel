import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Visibility from "@material-ui/icons/Visibility";
import Close from "@material-ui/icons/Close";
import NotificationImportant from "@material-ui/icons/NotificationImportant";
import Remove from "@material-ui/icons/Remove";
import AddAlert from "@material-ui/icons/AddAlert";
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
import styles from "assets/jss/material-dashboard-pro-react/views/notificationStyle.js";
import Swal from 'sweetalert2'

const useStyles = makeStyles(styles);

export default function Notification() {
  const catchFunc = (err) => {
    if (err.response) {
      enqueueSnackbar(err.response.data.message, { variant: 'danger' });

    } else if (err.request) {
      enqueueSnackbar("Server is not responding", { variant: 'danger' });
      // client never received a response, or request never left
    } else {
      // anything else
      enqueueSnackbar("Server is not working", { variant: 'danger' });
    }
  };
  const [notification, setNotification] = React.useState([]);
  const { authAxios } = React.useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    (async () => {
      try{
        const { data } = await authAxios.get("/notification");
        if (data) {
          setNotification(data);
        }
      }catch(err){
        catchFunc(err)
      }
      
    })();

  }, []);

  const classes = useStyles();
  const showNotification=async (id)=>{
    Swal.fire(
      notification[id].title,
      notification[id].content
    )
  }
  const addNotification=async ()=>{
    const { value: formValues } = await Swal.fire({
      title: 'Add Notification',
      html:
        'title: <input id="swal-input1" class="swal2-input">' +
        'content: <textArea id="swal-input2" rows=4 class="swal2-input"></textArea>',
      
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
      
        ]
      }
    })
    
    if (formValues) {
      try{
        const { data } = await authAxios.post("/notification",{
          data:formValues
        });      
        if (data) {
          setNotification(data);
        }
      }catch(err){
        catchFunc(err);
      }
      
    }
  };
  
  const removeNotification=(key)=>()=>{

    
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to remove this item?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        try{
          const { data } = await authAxios.delete("/notification/"+notification[key].id);
          if (data) {
            setNotification(data);
            Swal.fire(
              'Deleted!',
              'Notification data has been deleted.',
              'success'
            )
          }
        }catch(err){
          catchFunc(err);
        }
        
        
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
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
              <NotificationImportant />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Notification Table <Button onClick={addNotification} className={classes.titleButton} justIcon  link size="sm"><AddAlert /></Button></h4>
          </CardHeader>
          <CardBody>
            <Table
              striped
              tableHead={[
                "#",
                "Author",
                "Title",               
                "Actions"
              ]}
              tableData={
                notification.map((ele, key) => [
                  key + 1,
                  ele.author.username,
                  ele.title,                
                  [
                    <Button
                      color="success"
                      simple
                      className={classes.actionButton}
                      onClick={()=>showNotification(key)}
                      key={key}
                    >
                      <Visibility className={classes.icon} />
                    </Button>,
                    <Button
                    color="danger"
                    simple
                    className={classes.actionButton}
                    onClick={removeNotification(key)}
                    key={key}
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
