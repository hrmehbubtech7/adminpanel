import React,{useState,useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Pagination from '@material-ui/lab/Pagination';

// material-ui icons
import CardGiftcard from "@material-ui/icons/CardGiftcard";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { FetchContext } from "variables/authFetch";
import { useSnackbar } from 'notistack';
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

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";

import product1 from "assets/img/product1.jpg";
import product2 from "assets/img/product2.jpg";
import product3 from "assets/img/product3.jpg";

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export default function Rewards(props) {
  const [alert, setAlert] = React.useState(null);

  const { authAxios } = React.useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [add, setAdd] = useState(false);
  const [addData, setAddData] = useState({ money: 0, userphone: '' });
  const [page, setPage] = useState(1);
  const [last_page, setLast_page] = useState(1);
  const [refresh, setRefresh]=useState(false);
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

  const askRemove = (id)=>() => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure remove this reward data?"
        onConfirm={() => deleteReward(id)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
      >
        You will not be able to recover this reward data!
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const deleteReward=async (id)=>{
    try{
      const {data}=await authAxios.delete("/reward/"+id).catch(err=>{
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
    }catch(err){
      catchFunc(err);
    }
      
      
    
 
  };
  const postAddData=async ()=>{
    try{
      const {data}=await authAxios.post('/reward',addData).catch(err=>{
        catchFunc(err);
      });
      setAdd(false);
      setRefresh(!refresh);
    }catch(err){
      catchFunc(err);
    }
  }
  useEffect(() => {
    (async () => {
      try {
        const { data } = await authAxios.get("/rewards/" + page).catch(err => {
          catchFunc(err);
        });
        await setList(data.rewards);
        await setLast_page(data.last_page);
      } catch (err) {
        catchFunc(err);
      }

    })();
  }, [page,refresh]);
  const classes = useStyles();


  return (
    <GridContainer>
      {alert}
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <CardGiftcard />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Rewards</h4>
          </CardHeader>
          <CardBody>
            <Button color="success" onClick={() => { setAddData({ money: '', userphone: ''}); setAdd(true) }}>New</Button>
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
                  onClick={() => setAdd(false)}
                >
                  <Close className={classes.modalClose} />
                </Button>
                <h4 className={classes.modalTitle}>Add Reward</h4>
              </DialogTitle>
              <DialogContent
                id="notice-modal-slide-description"
                className={classes.modalBody}
              >
                <GridContainer>
                  <GridItem lg={12}>
                    <CustomInput
                      labelText="Phone"
                      id="phone"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        value: addData.userphone,
                        onChange: (e) => { setAddData({
                          ...addData, userphone:e.target.value
                        }) }
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
                        value: addData.money,
                        onChange: (e) => { setAddData({
                          ...addData, money:e.target.value
                        }) }
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

            <Table
              tableHead={[
                "Url",
                "Amount",
                "Phone",
                "By",
                "Actions"
              ]}
              tableData={list.map(ele => [
                `https://axisclubs.com/api/rewards/${ele._id}`,
                ele.money,
                ele.userphone,
                ele.createdBy?.phone,
                !ele.status ? (
                  <Button
                    color='danger'
                    simple
                    className={classes.actionButton}
                    onClick={askRemove(ele._id)}
                  >
                    <Close className={classes.icon} />
                  </Button>
                ) : ""
              ])}
              customCellClasses={[classes.center, classes.right, classes.right]}
              customHeadCellClasses={[
                classes.center,
                classes.right,
                classes.right
              ]}
            />
            <Pagination color="primary" count={last_page} page={page} onChange={(e,value)=>setPage(value)} />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
