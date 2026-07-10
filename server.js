const express = require('express');
const mercadopago = require('mercadopago');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// Configura Supabase
const supabaseUrl = 'https://nscxbyjhbdgczzmoxvwo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zY3hieWpoYmRnY3p6bW94dndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MzI5MjcsImV4cCI6MjA1MTQwODkyN30.iYMiUkyngoJvCnwzkrUr_BoDCwRQmsiR4HhHkN8OSR4'
const supabase = createClient(supabaseUrl, supabaseKey)

// Configura Mercado Pago
mercadopago.configure({
    access_token: 'APP_USR-1467512313334329-020508-71a00b7aa9d1ba9529cfd932ef48bdfe-56835615'
});

// Ruta para procesar pagos
app.post("/process_payment", async (req, res) => {
    try {
        const payment_data = {
            transaction_amount: 100.50,
            token: req.body.token,
            description: 'Descripción del producto',
            installments: Number(req.body.installments),
            payment_method_id: req.body.paymentMethodId,
            issuer_id: req.body.issuerId,
            payer: {
                email: req.body.cardholderEmail
            }
        };

        const payment = await mercadopago.payment.save(payment_data);
        
        // Guardar el pago en Supabase
        const { data, error } = await supabase
            .from('pagos')  // Ajusta al nombre de tu tabla
            .insert([
                {
                    payment_id: payment.response.id,
                    status: payment.response.status,
                    amount: payment.response.transaction_amount,
                    email: req.body.cardholderEmail,
                    // Agrega otros campos que necesites
                }
            ]);

        if (error) throw error;

        res.json(payment.response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Tus rutas existentes de Supabase
app.get("/api/datos", async (req, res) => {
    const { data, error } = await supabase
        .from('tu_tabla')
        .select('*');
    
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    
    res.json(data);
});

app.listen(3000, () => console.log('Server running')); 