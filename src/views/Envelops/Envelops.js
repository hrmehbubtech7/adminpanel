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
import Primary from "components/Typography/Primary";


const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export default function Envelops(props) {
  const [alert, setAlert] = React.useState(null);
  const { authAxios } = React.useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [add, setAdd] = useState(false);
  const [addData, setAddData] = useState({ money: 0, userphone: '' });
  const [last_page, setLast_page] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalID, setModalID] = useState(0);
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
        const { data } = await authAxios.get(`/envelopes-admin/` + page).catch(err => {
          catchFunc(err);
        });
        setList(data.envelopes);
        setLast_page(parseInt(data.last_page));
      } catch (err) {
        catchFunc(err);
      }

    })();
  }, [page, refresh]);
  const classes = useStyles();

  const askRemove = (id) => () => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure remove this envelop data?"
        onConfirm={() => removeEnvelope(id)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
      >
        You will not be able to recover this envelope data!
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const removeEnvelope = async (id) => {
    try {
      const { data } = await authAxios.delete(`/envelopes-admin/${id}`).catch(err => {
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
  const postAddData = async () => {
    try {
      const { data } = await authAxios.post('/envelopes-admin', addData).catch(err => {
        catchFunc(err);
      });
      setAdd(false);
      setRefresh(!refresh);
    } catch (err) {
      catchFunc(err);
    }
  }
  return (
    <GridContainer>
      {alert}
      <Dialog
        classes={{
          root: classes.center + " " + classes.modalRoot,
          paper: classes.modal
        }}
        open={modal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setModal(false)}
        aria-labelledby="notice-modal-slide-title"
        aria-describedby="notice-modal-slide-description"
      >
        <DialogTitle
          id="notice-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          <Button
            justIcon
            className={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            color="transparent"
            onClick={() => setModal(false)}
          >
            <Close className={classes.modalClose} />
          </Button>
          <h4 className={classes.modalTitle}>Red Envelope</h4>
        </DialogTitle>
        {list[modalID] ?
          (
            <DialogContent
              id="notice-modal-slide-description"
              className={classes.modalBody}
            >
              <GridContainer>
                <GridItem md={12}>
                  <div style={{ height: "300px", overflow: "auto", width:"400px" }}>
                    {
                      list[modalID]?.awarding?.map((ele, key) => (
                        <>
                          <span>{" "}{ele.phone}</span>
                          <hr />
                        </>
                      ))
                    }
                  </div>
                </GridItem>
              </GridContainer>
            </DialogContent>

          ) : ''
        }
        <DialogActions
          className={
            classes.modalFooter + " " + classes.modalFooterCenter
          }
        >
          <Button
            onClick={() => setModal(false)}
            color="default"
            round
          >
            Close
                        </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        classes={{
          root: classes.center + " " + classes.modalRoot,
          paper: classes.modal
        }}
        open={add}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setAdd(false)}
        aria-labelledby="notice-modal-slide-title"
        aria-describedby="notice-modal-slide-description"
      >
        <DialogTitle
          id="notice-modal-slide-title1"
          disableTypography
          className={classes.modalHeader}
        >
          <Button
            justIcon
            className={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            color="transparent"
            onClick={() => setAdd(false)}
          >
            <Close className={classes.modalClose} />
          </Button>
          <h4 className={classes.modalTitle}>Add Envelope</h4>
        </DialogTitle>
        <DialogContent
          id="notice-modal-slide-description1"
          className={classes.modalBody}
        >
          <GridContainer>
            <GridItem lg={12}>
              <CustomInput
                labelText="Count"
                id="count"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "number",
                  value: addData.count,
                  onChange: (e) => {
                    setAddData({
                      ...addData, count: e.target.value
                    })
                  }
                }}
              />
            </GridItem>
            <GridItem lg={12}>
              <CustomInput
                labelText="Amount"
                id="amount"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "number",
                  value: addData.amount,
                  onChange: (e) => {
                    setAddData({
                      ...addData, amount: e.target.value
                    })
                  }
                }}
              />
            </GridItem>
          </GridContainer>
        </DialogContent>
        <DialogActions
          className={
            classes.modalFooter + " " + classes.modalFooterCenter
          }
        >
          <Button
            onClick={postAddData}
            color="info"
            round
          >
            O K
                        </Button>
        </DialogActions>
      </Dialog>

      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <AccountBalance />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Red Envelope</h4>
          </CardHeader>
          <CardBody>
            <Button color="success" onClick={() => { setAddData({ amount: '', count: '' }); setAdd(true) }}>New</Button>
            <Table
              tableHead={[
                "URL",
                "Count",
                "Amount",
                "Awarding",
                "Status",
                "CreatedBy",
                "Actions"
              ]}
              tableData={list.map((ele, key) => [
                "https://filippamall.com/envelope/" + ele._id,
                ele.count,
                ele.amount,
                ele.awarding.length,
                ele.status ? (<Success>Finished</Success>) : (<Primary>Doing</Primary>),
                ele.createdBy? ele.createdBy.phone : "",
                (
                  <>
                    <Button
                      color='primary'
                      justIcon
                      className={classes.actionButton}
                      onClick={() => { setModal(true); setModalID(key); }}
                    >
                      <Visibility className={classes.icon} />
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
                )
              ])}
              customCellClasses={[classes.center, classes.right, classes.right]}
              customHeadCellClasses={[
                classes.center,
                classes.right,
                classes.right
              ]}
            />
            <Pagination color="primary" count={last_page} page={page} onChange={(e, value) => setPage(value)} />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
