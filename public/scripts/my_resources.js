$(".my-resources-selection").on("click", function() {
  loadMyResources();
});

async function loadMyResources() {
  try {
    await $.ajax({
      url: "http://localhost:8080/api/my_resources",
      dataType: "JSON",
      success: data => {
        $("#my-resources-container").empty(); //clears the container before loading updated data
        renderMyResources(data);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function renderMyResources(resources) {
  resources.forEach(resource => {
    $("#my-resources-container").prepend(createMyResourceElement(resource));
  });
  loadModal();
}

let myResourceIdCounter = 0;
function createMyResourceElement(resourceData) {
  const resource = `<section class="resources card" id="mr${myResourceIdCounter++}">
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

//button on click
//ajax call depending on the button
//fetch data from db (apiresources)
//append cards corresponding to it
//loadModal

// $(".liked-resources-selection").on("click", function() {
//   console.log("toggled liked resources");

//   $.fn.serializeObject = function() {
//     var o = {};
//     this.find("[name]").each(function() {
//       o[this.name] = this.value;
//     });
//     return o;
//   };

//   async function loadMyResources() {
//     try {
//       await $.ajax({
//         url: "http://localhost:8080/my_resources",
//         dataType: "JSON",
//         success: data => {
//           console.log(data);
//           //renderResources here
//         }
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }
// });
