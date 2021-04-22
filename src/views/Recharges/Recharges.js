import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Pagination from '@material-ui/lab/Pagination';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import {
  AccountBalanceWallet,
  HourglassEmpty,
  SmsFailed,
  AssignmentTurnedIn,
  DeleteForever
} from "@material-ui/icons";
import Visibility from "@material-ui/icons/Visibility";
import Close from "@material-ui/icons/Close";
import AccountBalance from "@material-ui/icons/AccountBalance";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { FetchContext } from "variables/authFetch";
import { useSnackbar } from 'notistack';
import Danger from "components/Typography/Danger.js";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import CustomInput from "components/CustomInput/CustomInput.js";
import SweetAlert from "react-bootstrap-sweetalert";
import TextField from '@material-ui/core/TextField';
import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import Success from "components/Typography/Success.js";
import Warning from "components/Typography/Warning.js";


const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export default function Recharges(props) {
  const [alert, setAlert] = React.useState(null);
  const { authAxios } = React.useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [last_page, setLast_page] = useState(1);
  const [refresh, setRefresh] = useState(false);
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
  useEffect(() => {
    (async () => {
      try {
        const { data } = await authAxios.get(`recharge-admin/` + page).catch(err => {
          catchFunc(err);
        });
        setList(data.data);
        setLast_page(parseInt(data.last_page));
      } catch (err) {
        catchFunc(err);
      }

    })();
  }, [page, refresh]);
  const classes = useStyles();
  const approveRecharge= (id)=>async ()=>{
    try {
      const { data } = await authAxios.post(`recharge-admin/`,{
        id, status:1
      }).catch(err => {
        catchFunc(err);
      });
      setRefresh(!refresh);
    } catch (err) {
      catchFunc(err);
    }
  }
  const askRemove = (id)=>() => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure remove this recharge data?"
        onConfirm={() => removeRecharge(id)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
      >
        You will not be able to recover this recharge data!
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const removeRecharge=async (id)=>{
    try {
      const { data } = await authAxios.post(`recharge-admin/`,{
        id, status:-1
      }).catch(err => {
        catchFunc(err);
      });
      setRefresh(!refresh);
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Deleted!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={classes.button + " " + classes.success}
        >
          Deleted successfully!
        </SweetAlert>
      );
    } catch (err) {
      catchFunc(err);
    }
  };
  console.log(page)
  return (
    <GridContainer>
      {alert}
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <AccountBalance />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Recharges</h4>
          </CardHeader>
          <CardBody>            
            <Table
              tableHead={[
                '#',
                'Date',
                "User",
                "Amount",
                "OrderID",
                "Status",
                "Actions"
              ]}
              tableData={list.map((ele, key) => [
                (key + 1),
                ele.createdAt,
                ele.userPhone,
                ele.money,
                ele.orderID,
                ele.status == 1 ? (<Success><AccountBalanceWallet /></Success>) : (
                  ele.status == 0 ? (
                    <Warning><HourglassEmpty /></Warning>
                  ) : (
                      <Danger><SmsFailed /></Danger>
                    )
                ),
                ele.status == 0 ? (
                  <>
                    <Button
                      color='primary'
                      justIcon
                      className={classes.actionButton}
                      onClick={approveRecharge(ele._id)}
                    >
                      <AssignmentTurnedIn className={classes.icon} />
                    </Button>
                    <Button
                      color='danger'
                      justIcon
                      className={classes.actionButton}
                      onClick={askRemove(ele._id)}
                    >
                      <DeleteForever className={classes.icon} />
                    </Button>
                  </>
                ) : (
                    ele.status == -1 ? (
                      <Button
                        color='danger'
                        justIcon
                        className={classes.actionButton}
                        onClick={askRemove(ele._id)}
                      >
                        <DeleteForever className={classes.icon} />
                      </Button>
                    ) : ''
                )
              ])}
              customCellClasses={[classes.center, classes.right, classes.right]}
              customHeadCellClasses={[
                classes.center,
                classes.right,
                classes.right
              ]}
            />
            <Pagination color="primary" count={last_page} page={page} onChange={(e,value) => setPage(value)} />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
