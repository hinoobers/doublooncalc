document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    function notify(msg) {
        alert(msg)
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const currentDoubloons = parseInt(document.getElementById("currentDoubloons").value);
        const desiredDoubloons = parseInt(document.getElementById("desiredDoubloons").value);

        if(desiredDoubloons > 6675) {
            notify("You can't desire more than 6675 doubloons! (Most expensive item in the shop")
            return;
        }

        if(currentDoubloons > 6675) {
            notify("You can afford anything in the shop, why use a calculator?")
            return;
        }



        if(currentDoubloons >= desiredDoubloons) {
            notify("You have enough doubloons already!")
            return;
        }

        const unSubmittedHours = parseInt(document.getElementById("unsubmittedHours").value) || 0;
        console.log(unSubmittedHours);

        if(currentDoubloons + (unSubmittedHours * 2) >= desiredDoubloons) {
            // Avoid lying, and only send this if it's 100% true that unsubmitted + current > desired

            notify("You have 100% chance of reaching your goal after submitting your hours!");
            return;
        }

        const predictPPH = document.getElementById("predictPPHYes").checked

        // Pointless to do the calculation serverside
        const simulations = Math.floor(rand(1000, 100_000));
        let totalHours = 0;
        let totalPPH = 0;
        for(let i = 0; i < simulations; i++) {
            let pph;

            // less than 10% chance of getting a PPH of < ~7
            // Estimate guess, not factually accurate ^^
            if(rand(10, 100) <= 10) {
                pph = rand(2, 20);
            } else {
                // Also as a realistic approach, remove some of the high values, while tehnically impossible, not feasible in a prediction
                pph = rand(8, 17);
            }
            if(!predictPPH) {
                pph = 9;
            }

            let hours = 0;
            let doubloons = currentDoubloons;

            // add unsubmitted hours
            doubloons += unSubmittedHours * pph;

            while(doubloons < desiredDoubloons) {
                doubloons += pph;
                hours++;
            }

            totalHours += hours;
            totalPPH += pph;
        }

        console.log(totalHours, simulations);

        document.getElementById("results").style.display = "block";
        document.getElementById("simulations").innerText = `According to ${simulations/1000}K simulations,`
        document.getElementById("hoursNeeded").innerText = `You will need to work an average of ${(totalHours / simulations).toFixed(2)} hour(s) to reach your goal.`;
        document.getElementById("pph").innerText = `Average PPH was: ${(totalPPH / simulations).toFixed(2)}`;
    });
});