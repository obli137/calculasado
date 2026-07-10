// Inicializa el objeto MP
const mp = new MercadoPago('APP_USR-a7b45ff0-8db3-4086-a12b-5607c1b98016');

// Inicializa el formulario
const cardForm = mp.cardForm({
    amount: "100.50",
    form: {
        id: "form-checkout",
        cardNumber: {
            id: "form-checkout__cardNumber",
            placeholder: "Número de tarjeta",
        },
        expirationDate: {
            id: "form-checkout__cardExpirationDate",
            placeholder: "MM/YY",
        },
        securityCode: {
            id: "form-checkout__securityCode",
            placeholder: "Código de seguridad",
        },
        cardholderName: {
            id: "form-checkout__cardholderName",
            placeholder: "Titular de la tarjeta",
        },
        issuer: {
            id: "form-checkout__issuer",
            placeholder: "Banco emisor",
        },
        installments: {
            id: "form-checkout__installments",
            placeholder: "Cuotas",
        },
    },
    callbacks: {
        onFormMounted: error => {
            if (error) console.log("Form Mounted error: ", error);
        },
        onSubmit: event => {
            event.preventDefault();

            const cardData = cardForm.getCardFormData();
            
            // Envía los datos a tu backend
            fetch("/process_payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cardData)
            })
            .then(response => response.json())
            .then(result => {
                // Maneja la respuesta
                if(result.status === "approved") {
                    alert("¡Pago aprobado!");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        }
    }
}); 