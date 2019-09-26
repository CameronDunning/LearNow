//MY RESOURCES LOAD

//defaults to my resources
$(document).ready(() => {
  loadMyResources();
});

$(".my-resources-button").on("click", function() {
  loadMyResources();
});

$.fn.serializeObject = function() {
  var o = {};
  this.find("[name]").each(function() {
    o[this.name] = this.value;
  });
  return o;
};

async function loadMyResources() {
  try {
    await $.ajax({
      url: "http://localhost:8080/api/my_resources",
      dataType: "JSON",
      success: data => {
        $("#my-resources-container").empty();
        renderMyResources(data);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

$("form").on("submit", async function() {
  let formObject = await $(this).serializeObject();
  $("#resourcescontainer").prepend(createResourceElement(formObject));
  $("#modal-create-new").modal("hide");
  loadMyResources();
  loadModal();
});

function renderMyResources(resources) {
  resources.forEach(resource => {
    $("#my-resources-container").prepend(createResourceElement(resource));
  });
  loadModal();
}

//Load LIKED resources

$(".liked-resources-button").on("click", function() {
  loadLikedResources();
});

const loadLikedResources = async () => {
  try {
    await $.ajax({
      url: "http://localhost:8080/api/my_liked_resources/",
      dataType: "JSON",
      success: data => {
        $("#my-resources-container").empty();
        renderMyResources(data);
        $(".net-vote").on("click", e => e.stopPropagation());
        $(".fa-arrow-up").on("click", e => {
          e.stopPropagation();
          const classListArray = e.currentTarget.classList;
          const resourceID = classListArray[3];
          const upvoted = $(e.currentTarget).attr("data-upvote");
          const downvoted = $(`.downvote.${resourceID}`).attr("data-downvote");
          if (upvoted === "false") {
            upvote(resourceID);
            let netVotes = parseInt($(`#net-vote-${resourceID}`).text());
            if (downvoted === "false") {
              netVotes++;
            } else {
              netVotes += 2;
            }
            if (netVotes === 0) {
              $(`#net-vote-${resourceID}`).attr("data-netVote", "0");
            } else if (netVotes > 0) {
              $(`#net-vote-${resourceID}`).attr("data-netVote", "true");
            }
            $(`#net-vote-${resourceID}`).text(netVotes);
            $(`.upvote.${resourceID}`).attr("data-upvote", "true");
            $(`.downvote.${resourceID}`).attr("data-downvote", "false");
          }
        });
        $(".fa-arrow-down").on("click", e => {
          e.stopPropagation();
          const classListArray = e.currentTarget.classList;
          const resourceID = classListArray[3];
          const downvoted = $(e.currentTarget).attr("data-downvote");
          const upvoted = $(`.upvote.${resourceID}`).attr("data-upvote");
          if (downvoted === "false") {
            downvote(resourceID);
            let netVotes = parseInt($(`#net-vote-${resourceID}`).text());
            if (upvoted === "false") {
              netVotes--;
            } else {
              netVotes -= 2;
            }
            if (netVotes === 0) {
              $(`#net-vote-${resourceID}`).attr("data-netVote", "0");
            } else if (netVotes < 0) {
              $(`#net-vote-${resourceID}`).attr("data-netVote", "false");
            }
            $(`#net-vote-${resourceID}`).text(netVotes);
            $(`.downvote.${resourceID}`).attr("data-downvote", "true");
            $(`.upvote.${resourceID}`).attr("data-upvote", "false");
          }
        });
        $(".add-to-my-resources").on("click", e => {
          e.stopPropagation();
          const classListArray = e.currentTarget.classList;
          const resourceID = classListArray[3];
          const addedToResource = $(e.currentTarget).attr("data-activity");
          if (addedToResource === "true") {
            $(`.add-to-my-resources.${resourceID}`).attr(
              "data-activity",
              "false"
            );
            removeResource(resourceID);
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};
