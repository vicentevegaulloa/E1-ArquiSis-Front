# Integración Webpay
Documentación con los pasos seguidos para la integración con Webpay 

# Integracion WebPay

### Primer paso - Solicitud de Compra
Se siguió la documentación de Transbank para crear la transacción en la app, también se siguió el repositorio de la ayudantía para la configuración de la API.

Si el usuario desea realizar una compra presiona el botón **Buy Latest Stock**. Se modificó la función que se encargaba de crear las `Purchases` de manera que se creara la `Purchase` y luego hiciera un POST a la API.

### Segundo paso - Confirmacion de compra
Se recibe la solicitud de la siguiente manera.
```json
{
  "token": <string>,
  "url": <string>
}
```

Una vez generada la transansacción se modifica el campo `deposittoken` de la `Purchase` para guardar el `token`. Tras ello tanto la `url` como el `token`. 

Una vez recibidos ambos en el frontend aparece un botón llamado **Confirm Purchase** que redirige a la página de pago de Trabsbank. La redirección se  hace de la manera recomendada por la ayudantía: ```html
<form action={url} method="POST">
  <input type="hidden" value={token} name="token_ws" />
  ....
</form>
```

### Tercer paso - WebPay y estado de transaccion
El usuario realiza la compra/la anula y se redirige al main de la aplicación (url especificada al crear la transacción). Se incluye un query param `token_ws` con el valor del token de la transaccion.


### Cuarto paso - Confirmacion de transaccion

Fronend realiza una request POST a la API con el `token_ws` para poder realizar la confirmacion de la transaccion con WebPay. La función en el backend revisa los 3 casos posibles 
- Compra anulada: `token_ws` no existe.
- Compra aprobada: `response_code` es 0. 
- Compra cancelada: `response_code` es diferente de 0.
Tras realizar la request se envía el resultado de esta por el canal `stocks/validations`

Una vez confirmada la transaccion se muestra en el frontend el resultado de esta.



