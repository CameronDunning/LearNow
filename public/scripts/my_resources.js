//MY RESOURCES LOAD

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

$("form").on("submit", async function(event) {
  let formObject = await $(this).serializeObject();
  $("#resourcescontainer").prepend(createResourceElement(formObject));
  $("#modal-create-new").modal("hide");
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

async function loadLikedResources() {
  try {
    await $.ajax({
      url: "http://localhost:8080/api/my_liked_resources/",
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
