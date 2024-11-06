const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>`
const popup = document.getElementById("popup");
let timer;
let closeBtnElement;

export function createPopup(msg, isCorrect, timeout = 1500) {
    console.log(popup.style.bottom);
    
    popup.innerHTML = "";
    const paragraph = document.createElement("p");  
    paragraph.innerHTML = msg;
    
    
    closeBtnElement = document.createElement("button");
    closeBtnElement.setAttribute("id", "close-btn");    
    closeBtnElement.innerHTML = closeIcon;
    
    closeBtnElement.addEventListener("click", () => closePopup());
    
    popup.append(paragraph, closeBtnElement);
    popup.classList.remove("correct");
    popup.classList.remove("incorrect");
    popup.classList.add(isCorrect ? "correct" : "incorrect");

    showPopup();
    timer = setTimeout(closePopup, timeout);
}

function closePopup() {
    clearTimeout(timer);
    popup.classList.add("hidden");
    popup.classList.remove("correct");
    popup.classList.remove("incorrect");
    if (closeBtnElement){
        closeBtnElement.removeEventListener("click", closePopup);
    }
}

function showPopup() {
    popup.classList.remove("hidden");
}

