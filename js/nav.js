"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

const $navFavorites = $("#nav-favorites");

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show the submit form when click on "submit" link in the navbar */

function showSubmitForm(evt) {
  console.debug("showSubmitForm", evt);
  hidePageComponents();
  $("#add-story-form").show();
}

// Add a click event listener for the "submit" link
$("#nav-submit").on("click", showSubmitForm);

//Add a click event listener for favorites
$navFavorites.on("click", function (evt) {
  evt.preventDefault();
  showFavorites();
});

//Add event listener to the "my stories" link
$("#nav-my-stories").on("click", async function () {
  // Hide other content and show the user's submitted stories
  hidePageComponents();
  $myStoriesList.show();
  // Ensure the user's submitted stories are up-to-date
  await generateMyStories();
});