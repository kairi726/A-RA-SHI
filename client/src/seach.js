fetch("http://localhost:8080/server/api/search_spots.php?genre=cafe")
  .then(res => res.json())
  .then(data => console.log(data));
