

const where = encodeURIComponent(JSON.stringify({
  "country": {
    "__type": "Pointer",
    "className": "Country",
    "objectId": "5Vs8zprtNC"
  }}))

const getCityList = () => {
      
      axios.get(`https://parseapi.back4app.com/classes/Continentscountriescities_Subdivisions_States_Provinces?limit=200&order=name&where=${where}`, {
        headers: 
        {
          'X-Parse-Application-Id': '8lFUxW5GUgxhP7mgC767mDx8bt8yUm8iZYXMxziq',
          'X-Parse-REST-API-Key': 'rmUiExtQ0rJjOwm825bGnuBN1SfxZZjmirTmyIDv'
        }
      })
        .then((result) => {
          const cities = result.data.results
          let capitals = []

          

          cities.forEach((city, index) => {
            const option = document.getElementById('cities-full-list')
            const capital = document.createElement('option')
            const indexValue = index

            capital.setAttribute("value", `value${indexValue}`)

            const capitalText = document.createTextNode(`${city.Subdivision_Name}`)

            capital.appendChild(capitalText)
            option.appendChild(capital)
            
          });
        })
        .catch((err) => {
          console.log(err)
        }) 
}


// const getOneCity = ()=>{

//   document.querySelectorAll("option")

// }



document.addEventListener('DOMContentLoaded', () => {

  getCityList() 

  // document.getElementById("get-city-button").addEventListener("click", event =>{
  //   getOneCity()
  // })

}, false);



