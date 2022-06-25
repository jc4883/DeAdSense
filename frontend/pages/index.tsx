import type { NextPage } from "next";
import Head from "next/head";
import { Grid, Typography, Button, Chip } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

const Home: NextPage = () => {
  const router = useRouter();
  const [connector, setConnector] = useState<WalletConnect | null>(null);
  const [address, setAddress] = useState<null | string>(null);

  const connect = async () => {
    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new connector
    const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });

    // check if already connected
    if (!connector._connected) {
      // create new session
      await connector.createSession();
    }

    setConnector(connector);


    // subscribe to events
    await subscribeToEvents();
  };

  const subscribeToEvents = async () => {
    console.log("34 subscribeToEvents");
    if (!connector) {
      return;
    }

    connector.on("session_update", async (error, payload) => {
      console.log(`connector.on("session_update")`);

      if (error) {
        throw error;
      }

      const { accounts } = payload.params[0];
      setAddress(accounts[0]);
      
    });

    connector.on("connect", (error, payload) => {
      console.log(`connector.on("connect")`);

      if (error) {
        throw error;
      }

      const { accounts } = payload.params[0];
      setAddress(accounts[0]);
    });

    connector.on("disconnect", (error, payload) => {
      console.log(`connector.on("disconnect")`);

      if (error) {
        throw error;
      }

      setAddress(null);
    });

    if (connector.connected) {
      console.log("71 if connector.connected")
      setAddress(connector.accounts[0]);
      // const { chainId, accounts } = connector;
      // const address = accounts[0];
      // this.setState({
      //   connected: true,
      //   chainId,
      //   accounts,
      //   address,
      // });
      // this.onSessionUpdate(accounts, chainId);
    }

    setConnector(connector);
  };

  const handleSignOut = () => {
    if (connector) {
      connector.killSession();
    }
    setAddress(null);
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
        <meta name="description" content="Generated by create next app" />
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
            {address === null ? (
              <Button
                variant="contained"
                onClick={() => {
                  connect();
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
                  <Button
                    onClick={() => handleSignOut()}
                  >
                    Sign out
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
