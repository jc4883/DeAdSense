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
import { useState } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const [address, setAddress] = useState<null | string>(null);
  const campaignId = router.query.campaignId;
  const [link, setLink] = useState<string>("deAdSense.io/c/234");
  const [endDate, setEndDate] = useState<string | number>("");
  const [amount, setAmount] = useState<string | number>("");
  const [impressions, setImpressions] = useState<string | number>("");
  const [ownerAddress, setOwnerAddress] = useState<null | string>(
    "0x2384927496591705"
  );
  const referData: any = [{ id: "0x23o94", impressions: 50 }];
  const [linkCreated, setLinkCreated] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const handleWalletSignIn = () => {
    setAddress("0x2384927496591705");
  };
  const handleCreateLink = () => {
    setLink("deAdSense.io/c/234/5882342");
    setLinkCreated(true);
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
            {address === null ? (
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
          {address && ownerAddress && ownerAddress === address && (
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
                  <Typography align="right">{endDate}</Typography>
                </Grid>
              </Grid>
              <Grid container item>
                <Grid item xs={4}>
                  <Typography align="left">Amount deposited</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography align="right">{amount}</Typography>
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
                          <TableCell align="right">{row.impressions}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
          {address !== ownerAddress && !linkCreated && (
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
                onClick={() => {
                  handleCreateLink();
                }}
              >
                Generate referral link
              </Button>
            </Grid>
          )}
          {address !== ownerAddress && linkCreated && (
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
                  <Typography align="right">{link}</Typography>
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
