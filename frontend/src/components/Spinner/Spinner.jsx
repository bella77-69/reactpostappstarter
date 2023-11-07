import React from "react";
import { SyncLoader } from "react-spinners";
import classes from "./Spinner.module.css";

function Spinner() {
  return (
    <section className={classes.spin}>
      <SyncLoader color="#228be6" />
      <p className={classes.loadingText}>Loading Posts .... </p>
    </section>
  );
}

export default Spinner;
