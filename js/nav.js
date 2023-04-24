"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $storyForm.hide(); //Hide the story form
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $storyForm.hide(); //Hide the story form
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  generateMyStories(); // Add this line to generate the user's stories when they log in
}

/** Show the submit form when click on "submit" link in the navbar */

function showSubmitForm(evt) {
  console.debug("showSubmitForm", evt);
  hidePageComponents();
  $("#add-story-form").show();
}

// Add a click event listener for the "submit" link
$("#nav-submit").on("click", showSubmitForm);

function showFavoriteStories(evt) {
  console.debug("showFavoriteStories", evt);
  hidePageComponents();
  showFavorites();
}

//Add a click event listener for favorites
$navFavorites.on("click", function (evt) {
  evt.preventDefault();
  showFavoriteStories(evt);
  $storyForm.hide(); //Hide the story form
});

//Add event listener to the "my stories" link
$("#nav-my-stories").on("click", async function () {
  // Hide other content and show the user's submitted stories
  hidePageComponents();
  $myStoriesList.show();
  $storyForm.hide(); //Hide the story form
  // Ensure the user's submitted stories are up-to-date
  await generateMyStories();
});
