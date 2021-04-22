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
import Check from "@material-ui/icons/Check";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import LiveHelp from "@material-ui/icons/LiveHelp";
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

import TextField from '@material-ui/core/TextField';
import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";

import product1 from "assets/img/product1.jpg";
import product2 from "assets/img/product2.jpg";
import product3 from "assets/img/product3.jpg";

const useStyles = makeStyles(styles);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export default function Complaints(props) {
  const [replied, setReplied] = useState(false);
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
  const postRepliedText = async () => {
    try {
      const { data } = await authAxios.post('/complaints-admin', {
        id: list[modalID]._id,
        reply: repliedText
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
        const { data } = await authAxios.get(`complaints-admin/${replied ? 1 : 0}/` + page).catch(err => {
          catchFunc(err);
        });
        setList(data.data);
        setLast_page(parseInt(data.last_page));
      } catch (err) {
        catchFunc(err);
      }

    })();
  }, [replied, page, refresh]);
  const classes = useStyles();


  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <LiveHelp />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Complaints & suggestions</h4>
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
                <h4 className={classes.modalTitle}>{list[modalID]?.category}</h4>
              </DialogTitle>
              {list[modalID] ?
                (
                  <DialogContent
                    id="notice-modal-slide-description"
                    className={classes.modalBody}
                  >
                    <GridContainer>

                      <GridItem xs={12} md={4}>
                        <TextField
                          label="Sender"
                          multiline
                          style={{ width: '100%' }}
                          rowsMax={4}
                          value={list[modalID].user.phone}
                          variant="outlined"
                          disabled
                        />
                        <br />
                        <br />
                      </GridItem>
                      <GridItem xs={12} md={4}>
                        <TextField
                          label="Period"
                          multiline
                          style={{ width: '100%' }}
                          rowsMax={4}
                          value={list[modalID].period}
                          variant="outlined"
                          disabled
                        />
                        <br />
                        <br />
                      </GridItem>
                      <GridItem xs={12} md={4}>
                        <TextField
                          label="Whatsapp number"
                          multiline
                          style={{ width: '100%' }}
                          rowsMax={4}
                          value={list[modalID].whatsapp}
                          variant="outlined"
                          disabled
                        />
                        <br />
                        <br />
                      </GridItem>

                      <GridItem lg={12} xs={12}>
                      
                        <TextField
                          label="Content"
                          multiline
                          style={{ width: '100%' }}
                          rowsMax={4}
                          value={list[modalID].content}
                          variant="outlined"
                          disabled
                        />
                        <br />
                        <br />


                        {
                          list[modalID]?.status ? (
                            <TextField
                              label="Replied Text"
                              multiline
                              style={{ width: '100%' }}
                              rowsMax={4}
                              value={list[modalID].reply}
                              variant="outlined"
                              disabled
                            />
                          ) : (
                              <TextField
                                label="Replied Text"
                                multiline
                                style={{ width: '100%' }}

                                rowsMax={4}
                                value={repliedText}
                                onChange={(e) => { setRepliedText(e.target.value) }}
                                variant="outlined"
                              />
                            )
                        }


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
                {!list[modalID]?.status ? (
                  <Button
                  onClick={postRepliedText}
                  color="info"
                  round
                >
                  O K
                        </Button>
                ) : ''}
                
                <Button
                  onClick={() => setModal(false)}
                  color="default"
                  round
                >
                  Close
                        </Button>
              </DialogActions>
            </Dialog>
            <FormControlLabel
              control={
                <Switch
                  checked={replied}
                  onChange={(e) => setReplied(e.target.checked)}
                  value="replied"
                  classes={{
                    switchBase: classes.switchBase,
                    checked: classes.switchChecked,
                    thumb: classes.switchIcon,
                    track: classes.switchBar
                  }}
                />
              }
              classes={{
                label: classes.label
              }}
              label="Replied"
            />
            <Table
              tableHead={[
                '#',
                'Data',
                "Category",
                "Writer",
                "Seen",
                "Actions"
              ]}
              tableData={list.map((ele, key) => [
                (key + 1),
                ele.createdAt,
                ele.category,
                ele.user?.phone,
                !ele.view_status && ele.status ? (<Danger><VisibilityOff /></Danger>) : '',
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
            <Pagination color="primary" count={last_page} page={page} onChange={(e,value) => setPage(value)} />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
