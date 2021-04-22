import React, { useState, useContext } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Warning from "@material-ui/icons/Warning";
// import LockOutline from "@material-ui/icons/LockOutline";
import { useSnackbar } from 'notistack';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import { AuthContext } from 'variables/auth';
import { publicFetch } from 'variables/publicFetch';
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(styles);

export default function LoginPage(props) {

  var redirected = false;
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''

  });
  const [tc, setTC] = useState(false);
  const [errors, setErrors] = useState({
    phone: '',
    password: ''
  });
  const { setAuthState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const inputSet = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    validate(e.target.id, e.target.value)
  }
  const validate = async (name, value) => {
    switch (name) {
      case "phone": {
        await setErrors({
          ...errors,
          phone: ""
        });
        if (value === "") {
          await setErrors({
            ...errors,
            phone: "phone required"
          });
        }
        break;
      }
      case "password": {
        await setErrors({
          ...errors,
          password: ""
        });
        if (value === "")
          await setErrors({
            ...errors,
            password: "password required"
          });
        break;
      }
    }
  };
  const submit = async () => {
    await validate('phone', formData.phone);
    await setLoading(true);
    await validate('password', formData.password);
    if (formData.phone !== "" && formData.password !== "") {

      try {

        const { data } = await publicFetch.post('login', formData)
        const { userToken:token, expiresAt, user:userInfo } = data;
        if(!userInfo.admin){
          setLoading(false);
          return;
        }
        var today = new Date();
        today.setHours(today.getHours() + parseFloat(expiresAt));
        await setAuthState({ token, expiresAt: today.getTime() / 1000, userInfo });
        if (props.location.state != undefined && props.location.state.referrer != undefined)
          history.push(props.location.state.referrer);
        else
          history.push("/");
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Wrong phone or password!", {
          variant: 'danger', anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        setLoading(false);
      }


    }


  };

  React.useEffect(() => {
    let id = setTimeout(function () {
      setCardAnimation("");
    }, 700);
    redirected = false;
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
      redirected = true;
    };
  });
  const classes = useStyles();
  return (
    <div className={classes.container}>

      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login className={classes[cardAnimaton]}>

              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="rose"
              >
                <h4 className={classes.cardTitle}>Log in</h4>
              </CardHeader>
              <CardBody>
                <CustomInput
                  error={errors.phone != ""}
                  errorText={errors.phone}
                  labelText="User name"
                  id="phone"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    value: formData.phone,
                    onChange: (e) => inputSet(e),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Face className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    )
                  }}
                />
                <CustomInput
                  error={errors.password != ""}
                  errorText={errors.password}
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className={classes.inputAdornmentIcon}>
                          lock_outline
                        </Icon>
                      </InputAdornment>
                    ),
                    type: "password",
                    value: formData.country,
                    onChange: (e) => inputSet(e),
                    autoComplete: "off"
                  }}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                {loading == false ? (
                  <Button color="rose" simple size="lg" block onClick={submit}>
                    Let{"'"}s Go
                  </Button>
                ) : (
                    <Button color="rose" simple size="lg" block >
                      Loading
                    </Button>
                  )}
              </CardFooter>
            </Card>
          </form>
        </GridItem>

      </GridContainer>
    </div>
  );
}
