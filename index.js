const input = document.getElementById("form-input");
const result = document.querySelector(".result");
const button = document.querySelector("button");
const getCountryNames = new Intl.DisplayNames(["en"], { type: "region" });

button.addEventListener("click", async () => {
  const searchName = input.value.trim();
  result.innerHTML = "";

  if (searchName === "") {
    result.innerHTML = "Please enter a name.";
    return;
  }

  try {
    button.setAttribute("disabled", true);
    button.textContent = "Please wait:";
    const response = await fetch(
      `https://api.nationalize.io?name=${searchName}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resultJSON = await response.json();

    if (resultJSON.country && resultJSON.country.length > 0) {
      const topCountry = resultJSON.country[0]; //note to self: remember to change this code to show country with the most frequent usage of the particular name
      const fullCountryName = getCountryNames.of(topCountry.country_id);

      result.innerHTML = `${searchName} is most likely from <strong>${fullCountryName}</strong> with ${(topCountry.probability * 100).toFixed(0)}% certainty.`;
    } else {
      result.innerHTML = `No data found for the name "${searchName}".`;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    result.innerHTML = `Something went wrong: ${error.message}`;
  } finally {
    button.removeAttribute("disabled");
    button.textContent = "Search";
  }
});
