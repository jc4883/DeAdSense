import type { NextPage } from "next";
import Head from "next/head";
import {
  Grid,
  Typography,
  Button,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const Home: NextPage = () => {
  const router = useRouter();
  const [address, setAddress] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const handleWalletSignIn = () => {
    setAddress("0x2384927496591705");
  };
  return (
    <div
      style={{
        height: "100vh",
        background:
          "linear-gradient(180deg, #F0EFFF 0%, rgba(240, 239, 255, 0) 100%), #FFFFFF",
      }}
    >
      <Head>
        <title>DeAdSense</title>
        <meta name="description" content="Decentralized AdSense" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid container style={{ width: "100%" }} justifyContent="center">
        <Grid
          container
          item
          xs={11}
          style={{ marginTop: 100 }}
          spacing={1}
          justifyContent="center"
        >
          <Grid item xs={12}>
            <Typography
              variant="h3"
              style={{ fontWeight: "bold" }}
              align="center"
            >
              DeAdSense
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" style={{ fontWeight: 400 }} align="center">
              Decentralized Advertisement Platform
            </Typography>
          </Grid>
          <Grid
            container
            item
            style={{ paddingTop: 20 }}
            justifyContent="center"
          >
            {address === "" ? (
              <Button
                variant="contained"
                onClick={() => {
                  handleWalletSignIn();
                }}
              >
                Connect Wallet
              </Button>
            ) : (
              <Grid
                container
                item
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <Chip label={address}></Chip>
                </Grid>
                <Grid item>
                  <Button>Sign out</Button>
                </Grid>
              </Grid>
            )}
          </Grid>
          {address && (
            <Grid
              container
              item
              xs={12}
              style={{ paddingTop: 30 }}
              justifyContent="center"
              spacing={2}
            >
              <Grid item xs={12} md={7}>
                <TextField
                  label="Link to advertise"
                  value={link}
                  fullWidth
                  onChange={(e) => {
                    setLink(e.target.value);
                  }}
                ></TextField>
              </Grid>
              <Grid item xs={12} md={7}>
                <TextField
                  label="Duration"
                  value={duration}
                  fullWidth
                  onChange={(e) => {
                    setDuration(e.target.value);
                  }}
                  select
                >
                  <MenuItem key="1 week" value="1 week">
                    1 Week
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={7}>
                <TextField
                  label="Amount to deposit"
                  value={amount}
                  fullWidth
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">USDC</InputAdornment>
                    ),
                  }}
                ></TextField>
              </Grid>
              <Grid item xs={12} md={7}>
                <Button
                  disabled={!Boolean(link && duration && amount)}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Start advertising
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
