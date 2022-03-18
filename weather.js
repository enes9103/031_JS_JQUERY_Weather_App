//getElementsByClassName ==> $(".selector")
const formJS2 = document.querySelector(".top-banner form")[0];
const formJS = $(".top-banner form")[0];
const formJQuery = $(".top-banner form").eq(0);
const formJQuery2 = $(".top-banner form").first();

const inputJQuery = $(".top-banner input").eq(0);
const inputJS = $(".top-banner input")[0];

const msg = $(".top-banner span").eq(0);
const list = $(".cities").eq(0);


//window.addEventListener("load", func) == window.onload
$(window).on("load", ()=>{
    console.log("window loaded");
    localStorage.setItem("apiKey", EncryptStringAES("4d8fb5b93d4af21d66a2948710284366"));
});

//window.addEventListener("DOMContentLoaded", func)
$(document).ready(()=>{
    console.log("DOMContentLoaded");
    localStorage.setItem("apiKey", EncryptStringAES("4d8fb5b93d4af21d66a2948710284366"));
});

formJQuery.on("submit", e =>{
    e.preventDefault();
    // alert("form submitted!");
    getWeatherDataFromApi();
});

const getWeatherDataFromApi =()=>{
    let apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
    // let inputVal = inputJS.value;
    let inputVal = inputJQuery.val();
    let units = "metric";
    let lang = "tr";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=${units}&lang=${lang}`;

    $.ajax({
        url:url,
        type : "GET",
        dataType : "json",
        success : (response) =>{
            console.log(response);
            const { main, name, sys, weather } = response;
            // querySelector == find
            const cityListItem = list.find(".city");
            //Array.from == get()
            const cityArray = cityListItem.get();
            console.log(cityArray);
            if (cityArray.length > 0) {
                const filteredArray = cityArray.filter(card => $(card).find(".city-name span").text() == name);
                if (filteredArray.length > 0) {
                    msg.text(`You already know the weather for ${name}, Please search for another city 😉`);
                    // msg.css("color","yellow");
                    msg.css({"color":"yellow", "text-decoration":"underline"});
                    setTimeout(()=>{
                        msg.text("");
                      },5000);
                      formJS.reset();
                      //js focus() == jquery focus()
                      inputJS.focus();
                      return;
                }
            }
            console.log(name);
            const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
            //create li element
            const createdLi = $(document.createElement("li"));
            createdLi.addClass("city");
            createdLi.html(`
            <h2 class="city-name" data-name="${name}, ${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
                <img class="city-icon" src="${iconUrl}">
                <figcaption>${weather[0].description}</figcaption>
            </figure>`);
            list.prepend(createdLi);
            formJS.reset();
            inputJQuery.focus();
            // console.log(createdLi);
        },
        beforeSend : (request) =>{
            //header data to API
            // request.headers...
        },
        complete: () =>{
            //ajax completed    
        },
        error : (XMLHttpRequest) =>{
            console.log(XMLHttpRequest);
            msg.text(XMLHttpRequest.status + " " + XMLHttpRequest.statusText);
            msg.css({"color":"red", "text-decoration":"underline"});
            setTimeout(()=>{
                msg.text("");
              }, 5000);
              formJS.reset();
              inputJS.focus();
        }
    });

}