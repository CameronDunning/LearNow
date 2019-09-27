//facebook login
FB.login(
  function(response) {
    // handle the response
    console.log("helllo inside");
  },
  { scope: "public_profile,email" }
);
