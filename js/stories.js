"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  //Updated to display if story is favorited or not
  const isFavorite =
    currentUser &&
    currentUser.favorites.some((s) => s.storyId === story.storyId);
  const favoriteClass = isFavorite ? "fas" : "far";
  const hostName = story.getHostName();
  const isOwnStory = currentUser && currentUser.ownsStory(story);
  const trashCanIcon = isOwnStory ? '<i class="fas fa-trash-alt"></i>' : "";

  return $(`
    <li id="${story.storyId}">
      <i class="favorite-icon ${favoriteClass} fa-heart"></i>
      ${trashCanIcon}
      <a href="${story.url}" target="blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle submitting a new story. */

async function submitStory(evt) {
  evt.preventDefault(); // Prevent the form from submitting the default way

  // Get the form input values
  const author = $("#add-story-author").val();
  const title = $("#add-story-title").val();
  const url = $("#add-story-url").val();

  // Create the new story object
  const newStory = { author, title, url };

  // Add the new story to the story list and display it on the page
  const addedStory = await storyList.addStory(currentUser, newStory);
  const $story = generateStoryMarkup(addedStory);
  $allStoriesList.prepend($story);

  // Reset form values
  $("#add-story-form").trigger("reset");

  // Hide the story submission form
  $storyForm.hide();

  // Update the "My Stories" list if it's visible
  if ($myStoriesList.is(":visible")) {
    generateMyStories();
  }

  // Redirect the user to the homepage and show the updated list of stories
  navAllStories();

  //Reload page when story submitted
  location.reload();
}

// Attach the submit event to the story form
$storyForm.on("submit", submitStory);

//Add and remove favorites
$allStoriesList.on("click", ".favorite-icon", async function (evt) {
  const $target = $(evt.target);
  const storyId = $target.closest("li").attr("id");

  if ($target.hasClass("far")) {
    await currentUser.addFavorite(storyId);
    $target.closest("i").toggleClass("far fas");
  } else {
    await currentUser.removeFavorite(storyId);
    $target.closest("i").toggleClass("fas far");
  }
});

async function generateMyStories() {
  console.debug("generateMyStories");

  // Get the user's own stories
  const ownStories = currentUser.ownStories;
  const ownStoriesList = $("#my-stories-ol");
  const myStoriesHeading = $("#my-stories-heading");

  // Empty the list before populating it with new stories
  ownStoriesList.empty();

  // Check if the user has no stories, and if so, display a message and hide the "Your stories" heading
  if (ownStories.length === 0) {
    ownStoriesList.append("<h5>No stories added by user!</h5>");
    myStoriesHeading.hide();
  } else {
    // Loop through all user's stories and generate HTML for them
    for (let story of ownStories) {
      const $story = generateStoryMarkup(story, true);

      ownStoriesList.append($story);
    }
    myStoriesHeading.hide();
  }
}

//Handle delete story event
async function handleDeleteStory(evt) {
  const $target = $(evt.target);
  const storyId = $target.closest("li").attr("id");

  // Remove the story from the API and the currentUser's ownStories array
  await currentUser.deleteStory(storyId);

  // Remove the story from the DOM
  $target.closest("li").remove();
}

$allStoriesList.on("click", ".fa-trash-alt", handleDeleteStory);
$("#my-stories-ol").on("click", ".fa-trash-alt", handleDeleteStory);

$allStoriesList.on("click", ".fa-trash-alt", async function (evt) {
  const $target = $(evt.target);
  const storyId = $target.closest("li").attr("id");

  // Remove the story from the API and the currentUser's ownStories array
  await currentUser.deleteStory(storyId);

  // Remove the story from the DOM
  $target.closest("li").remove();
});

//Show list of favorite stories
function showFavorites() {
  console.debug("showFavorites");

  $favoriteStoriesList.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStoriesList.append("<h5>No favorites added!</h5>");
  } else {
    $favoriteStoriesList.append("<h3> Your Favorite Stories </h3>");
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStoriesList.append($story);
    }
  }

  showFavoriteStoriesSection();
}

function showFavoriteStoriesSection() {
  hidePageComponents();
  $favoriteStoriesList.show();
}
