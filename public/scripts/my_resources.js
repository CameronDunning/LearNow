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
    $("#my-resources-container").prepend(createMyResourceElement(resource));
  });
  loadModal();
}

function createMyResourceElement(resourceData) {
  const resource = `<section class="resources card" id="${escape(
    resourceData.id
  )}">
  <div class="resourceImg">
    <img src="${escape(
      resourceData.cover_photo_url ? resourceData.cover_photo_url : ""
    )}" class = "card-img-top resource-img"></img>
  </div>
  <div class='textbody card-body'>
    <h5 class = 'card-title'>${escape(resourceData.title)}</h5>
    <p class = 'description'>${escape(resourceData.description)}</p>
  </div>
  <div class="resource-stats">
    <p class="resource-timestamp">Date here </p>
    <form>
      <div class="arrows">
        <i class="fas fa-plus" id="add-to-my-resources"></i>
        <i class="fas fa-arrow-up " id="up-vote"></i>
        <i class="fas fa-arrow-down " id="down-vote"></i>
      </div>
  </form>
</div>
</section>
`;
  return $(resource);
}
