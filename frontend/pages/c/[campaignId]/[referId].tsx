import type { NextPage } from "next";
import Head from "next/head";
import { Grid, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getLink } from "../../../utils/DeAdSenseQueries";

const RedirectPage: NextPage = () => {
  const router = useRouter();
  const campaignId = router.query.campaignId;
  const referId = router.query.referId;

  useEffect(() => {
    async function fetchData() {
      // 1. get actual url from campaign id (from smart contract)
      // 2. increment impression for referId (on AWS server)
      // 3. redirect to url
      console.log(campaignId);
      let redirectLink = await getLink(campaignId);
      if (!redirectLink.startsWith("https://") && !redirectLink.startsWith("http://")) {
        redirectLink = "https://" + redirectLink;
      }
      console.log(redirectLink);
      window.location.replace(redirectLink);
    }
    if (campaignId && referId) fetchData();
  });

  return (
    <div
      style={{
        height: "100vh",
        background:
          "linear-gradient(180deg, #F0EFFF 0%, rgba(240, 239, 255, 0) 100%), #FFFFFF",
      }}
    >
      <Head>
        <title>Redirecting...</title>
        <meta name="description" content="Decentralized AdSense" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <Grid container item xs={12}>
          <Grid container item xs={12} justifyContent="center">
            <CircularProgress
              color="inherit"
              style={{ zIndex: 1200, display: "block" }}
            />
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            <Typography style={{ color: "white" }}>
              <br />
              Redirecting...
            </Typography>
          </Grid>
        </Grid>
      </Backdrop>
    </div>
  );
};
export default RedirectPage;
