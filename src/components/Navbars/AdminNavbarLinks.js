import React, { useContext } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// import { Manager, Target, Popper } from "react-popper";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";


// @material-ui/icons
import Person from "@material-ui/icons/Person";

import {AuthContext} from 'variables/auth';
import { useHistory } from "react-router-dom";
// core components
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  let history = useHistory();
  const {logout}=useContext(AuthContext);
  const onLogout = event => {
    logout();
    history.push("/auth/login-page");
  };
  const classes = useStyles();
  const { rtlActive } = props;
 

  const wrapper = classNames({
    [classes.wrapperRTL]: rtlActive
  });
  const managerClasses = classNames({
    [classes.managerClasses]: true
  });
  return (
    <div className={wrapper}>    

      <div className={managerClasses}>
        <Button
          color="transparent"
          aria-label="Person"
          justIcon
          aria-haspopup="true"
          onClick={onLogout}
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : ""
          }}
        >
          <Person
            className={
              classes.headerLinksSvg +
              " " +
              (rtlActive
                ? classes.links + " " + classes.linksRTL
                : classes.links)
            }
          />
        </Button>
      </div>
    </div>
  );
}

HeaderLinks.propTypes = {
  rtlActive: PropTypes.bool
};
