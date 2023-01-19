document.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-me")) {
    //id
    //newData
    const id = event.target.getAttribute("data-id");
    const newData = prompt("Enter your new todo text");

    console.log(id, newData);

    axios
      .post("/edit-item", { id, newData })
      .then((res) => {
        if (res.data.status !== 200) {
          alert(res.data.message);
          return;
        }

        event.target.parentElement.parentElement.querySelector(
          ".item-text"
        ).innerHTML = newData;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (event.target.classList.contains("delete-me")) {
    console.log("delete click");
  }
});

//frontend <----> post(axios) API <----> Backend (controller) <----> Db
