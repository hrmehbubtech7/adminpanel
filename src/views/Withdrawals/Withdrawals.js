import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Pagination from '@material-ui/lab/Pagination';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
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
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Success from "components/Typography/Success.js";
import Primary from "components/Typography/Primary.js";

import Warning from "components/Typography/Warning.js";
import product1 from "assets/img/product1.jpg";
import product2 from "assets/img/product2.jpg";
import product3 from "assets/img/product3.jpg";
import {
  AccountBalanceWallet,
  HourglassEmpty,
  SmsFailed,
  HighlightOff,
  AssignmentTurnedIn
} from "@material-ui/icons";
const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export default function Withdrawals(props) {
  const [status, setStatus] = useState(-1);
  const [alert, setAlert] = React.useState(null);
  const { authAxios } = React.useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalID, setModalID] = useState(0);
  const [page, setPage] = useState(1);
  const [last_page, setLast_page] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [repliedText, setRepliedText] = useState('');
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

  const showComplaint = (id) => () => {
    setModalID(id);
    setModal(true);
  }
  const postWithdrawal = (status) => async () => {
    try {
      const { data } = await authAxios.post('/withdrawl-admin', {
        id: list[modalID]._id,
        status
      }).catch(err => {
        catchFunc(err);
      });
      setModal(false);
      setRefresh(!refresh);
    } catch (err) {
      catchFunc(err);
    }
  }
  useEffect(() => {
    (async () => {
      try {
        const { data } = await authAxios.get(`/withdrawl-admin/${status}/` + page).catch(err => {
          catchFunc(err);
        });
        setList(data.data);
        setLast_page(parseInt(data.last_page));
      } catch (err) {
        catchFunc(err);
      }

    })();
  }, [status, page, refresh]);
  const classes = useStyles();


  return (
    <GridContainer>
      {alert}
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <AccountBalance />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Withdrawals</h4>
          </CardHeader>
          <CardBody>
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
                <h4 className={classes.modalTitle}>Withdrawal Information - {list[modalID]?.userPhone}</h4>
              </DialogTitle>
              {list[modalID] ?
                (
                  <DialogContent
                    id="notice-modal-slide-description"
                    className={classes.modalBody}
                  >
                    <GridContainer>
                      <GridItem xs={12}>
                        <TextField
                          label="Order ID"
                          multiline
                          style={{ width: '100%' }}
                          rowsMax={4}
                          value={list[modalID]._id}
                          variant="outlined"
                          disabled
                        />
                        <br />
                        <br />
                      </GridItem>
                      <GridItem xs={12}>
                        <TextField
                          label="Status"
                          multiline
                          style={{ width: '100%' }}
                          rowsMax={4}
                          value={list[modalID].status == 1 ? 'Approved' : (
                            list[modalID].status == 0 ? 'Waiting' : (
                              list[modalID].status == 2 ? 'Declined' : (
                                list[modalID].status == 3 ? 'Completed' : 'Failed'
                              )
                            )
                          )}
                          variant="outlined"
                          disabled
                        />
                        <br />
                        <br />
                      </GridItem>
                      <GridItem xs={12}>
                        <TextField
                          label="Amount"
                          multiline
                          style={{ width: '100%' }}
                          rowsMax={4}
                          value={list[modalID].order_amount}
                          variant="outlined"
                          disabled
                        />
                        <br />
                        <br />
                      </GridItem>
                      <GridItem xs={12}>
                        <TextField
                          label="Bank Name"
                          multiline
                          style={{ width: '100%' }}
                          rowsMax={4}
                          value={list[modalID].bank_code}
                          variant="outlined"
                          disabled
                        />
                        <br />
                        <br />
                      </GridItem>
                      <GridItem xs={12}>
                        <TextField
                          label="Province"
                          multiline
                          style={{ width: '100%' }}
                          rowsMax={4}
                          value={list[modalID].province}
                          variant="outlined"
                          disabled
                        />
                        <br />
                        <br />
                      </GridItem>
                      <GridItem xs={12}>
                        <TextField
                          label="Account No"
                          multiline
                          style={{ width: '100%' }}
                          rowsMax={4}
                          value={list[modalID].acc_no}
                          variant="outlined"
                          disabled
                        />
                        <br />
                        <br />
                      </GridItem>
                      <GridItem xs={12}>
                        <TextField
                          label="Account Name"
                          multiline
                          style={{ width: '100%' }}
                          rowsMax={4}
                          value={list[modalID].acc_name}
                          variant="outlined"
                          disabled
                        />
                        <br />
                        <br />
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
                <div>
                <Button
                  onClick={() => props.history.push('/admin/user/' + list[modalID].userId)}
                  color="info"
                  round
                >
                  User Info
                  </Button>
                <Button
                  onClick={() => setModal(false)}
                  color="default"
                  round
                >
                  Close
                        </Button>
                </div>
                
                {list[modalID]?.status == 0 ? (
                  <div>
                    <Button
                      onClick={postWithdrawal(1)}
                      color="primary"
                      round
                    >
                      Approve
                  </Button>
                    <Button
                      onClick={postWithdrawal(2)}
                      color="warning"
                      round
                    >
                      Decline
                  </Button>
                  </div>
                ) : ''}
                <br />
                <br />
                {list[modalID]?.status == 0 || list[modalID]?.status == 1 ? (
                  <div>
                    <Button
                      onClick={postWithdrawal(3)}
                      color="success"
                      round
                    >
                      Completed
                  </Button>
                    <Button
                      onClick={postWithdrawal(4)}
                      color="danger"
                      round
                    >
                      Failed
                  </Button>
                  </div>
                ) : ''}

              </DialogActions>
            </Dialog>
            <FormControl
              fullWidth
              className={classes.selectFormControl}
              style={{ width: '200px' }}
            >
              <InputLabel
                htmlFor="simple-select"
                className={classes.selectLabel}
              >
                Status
                        </InputLabel>
              <Select
                MenuProps={{
                  className: classes.selectMenu
                }}
                classes={{
                  select: classes.select
                }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                inputProps={{
                  name: "simpleSelect",
                  id: "simple-select",
                }}
              >
                <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem
                  }}
                >
                  Choose Status
                          </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="-1"
                >
                  All
                          </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="0"
                >
                  Waiting
                          </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="1"
                >
                  Succeed
                          </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="2"
                >
                  Declined
                          </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="3"
                >
                  Completed
                          </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="4"
                >
                  Failed
                          </MenuItem>

              </Select>
            </FormControl>

            <Table
              tableHead={[
                'Date',
                "User",
                "Amount",
                "OrderID",
                "Status",
                "Actions"
              ]}
              tableData={list.map((ele, key) => [
                ele.createdAt,
                ele.userPhone,
                ele.money,
                ele._id,
                ele.status == 1 ? (<Primary ><AssignmentTurnedIn title="Succeed" /></Primary>) : (
                  ele.status == 0 ? (
                    <Warning><HourglassEmpty /></Warning>
                  ) : (
                      ele.status == 2 ? (
                        <Danger><HighlightOff /></Danger>
                      ) : (ele.status == 3 ? (
                        <Success><AccountBalanceWallet title="Succeed" /></Success>
                      ) : (
                          <Danger><SmsFailed /></Danger>
                        )
                        )
                    )
                ),
                (
                  <Button
                    color='danger'
                    justIcon
                    className={classes.actionButton}
                    onClick={showComplaint(key)}
                  >
                    <Visibility className={classes.icon} />
                  </Button>
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
