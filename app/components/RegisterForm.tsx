"use client";
import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { ToastContainer } from "react-toastify";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendSignInLinkToEmail,
  sendEmailVerification,
} from "firebase/auth";

import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Grid,
  Typography,
  styled,
  withStyles,
} from "@mui/material";
import { useRegister } from "./RegisterContext";
import { registration, successMessage, warningMessage } from "./helper";
import { auth, db } from "@/services/firebase";
import { useState } from "react";
import Modal from "./Modal";
import Modals from "./Modal";
import { gsap } from "gsap";
import { set, getDatabase, onValue, ref } from "firebase/database";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const starCountRef = ref(db, "user/");
  const router = useRouter();
  useEffect(() => {
    gsap.fromTo(
      "#name",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 1.7, y: -10, ease: "back" }
    );
    gsap.fromTo(
      "#index",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 1.9, y: -10, ease: "back" }
    );
    gsap.fromTo(
      "#contactNo",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 2.1, y: -10, ease: "back" }
    );
    gsap.fromTo(
      "#uomMail",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 2.3, y: -10, ease: "back" }
    );
    gsap.fromTo(
      "#gmail",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 2.5, y: -10, ease: "back" }
    );

    gsap.fromTo(
      "#batch",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 2.7, y: -10, ease: "back" }
    );
    gsap.fromTo(
      "#Faculty",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 2.9, y: -10, ease: "back" }
    );
    gsap.fromTo(
      "#Department",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 3.1, y: -10, ease: "back" }
    );
    gsap.fromTo(
      "#checkbox",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 3.3, y: -10, ease: "back" }
    );
    gsap.fromTo(
      "#buttton",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 3.5, y: -10, ease: "back" }
    );
    gsap.fromTo(
      "#experience",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 3.5, y: -10, ease: "back" }
    );
  }, []);

  const {
    handleTelephone,
    handleGmail,
    handleUomMail,
    handleBatch,
    handleFaculty,
    handleDepartment,
    handleChange,
    handleName,
    handleIndex,
    name,
    index,
    mobileNumber,
    gmail,
    uomMail,
    batch,
    faculty,
    department,
    checked,
    showModal,
    setShowModal,
    clearForm,
    clearPIN,
    setRandomNumber,
    checkPIN,
    enterPinButton,
    setEnterPinButton,
    sendOTP,
    setOtp,
    previousExperience,
    handlePreviousExperions,
  }: any = useRegister();

  async function submitForm(e: any) {
    e.preventDefault();

    const data = {
      name,
      index,
      telephone: mobileNumber,
      gmail,
      uomMail,
    };
    if (!batch || !faculty || !department) {
      warningMessage("Fill the form");
      return;
    }

    const result = registration.safeParse(data);
    if (!result.success) {
      const formatedError = result.error.format();
      const nameError = formatedError.name?._errors || "";
      const telephoneError = formatedError.telephone?._errors || "";
      const gmailError = formatedError.gmail?._errors || "";
      const indexError = formatedError.index?._errors || "";
      const uomMailError = formatedError.uomMail?._errors || "";
      if (nameError) {
        warningMessage(nameError[0]);
        return;
      } else if (telephoneError) {
        warningMessage(telephoneError[0]);
        return;
      } else if (gmailError) {
        warningMessage(gmailError[0]);
        return;
      } else if (indexError) {
        warningMessage(indexError[0]);
        return;
      } else if (uomMailError) {
        warningMessage(uomMailError[0]);
        return;
      }
    }

    try {
      let checkUser = false;

      onValue(starCountRef, (snapshot) => {
        const id = snapshot.val();
      });

      // const querySnapshot = await getDocs(collection(db, "user"));
      // querySnapshot.forEach((doc) => {
      //   const user = Object.values(doc.data()).includes(uomMail);
      //   if (user === true) {
      //     warningMessage("This email address already registered to the system");
      //     checkUser = true;
      //   }
      // });

      if (checkUser) return;
      if (!checked) {
        warningMessage("Confirm your details");
        return;
      }

      createUserWithEmailAndPassword(auth, gmail, index)
        .then((userCredential) => {
          sendEmailVerification(auth.currentUser!).then((d) => console.log(d));
          router.push("/register");
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            warningMessage(
              "Your email address already registered to the system"
            );
          }
        });

      // const actionCodeSettings = {
      //   // URL you want to redirect back to. The domain (www.example.com) for this
      //   // URL must be in the authorized domains list in the Firebase Console.
      //   url: "https://www.example.com/finishSignUp?cartId=1234",
      //   // This must be true.
      //   handleCodeInApp: true,
      //   iOS: {
      //     bundleId: "com.example.ios",
      //   },
      //   android: {
      //     packageName: "com.example.android",
      //     installApp: true,
      //     minimumVersion: "12",
      //   },
      //   dynamicLinkDomain: "example.page.link",
      // };

      console.log(gmail);

      // sendSignInLinkToEmail(auth, gmail, actionCodeSettings)
      //   .then(() => {
      //     // The link was successfully sent. Inform the user.
      //     // Save the email locally so you don't need to ask the user for it again
      //     // if they open the link on the same device.
      //     window.localStorage.setItem("emailForSignIn", gmail);
      //     // ...
      //   })
      //   .catch((error) => {
      //     const errorCode = error.code;
      //     const errorMessage = error.message;
      //     // ...
      //   });
      // console.log(e);
    } catch (e) {
      console.log(e);
    }
  }

  function handleNext() {
    const user = auth.currentUser;
    if (user) {
      if (user.emailVerified) {
        // User's email is verified
        console.log("Email is verified");
      } else {
        // User's email is not verified
        console.log("Email is not verified");
      }
    } else {
      console.log("no user");
    }
  }

  async function saveData() {
    const check = checkPIN();
    if (!check) {
      warningMessage("Your pin number is wrong");
      return;
    }
    let id = 0;
    // const starCountRef = ref(db, "user/");
    onValue(starCountRef, (snapshot) => {
      console.log([snapshot.val()]);
      id = Object.keys(snapshot.val()).length;
    });

    // const querySnapshot = await getDocs(collection(db, "user"));
    // const id = querySnapshot.docs.length + 1;
    const registerId = `SB-${id + 1}`;

    const storeData = {
      name,
      index,
      telephone: mobileNumber,
      gmail,
      uomMail,
      batch,
      faculty,
      department,
      previousExperience,
      registerId,
    };

    set(ref(db, "user/" + index), storeData);

    successMessage("Data send successfully");
    localStorage.clear();
    clearForm();
    setEnterPinButton(false);
    clearPIN();
    setShowModal(false);
    setOtp("");
    return true;
  }
  const style = {
    "& label": {
      color: "#04A2CA",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#04A2CA",
      },
      "&:hover fieldset": {
        borderColor: "pink",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  };

  const styleSelect = {
    width: "100%",
    "& label": {
      color: "#04A2CA",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#04A2CA",
      },
      "&:hover fieldset": {
        borderColor: "pink",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  };
  return (
    <div>
      {showModal && <Modals fn={saveData} />}
      <form onSubmit={submitForm}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="start"
          spacing={2}
          mb={3}
        >
          <Grid id="name" item sx={{ width: "100%" }}>
            <TextField
              sx={style}
              fullWidth
              id="nameText"
              size="small"
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => handleName(e)}
              required
              InputProps={{
                sx: { borderRadius: 10 },
              }}
            />
          </Grid>
          <Grid id="index" item sx={{ width: "100%" }}>
            <TextField
              sx={style}
              fullWidth
              InputProps={{ sx: { borderRadius: 10 } }}
              id="indexText"
              size="small"
              label="Index"
              required
              variant="outlined"
              value={index}
              onChange={(e) => handleIndex(e)}
            />
          </Grid>
          <Grid id="contactNo" item sx={{ width: "100%" }}>
            <TextField
              sx={style}
              fullWidth
              InputProps={{ sx: { borderRadius: 10 } }}
              id="contactNoText"
              size="small"
              required
              label="Contact Number(Whatsapp)"
              variant="outlined"
              value={mobileNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleTelephone(e)
              }
            />
          </Grid>

          <Grid id="uomMail" item sx={{ width: "100%" }}>
            <TextField
              sx={style}
              fullWidth
              InputProps={{ sx: { borderRadius: 10 } }}
              id="uomMailText"
              size="small"
              required
              label="University Email(sample@uom.lk)"
              variant="outlined"
              value={uomMail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleUomMail(e)
              }
            />
          </Grid>
          <Grid id="gmail" item sx={{ width: "100%" }}>
            <TextField
              sx={style}
              fullWidth
              InputProps={{ sx: { borderRadius: 10 } }}
              id="gmailText"
              size="small"
              label="Gmail"
              required
              variant="outlined"
              value={gmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleGmail(e)
              }
            />
          </Grid>

          <Grid
            id="batch"
            item
            sx={{
              width: "100%",
            }}
          >
            <FormControl sx={styleSelect} size="small">
              <InputLabel id="demo-simple-select-label">Batch</InputLabel>
              <Select
                inputProps={{ sx: { borderRadius: 10 } }}
                labelId="demo-simple-select-label"
                id="batchText"
                label="Batch"
                value={batch}
                sx={{ borderRadius: 10 }}
                onChange={(e: any) => handleBatch(e)}
              >
                <MenuItem value="Batch 19">Batch 19</MenuItem>
                <MenuItem value="Batch 20">Batch 20</MenuItem>
                <MenuItem value="Batch 21">Batch 21</MenuItem>
                <MenuItem value="Batch 22">Batch 22</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid id="Faculty" item sx={{ width: "100%" }}>
            <FormControl sx={styleSelect} size="small">
              <InputLabel id="faculty">Faculty</InputLabel>
              <Select
                sx={{ borderRadius: 10 }}
                labelId="demo-simple-select-label"
                id="FacultyText"
                label="Faculty"
                onChange={(e: any) => handleFaculty(e)}
                value={faculty}
                inputProps={{ sx: { borderRadius: 10 } }}
              >
                <MenuItem value="Faculty Of Architecture">
                  Faculty Of Architecture
                </MenuItem>
                <MenuItem value=" Faculty Of Engineering">
                  Faculty Of Engineering
                </MenuItem>
                <MenuItem value=" Faculty Of Business">
                  Faculty Of Business
                </MenuItem>
                <MenuItem value="Faculty Of Information technology">
                  Faculty Of Information technology
                </MenuItem>
                <MenuItem value="Faculty Of Medicine">
                  Faculty Of Medicine
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid id="Department" item sx={{ width: "100%" }}>
            <FormControl sx={styleSelect} size="small">
              <InputLabel id="department">Department</InputLabel>
              <Select
                sx={{ borderRadius: 10 }}
                labelId="demo-simple-select-label"
                id="DepartmentText"
                label="Department"
                onChange={(e: any) => handleDepartment(e)}
                value={department}
              >
                <MenuItem value="Bio Medical Engineering">
                  Bio Medical Engineering
                </MenuItem>
                <MenuItem value="Electronic and Telecommunication Engineering">
                  Electronic and Telecommunication Engineering
                </MenuItem>
                <MenuItem value="Electrical Engineering">
                  Electrical Engineering
                </MenuItem>
                <MenuItem value="Mechanical Engineering">
                  Mechanical Engineering
                </MenuItem>
                <MenuItem value="Civil Engineering">Civil Engineering</MenuItem>
                <MenuItem value="Material Science Engineering">
                  Material Science Engineering
                </MenuItem>
                <MenuItem value="Chemical and Process Engineering">
                  Chemical and Process Engineering
                </MenuItem>
                <MenuItem value="Transport Management and Logistics Engineering">
                  Transport Management and Logistics Engineering
                </MenuItem>
                <MenuItem value="Textile and Apparel Engineering">
                  Textile and Apparel Engineering
                </MenuItem>
                <MenuItem value="Earth Resource Engineering">
                  Earth Resource Engineering
                </MenuItem>
                <MenuItem value="Computer Science & Engneering">
                  Computer Science & Engneering
                </MenuItem>
                <MenuItem value="Information Technology">
                  Information Technology
                </MenuItem>
                <MenuItem value="Interdisciplinary Study">
                  Interdisciplinary Study
                </MenuItem>
                <MenuItem value="Computational Mathematics">
                  Computational Mathematics
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid id="experience" item sx={{ width: "100%" }}>
            <TextField
              sx={style}
              fullWidth
              InputProps={{ sx: { borderRadius: 10 } }}
              id="experienceText"
              size="small"
              label="Previous volunteering experience if you have any (optional)"
              required
              variant="outlined"
              value={previousExperience}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handlePreviousExperions(e)
              }
            />
          </Grid>

          <Grid item sx={{ width: "100%" }}>
            <div id="checkbox">
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#04A2CA",
                      "&.Mui-checked": {
                        color: "#04A2CA",
                      },
                    }}
                  />
                }
                label="I confirm that I have entered the details correctly"
                checked={checked}
                onChange={handleChange}
                sx={{ color: "#04A2CA" }}
              />
            </div>
          </Grid>

          <Grid item sx={{ width: "100%" }}>
            <div id="buttton">
              <Button
                type="submit"
                sx={{ width: 200, borderRadius: 10 }}
                size="small"
                variant="contained"
              >
                Save details
              </Button>
            </div>
          </Grid>

          <div></div>
        </Grid>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterForm;