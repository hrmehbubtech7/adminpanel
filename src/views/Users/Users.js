import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import People from "@material-ui/icons/People";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import ReactTable from "components/ReactTable/ReactTable.js";
import { FetchContext } from "variables/authFetch";
import { useSnackbar } from 'notistack';
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import CustomInput from "components/CustomInput/CustomInput.js";

import Primary from "components/Typography/Primary.js";
import Info from "components/Typography/Info.js";
import Success from "components/Typography/Success.js";
import Warning from "components/Typography/Warning.js";
import Danger from "components/Typography/Danger.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import CircularProgress from '@material-ui/core/CircularProgress';
import { AirlineSeatIndividualSuiteRounded } from "@material-ui/icons";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import modalStyle from "assets/jss/material-dashboard-pro-react/modalStyle.js";

const styles = theme => ({
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  },
  modalSectionTitle: {
    marginTop: "30px"
  },
  ...modalStyle(theme)
});

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export default function Users() {
  const { authAxios } = React.useContext(FetchContext);
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = React.useState([]);
  const [addModal, setAddModal] = React.useState(false);
  const [addUser, setAddUser] = React.useState({
    role: 'User', phone: '', password: '', referral: ''
  })
  const [reload,setReload]=React.useState(false);
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
        const { data } = await authAxios.get("/users").catch(err => {
          catchFunc(err);
        });
        setUsers(
          data.map((prop, key) => {
            return {
              id: key,
              phone: prop.phone,
              role: prop.superAdmin ? 'Super Admin' : (prop.admin ? 'Admin' : 'User'),
              email: prop.email,
              balance: prop.budget,
              actions: (
                // we've added some custom button actions                  
                <div className="actions-right">
                  <Button
                    justIcon
                    round
                    simple
                    onClick={() => {
                      window.open(
                        '/admin/user/' + prop.id,
                        '_blank' // <- This is what makes it open in a new window.
                      );
                    }}
                    color="warning"
                    className="edit"
                  >
                    <Dvr />
                  </Button>{" "}

                </div>
              )
            };
          })
        );
      } catch (err) {
        console.log(err)
        catchFunc(err);
      }
    })();
  }, [reload]);
  const postAddUser=async ()=>{
    try {
      const {data} =await authAxios.post(`/add-user/`,addUser).catch((err) => {
        catchFunc(err);
      });    
      setReload(!reload);
      enqueueSnackbar("User added", { variant: 'success' });
      setAddModal(false);
    } catch (err) {
      catchFunc(err);
    }
  }
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="primary" icon>
            <CardIcon color="primary">
              <People />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Users</h4>
          </CardHeader>
          <CardBody>
            <Button color="primary" onClick={() => { setAddUser({ role: 'User', phone: '', password: '', referral: '' }); setAddModal(true) }}>Create a New account</Button>
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal
              }}
              open={addModal}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setAddModal(false)}
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
                  onClick={() => setAddModal(false)}
                >
                  <Close className={classes.modalClose} />
                </Button>
                <h4 className={classes.modalTitle}>Add User</h4>
              </DialogTitle>
              <DialogContent
                id="notice-modal-slide-description"
                className={classes.modalBody}
              >
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        Role
                        </InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={addUser.role}
                        onChange={(e) => setAddUser({
                          ...addUser,
                          role: e.target.value
                        })}
                        inputProps={{
                          name: "simpleSelect",
                          id: "simple-select"
                        }}
                      >
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="Super Admin"
                        >
                          Super Admin
                          </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="Admin"
                        >
                          Admin
                          </MenuItem>
                        <MenuItem
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value="User"
                        >
                          User
                          </MenuItem>
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem lg={12}>
                    <CustomInput
                      labelText="Phone"
                      id="phone"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        value: addUser.phone,
                        onChange: (e) => { setAddUser({
                          ...addUser, phone:e.target.value
                        }) }
                      }}
                    />
                  </GridItem>
                  <GridItem lg={12}>
                    <CustomInput
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        value: addUser.password,
                        onChange: (e) => { setAddUser({
                          ...addUser, password:e.target.value
                        }) }
                      }}
                    />
                  </GridItem>
                  <GridItem lg={12}>
                    <CustomInput
                      labelText="Referral code"
                      id="referral"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        value: addUser.referral,
                        onChange: (e) => { setAddUser({
                          ...addUser, referral:e.target.value
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
                  onClick={postAddUser}
                  color="info"
                  round
                >
                  O K
                        </Button>
              </DialogActions>
            </Dialog>
            {
              users.length ? (
                <ReactTable
                  columns={[
                    {
                      Header: "Phone",
                      accessor: "phone"
                    },
                    {
                      Header: "Role",
                      accessor: "role"
                    },
                    {
                      Header: "Email",
                      accessor: "email"
                    },
                    {
                      Header: "Balance",
                      accessor: "balance"
                    },
                    {
                      Header: "Actions",
                      accessor: "actions"
                    }
                  ]}
                  data={users}
                />
              ) : (
                  <div style={{ textAlign: "center" }} >
                    <CircularProgress />
                  </div>
                )
            }

          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
