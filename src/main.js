import "./css/index.css"
import IMask from "imask"

function setCardType(type) {
    const cardBackgroundColor1 = document.querySelector("#cc-background-01")
    const cardBackgroundColor2 = document.querySelector("#cc-background-02")
    const colors = {
        visa: ["#436D99", "#2D57F2"],
        mastercard: ["#DF6F29", "#C69347"],
        default: ["black", "gray"]
    }

    cardBackgroundColor1.setAttribute("fill", colors[type][0])
    cardBackgroundColor2.setAttribute("fill", colors[type][1])
    document.querySelector("#card-brand").setAttribute("src", `cc-${type}.svg`)
}

function updateCardNumber(number) {
    const previewNumber = document.querySelector("#preview-number")
    previewNumber.innerText = number ? number : "1234 5678 9012 3456"
}

function updateHolder() {
    const previewHolder = document.querySelector("#preview-holder-name")
    previewHolder.innerText = cardHolder.value.replace(/ /g, "") ? cardHolder.value : "CARLOS ALBERTO"
}

function updateExpirationDate (date) {
    const previewExpirationDate = document.querySelector("#preview-expiration-date")
    previewExpirationDate.innerText = date ? date : "02/32"
}

function updateSecurityCode(code) {
    const previewSecurityCode = document.querySelector("#preview-security-code")
    previewSecurityCode.innerText = code ? code : "123"
}

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
    updateHolder()
})

const cardNumber = document.querySelector('#card-number')
const cardNumberMasked = IMask(cardNumber, {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: "visa"
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard"
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default"
        }
    ],
    dispatch: (appended, dynamicMask) => {
        const number = (dynamicMask.value + appended).replace(/\D/g, "")
        return dynamicMask.compiledMasks.find(({regex}) => {
            return number.match(regex)
        })
    }
})
cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)
})

const expirationDate = document.querySelector("#expiration-date")
const forwardMonth = Number(new Date().getMonth()) + 2
const currentYear = Number(new Date().getFullYear().toString().slice(2))
const tenYearsAhead = currentYear + 10
const expirationDateMasked = IMask(expirationDate, {
    mask: "MM{/}YY",
    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: forwardMonth,
            to: 12
        },

        YY: {
            mask: IMask.MaskedRange,
            from: currentYear,
            to: tenYearsAhead
        }
    }
})
expirationDateMasked.on("accept", () => {
    updateExpirationDate(expirationDateMasked.value)
})

const securityCode = document.querySelector("#security-code")
const securityCodeMasked = IMask(securityCode, {
    mask: "0000"
})
securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value)
})
