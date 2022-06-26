import type { NextPage } from "next";
import Head from "next/head";
import {
  Grid,
  Typography,
  Button,
  Chip,
  Table,
  TableContainer,
  Paper,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import {
  getCampaignAmount,
  getEndDate,
  getOwner,
} from "../../../utils/DeAdSenseQueries";
import { distributeFunds } from "../../../utils/buttonCallbacks";

const Home: NextPage = () => {
  const router = useRouter();
  const [connector, setConnector] = useState<WalletConnect | null>(null);
  const [address, setAddress] = useState<null | string>("");
  const campaignId: string =
    router.query.campaignId !== undefined
      ? router.query.campaignId.toString()
      : "";
  const [link, setLink] = useState<string>("deAdSense.io/c/234");
  const [endDate, setEndDate] = useState<string | number>("1656197306080");
  const [amount, setAmount] = useState<string | number>("0");
  const [impressions, setImpressions] = useState<string | number>("");
  const [ownerAddress, setOwnerAddress] = useState<null | string>(
    "0x2384927496591705"
  );
  const referData: any = [{ id: "0x23o94", impressions: 50 }];
  const [linkCreated, setLinkCreated] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const isCampaignOwner = ownerAddress === address;

  const handleSignIn = async () => {
    // bridge url
    const bridge = "https://bridge.walletconnect.org";

    // create new connector
    const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
    setConnector(connector);

    if (!connector.connected) {
      await connector.createSession();
    }
  };

  useEffect(() => {
    if (!connector) {
      return;
    }

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
      setAddress("");
    });

    if (connector.connected) {
      console.log("connector.connected");
      const { chainId, accounts } = connector;
      const address = accounts[0];
      setAddress(accounts[0]);
    }
  }, [connector]);

  useEffect(() => {
    async function fetchCampaignData() {
      try {
        const fetchedOwnerAddress = await getOwner(campaignId);
        const fetchedEndDate = await getEndDate(campaignId);
        const fetchedAmount = await getCampaignAmount(campaignId);
        console.log(fetchedEndDate.toUTCString());
        // setOwnerAddress(fetchedOwnerAddress);
        setEndDate(dayjs(fetchedEndDate).valueOf());
        setAmount(Number(fetchedAmount) / 10 ** 18); // 18 = number of decimals in the token
      } catch (error) {
        console.log(`error loading campaign ${campaignId}`);
        throw error;
      }
    }
    if (address) fetchCampaignData();

    // TODO: fetch data from aws as well
  }, [address]);

  const handleSignOut = () => {
    if (connector) {
      connector.killSession();
    }
    setAddress("");
    setEndDate("");
    setAmount("");
    setImpressions("");
    setLinkCreated(false);
    setSnackbarOpen(false);
  };

  const handleCreateLink = () => {
    const link = isCampaignOwner
      ? `deAdSense.io/c/${campaignId}`
      : `deAdSense.io/c/${campaignId}/${address}`;
    setLink(link);
    setLinkCreated(true);
  };

  const getFormattedTime = (date: any) => {
    const output: string = dayjs(Number(date)).format("MM/DD/YYYY");
    return output;
  };

  const CopyButton = ({ text }: any) => {
    return (
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={() => {
          navigator.clipboard.writeText(text);
          setSnackbarOpen(true);
        }}
      >
        Copy
      </Button>
    );
  };

  const EndCampaignButton = ({ text }: any) => {
    return (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => {
          distributeFunds(campaignId, null);
        }}
        style={{ marginTop: 10, height: 60 }}
      >
        <Typography variant="h4" style={{ color: "white" }}>
          Distribute Funds
        </Typography>
      </Button>
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        background:
          "linear-gradient(180deg, #F0EFFF 0%, rgba(240, 239, 255, 0) 100%), #FFFFFF",
      }}
    >
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3500}
        message="Copied to clipboard"
        onClose={() => {
          setSnackbarOpen(false);
        }}
      />
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
                  handleSignIn();
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
                  <Button onClick={() => handleSignOut()}>Sign out</Button>
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid container>
            <Grid item xs={12} style={{ paddingTop: 30 }}>
              <Typography
                variant="h6"
                align="center"
                style={{ fontWeight: "bold" }}
              >
                Campaign #{campaignId}
              </Typography>
            </Grid>
          </Grid>
          {address &&
            ownerAddress &&
            ownerAddress.toLowerCase() === address.toLowerCase() && (
              <Grid
                container
                item
                xs={12}
                md={6}
                style={{ paddingTop: 30 }}
                justifyContent="center"
                spacing={2}
              >
                <Grid container item alignItems="center" spacing={1}>
                  <Grid item xs={4}>
                    <Typography align="left">Campaign link</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">{link}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <CopyButton text={link} />
                  </Grid>
                </Grid>
                <Grid container item>
                  <Grid item xs={4}>
                    <Typography align="left">Ends at</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography align="right">
                      {getFormattedTime(endDate)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item>
                  <Grid item xs={4}>
                    <Typography align="left">Amount deposited</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography align="right">{amount} USDC</Typography>
                  </Grid>
                </Grid>
                <Grid container item>
                  <TableContainer component={Paper} style={{ margin: 20 }}>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Referrers</TableCell>
                          <TableCell align="right">Impressions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {referData.map((row: any) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.id}
                            </TableCell>
                            <TableCell align="right">
                              {row.impressions}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                {dayjs().isAfter(endDate) && (
                  <Grid container item>
                    <Typography>
                      Your campaign is over. Pay out your promoters!
                    </Typography>
                    <EndCampaignButton />
                  </Grid>
                )}
              </Grid>
            )}
          {address.toLowerCase() !== ownerAddress.toLowerCase() &&
            !linkCreated && (
              <Grid
                container
                item
                xs={12}
                md={6}
                justifyContent="center"
                style={{ paddingTop: 30 }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  disabled={address === ""}
                  onClick={() => {
                    handleCreateLink();
                  }}
                >
                  Generate referral link
                </Button>
              </Grid>
            )}
          {address.toLowerCase() !== ownerAddress.toLowerCase() && linkCreated && (
            <Grid
              container
              item
              xs={12}
              md={6}
              style={{ paddingTop: 30 }}
              justifyContent="center"
              spacing={2}
            >
              <Grid container item alignItems="center" spacing={1}>
                <Grid item xs={4}>
                  <Typography align="left">Referral link</Typography>
                </Grid>
                <Grid item xs={6}>
                  {/*<Typography align="right">{link}</Typography>*/}
                </Grid>
                <Grid item xs={2}>
                  <CopyButton text={link} />
                </Grid>
              </Grid>
              <Grid container item alignItems="center" spacing={1}>
                <Grid item xs={4}>
                  <Typography align="left">Impressions</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography align="right">{impressions}</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
