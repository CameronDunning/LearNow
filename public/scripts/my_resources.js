$(".my-resources-selection").on("click", function() {
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
        console.log(data);
        //renderResources here
      }
    });
  } catch (err) {
    console.log(err);
  }
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
