import type { NextPage } from "next";
import Head from "next/head";
import { Grid, Typography, Button, Chip, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

const Home: NextPage = () => {
  const router = useRouter();
  const [connector, setConnector] = useState<WalletConnect | null>(null);
  const [address, setAddress] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const handleWalletSignIn = () => {
    setAddress("0x2384927496591705");
  };

  


  const handleSignIn = async () => {
    // console.log("16 handleSignIn");

    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new connector
    const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
    setConnector(connector);

    if (!connector.connected) {
      // console.log("26 creating session");
      await connector.createSession();
    }
  }

  useEffect(() => {
    // console.log("27 useEffect connector");
    if (!connector) {
      // console.log("29 no connector!!");
      return;
    }
    // console.log("32");

    // subscribe to connector events
    connector.on("session_update", async (error, payload) => {
      console.log(`connector.on("session_update")`);

      if (error) {
        throw error;
      }

      const { chainId, accounts } = payload.params[0];
      setAddress(accounts[0]);
    });

    connector.on("connect", (error, payload) => {
      console.log(`connector.on("connect")`);

      if (error) {
        throw error;
      }

      const { chainId, accounts } = payload.params[0];
      setAddress(accounts[0]);
    });

    connector.on("disconnect", (error, payload) => {
      console.log(`connector.on("disconnect")`);

      if (error) {
        throw error;
      }

      setConnector(null);
      setAddress(null);
    });

    if (connector.connected) {
      // console.log("69 connector.connected");
      console.log(`${connector.connected}, ${connector._connected}`);

      const { chainId, accounts } = connector;
      const address = accounts[0];
      setAddress(accounts[0]);
    }

    // console.log("77");
  }, [connector])

  const handleSignOut = () => {
    // console.log("81");
    if (connector) {
      // console.log("83");
      connector.killSession();
    }
    // console.log("86");
    setAddress("");
  }

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
                onClick={() => handleSignIn() }
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
                  <Button
                    onClick={() => handleSignOut()}
                  >
                    Sign out
                  </Button>
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
                  label="Link"
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
                ></TextField>
              </Grid>
              <Grid item xs={12} md={7}>
                <TextField
                  label="Amount to deposit"
                  value={amount}
                  fullWidth
                  onChange={(e) => {
                    setAmount(e.target.value);
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
