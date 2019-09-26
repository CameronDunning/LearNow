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
        $(".fa-arrow-up").on("click", e => {
          e.stopPropagation();
          const classListArray = e.currentTarget.classList;
          const resourceID = classListArray[3];
          const upvoted = $(e.currentTarget).attr("data-upvote");
          if (upvoted === "false") {
            upvote(resourceID);
            $(`.upvote.${resourceID}`).attr("data-upvote", "true");
            $(`.downvote.${resourceID}`).attr("data-downvote", "false");
          }
        });
        $(".fa-arrow-down").on("click", e => {
          e.stopPropagation();
          const classListArray = e.currentTarget.classList;
          const resourceID = classListArray[3];
          const downvoted = $(e.currentTarget).attr("data-downvote");
          if (downvoted === "false") {
            downvote(resourceID);
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
